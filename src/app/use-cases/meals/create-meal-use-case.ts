import { Meal } from '@app/entities/meal.js'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { MealRepository } from '@infra/database/dynamo/repositories/meal-repository.js'
import { MealsFileStorageGateway } from '@infra/gateways/storage/meals-file-storage-gateway.js'
import { Injectable } from '@kernel/decorators/injectable.js'

@Injectable()
export class CreateMealUseCase {
  constructor(
    private readonly mealRepository: MealRepository,
    private readonly mealsFileStorageGateway: MealsFileStorageGateway,
  ) {}

  async execute({
    accountId,
    file,
  }: CreateMealUseCase.Input): Promise<CreateMealUseCase.Output> {
    const inputType =
      file.inputType === 'audio/m4a'
        ? Meal.InputType.AUDIO
        : Meal.InputType.PICTURE

    const inputFileKey = MealsFileStorageGateway.generateInputFileKey({
      accountId,
      inputType,
    })

    const meal = new Meal({
      accountId,
      status: Meal.Status.PENDING,
      inputType,
      inputFileKey,
    })

    const [, { uploadSignature }] = await Promise.all([
      this.mealRepository.create(meal),
      this.mealsFileStorageGateway.createPOST({
        mealId: meal.id,
        accountId,
        file: { fileKey: inputFileKey, fileSize: file.size, inputType },
      }),
    ])

    return {
      mealId: meal.id,
      uploadSignature,
    }
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

  export type Output = {
    mealId: string
    uploadSignature: string
  }
}
