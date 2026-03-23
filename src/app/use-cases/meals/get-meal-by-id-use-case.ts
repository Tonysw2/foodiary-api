import type { Meal } from '@app/entities/meal.js'
import { ResourceNotFound } from '@app/errors/application/resource-not-found.js'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { MealRepository } from '@infra/database/dynamo/repositories/meal-repository.js'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { MealsFileStorageGateway } from '@infra/gateways/storage/meals-file-storage-gateway.js'
import { Injectable } from '@kernel/decorators/injectable.js'

@Injectable()
export class GetMealByIdUseCase {
  constructor(
    private readonly mealRepository: MealRepository,
    private readonly mealsFileStorageGateway: MealsFileStorageGateway,
  ) {}

  async execute({
    accountId,
    mealId,
  }: GetMealByIdUseCase.Input): Promise<GetMealByIdUseCase.Output> {
    const meal = await this.mealRepository.findById({ accountId, mealId })

    if (!meal) {
      throw new ResourceNotFound('Meal not found.')
    }

    return {
      meal: {
        id: meal.id,
        name: meal.name,
        icon: meal.icon,
        foods: meal.foods,
        status: meal.status,
        createdAt: meal.createdAt,
        inputType: meal.inputType,
        inputFileURL: this.mealsFileStorageGateway.getInputFileURL(meal.inputFileKey),
      },
    }
  }
}

export namespace GetMealByIdUseCase {
  export type Input = {
    accountId: string
    mealId: string
  }

  export type Output = {
    meal: {
      id: string
      name: string
      icon: string
      createdAt: Date
      foods: Meal.Food[]
      status: Meal.Status
      inputType: Meal.InputType
      inputFileURL: string
    }
  }
}
