import { Meal } from '@app/entities/meal.js'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { MealRepository } from '@infra/database/dynamo/repositories/meal-repository.js'
import { Injectable } from '@kernel/decorators/injectable.js'

const INPUT_TYPE_MAP: Record<string, Meal.InputType> = {
  'image/jpeg': Meal.InputType.PICTURE,
  'audio/m4a': Meal.InputType.AUDIO,
}

@Injectable()
export class CreateMealUseCase {
  constructor(private readonly mealRepository: MealRepository) {}

  async execute(
    input: CreateMealUseCase.Input,
  ): Promise<CreateMealUseCase.Output> {
    const meal = new Meal({
      accountId: input.accountId,
      status: Meal.Status.PENDING,
      inputType: INPUT_TYPE_MAP[input.file.inputType],
      inputFileKey: 'hardcoded-file-key',
    })
    await this.mealRepository.create(meal)
    return { mealId: meal.id }
  }
}

export namespace CreateMealUseCase {
  export type Input = {
    accountId: string
    file: {
      size: number
      inputType: string
    }
  }
  export type Output = { mealId: string }
}
