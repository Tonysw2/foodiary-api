import { Meal } from '@app/entities/meal'
import { getImagePrompt } from '@infra/ai/prompts/get-image-prompt'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { MealsFileStorageGateway } from '@infra/gateways/storage/meals-file-storage-gateway'
import { Injectable } from '@kernel/decorators/injectable'
import { OpenAI } from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'

const MealSchema = z.object({
  name: z.string(),
  icon: z.string(),
  foods: z.array(
    z.object({
      name: z.string(),
      quantity: z.string(),
      calories: z.number(),
      proteins: z.number(),
      carbohydrates: z.number(),
      fats: z.number(),
    }),
  ),
})

@Injectable()
export class MealsAIGateway {
  private readonly openai = new OpenAI()

  constructor(
    private readonly mealsFileStorageGateway: MealsFileStorageGateway,
  ) {}

  async process(meal: Meal): Promise<MealsAIGateway.ProcessMealResult> {
    if (meal.inputType === Meal.InputType.PICTURE) {
      const imageURL = this.mealsFileStorageGateway.getInputFileURL(
        meal.inputFileKey,
      )

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4.1-mini',
        response_format: zodResponseFormat(MealSchema, 'meal'),
        messages: [
          {
            role: 'system',
            content: getImagePrompt(),
          },
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: imageURL,
                  detail: 'high',
                },
              },
              {
                type: 'text',
                text: `Meal date: ${meal.createdAt}`,
              },
            ],
          },
        ],
      })

      const json = response.choices[0].message.content

      if (!json) {
        console.error('OpenAI response:', JSON.stringify(response, null, 2))
        throw new Error(`Failed processing meal "${meal.id}"`)
      }

      const { success, data, error } = MealSchema.safeParse(JSON.parse(json))

      if (!success) {
        console.log('Zod error:', error)
        console.error('OpenAI response:', JSON.stringify(response, null, 2))
        throw new Error(`Failed processing meal "${meal.id}"`)
      }

      return data
    }

    return {
      name: '',
      icon: '',
      foods: [],
    }
  }
}

export namespace MealsAIGateway {
  export type ProcessMealResult = {
    name: string
    icon: string
    foods: Meal.Food[]
  }
}
