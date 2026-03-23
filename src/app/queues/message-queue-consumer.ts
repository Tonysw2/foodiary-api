import type { IQueueConsumer } from '@app/contracts/queue-consumer-impl'
import type { MealsQueueGateway } from '@infra/gateways/queue/meals-queue-gateway'
import { Injectable } from '@kernel/decorators/injectable'

@Injectable()
export class MealsQueueConsumer
  implements IQueueConsumer<MealsQueueGateway.Message>
{
  async process({
    accountId,
    mealId,
  }: MealsQueueGateway.Message): Promise<void> {
    console.log(JSON.stringify({ accountId, mealId }, null, 2))
  }
}
