import type { IQueueConsumer } from '@app/contracts/queue-consumer-impl'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { ProcessMealUseCaseUseCase } from '@app/use-cases/meals/process-meal-use-case'
import type { MealsQueueGateway } from '@infra/gateways/queue/meals-queue-gateway'
import { Injectable } from '@kernel/decorators/injectable'

@Injectable()
export class MealsQueueConsumer
  implements IQueueConsumer<MealsQueueGateway.Message>
{
  constructor(private readonly processMealUseCase: ProcessMealUseCaseUseCase) {}

  async process({
    accountId,
    mealId,
  }: MealsQueueGateway.Message): Promise<void> {
    await this.processMealUseCase.execute({ accountId, mealId })
  }
}
