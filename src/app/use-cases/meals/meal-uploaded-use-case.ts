import { Meal } from '@app/entities/meal.js'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { MealRepository } from '@infra/database/dynamo/repositories/meal-repository.js'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { MealsQueueGateway } from '@infra/gateways/queue/meals-queue-gateway'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { MealsFileStorageGateway } from '@infra/gateways/storage/meals-file-storage-gateway.js'
import { Injectable } from '@kernel/decorators/injectable.js'

@Injectable()
export class MealUploadedUseCase {
  constructor(
    private readonly mealRepository: MealRepository,
    private readonly mealsFileStorageGateway: MealsFileStorageGateway,
    private readonly mealsQueueGateway: MealsQueueGateway,
  ) {}

  async execute({ fileKey }: MealUploadedUseCase.Input): Promise<void> {
    const { mealId, accountId } =
      await this.mealsFileStorageGateway.getFileMetadata({ fileKey })

    const meal = await this.mealRepository.findById({ accountId, mealId })

    if (!meal) {
      throw new Error(`[MealUploadedUseCase] Meal not found: ${mealId}`)
    }

    meal.status = Meal.Status.QUEUED
    await this.mealRepository.save(meal)

    await this.mealsQueueGateway.publish({ accountId, mealId })
  }
}

export namespace MealUploadedUseCase {
  export type Input = {
    fileKey: string
  }
}
