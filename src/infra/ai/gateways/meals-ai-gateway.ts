import { Meal } from '@app/entities/meal'
import { getImagePrompt } from '@infra/ai/prompts/get-image-prompt'
import { getTextPrompt } from '@infra/ai/prompts/get-text-prompt'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { MealsFileStorageGateway } from '@infra/gateways/storage/meals-file-storage-gateway'
import { Injectable } from '@kernel/decorators/injectable'
import { downloadFile } from '@shared/utils/download-file'
import { OpenAI, toFile } from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import type { ChatCompletionContentPart } from 'openai/resources/index.js'
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
    const fileURL = this.mealsFileStorageGateway.getInputFileURL(
      meal.inputFileKey,
    )

    if (meal.inputType === Meal.InputType.PICTURE) {
      return this.callAI({
        mealId: meal.id,
        systemPrompt: getImagePrompt(),
        userMessageParts: [
          { type: 'image_url', image_url: { url: fileURL, detail: 'high' } },
          { type: 'text', text: `Meal date: ${meal.createdAt}` },
        ],
      })
    }

    const transcription = await this.transcribe(fileURL)

    return this.callAI({
      mealId: meal.id,
      systemPrompt: getTextPrompt(),
      userMessageParts: `Meal date: ${meal.createdAt}\n\nMeal: ${transcription}`,
    })
  }

  private async callAI({
    mealId,
    systemPrompt,
    userMessageParts,
  }: MealsAIGateway.CallAIParams): Promise<MealsAIGateway.ProcessMealResult> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      response_format: zodResponseFormat(MealSchema, 'meal'),
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userMessageParts,
        },
      ],
    })

    const json = response.choices[0].message.content

    if (!json) {
      console.error('OpenAI response:', JSON.stringify(response, null, 2))
      throw new Error(`Failed processing meal "${mealId}"`)
    }

    const { success, data, error } = MealSchema.safeParse(JSON.parse(json))

    if (!success) {
      console.log('Zod error:', error)
      console.error('OpenAI response:', JSON.stringify(response, null, 2))
      throw new Error(`Failed processing meal "${mealId}"`)
    }

    return data
  }

  private async transcribe(audioFileURL: string) {
    const audioFile = await downloadFile(audioFileURL)

    const { text } = await this.openai.audio.transcriptions.create({
      model: 'whisper-1',
      file: await toFile(audioFile, 'audio.m4a', {
        type: 'audio/m4a',
      }),
    })

    return text
  }
}

export namespace MealsAIGateway {
  export type ProcessMealResult = {
    name: string
    icon: string
    foods: Meal.Food[]
  }

  export type CallAIParams = {
    mealId: string
    systemPrompt: string
    userMessageParts: string | ChatCompletionContentPart[]
  }
}
