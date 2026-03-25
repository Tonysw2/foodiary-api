import { Meal } from '@app/entities/meal'
import { ResourceNotFound } from '@app/errors/application/resource-not-found'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { MealsAIGateway } from '@infra/ai/gateways/meals-ai-gateway'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { MealRepository } from '@infra/database/dynamo/repositories/meal-repository'
import { Injectable } from '@kernel/decorators/injectable'

const MAX_ATTEMPTS = 2

@Injectable()
export class ProcessMealUseCaseUseCase {
  constructor(
    private readonly mealRepository: MealRepository,
    private readonly mealsAIGateway: MealsAIGateway,
  ) {}

  async execute({
    accountId,
    mealId,
  }: ProcessMealUseCaseUseCase.Input): Promise<ProcessMealUseCaseUseCase.Output> {
    const meal = await this.mealRepository.findById({ accountId, mealId })

    if (!meal) {
      throw new ResourceNotFound(`Meal "${mealId}" not found.`)
    }

    if (meal.status === Meal.Status.PENDING) {
      throw new Error(`Meal "${mealId}" is still uploading.`)
    }

    if (meal.status === Meal.Status.PROCESSING) {
      throw new Error(`Meal "${mealId}" is being processed.`)
    }

    if (meal.status === Meal.Status.SUCCESS) {
      return
    }

    try {
      meal.status = Meal.Status.PROCESSING
      meal.attempts += 1
      await this.mealRepository.save(meal)

      const { name, icon, foods } = await this.mealsAIGateway.process(meal)

      meal.name = name
      meal.icon = icon
      meal.foods = foods
      meal.status = Meal.Status.SUCCESS
      await this.mealRepository.save(meal)
    } catch (error) {
      meal.status =
        meal.attempts >= MAX_ATTEMPTS ? Meal.Status.FAILED : Meal.Status.QUEUED

      await this.mealRepository.save(meal)

      throw error
    }
  }
}

export namespace ProcessMealUseCaseUseCase {
  export type Input = {
    accountId: string
    mealId: string
  }

  export type Output = undefined
}
