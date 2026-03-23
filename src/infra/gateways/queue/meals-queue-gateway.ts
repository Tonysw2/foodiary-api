import { SendMessageCommand } from '@aws-sdk/client-sqs'
import { sqsClient } from '@infra/clients/sqs-client.js'
import { Injectable } from '@kernel/decorators/injectable.js'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { AppConfig } from '@shared/config/app-config.js'

@Injectable()
export class MealsQueueGateway {
  constructor(private readonly appConfig: AppConfig) {}

  async publish(message: MealsQueueGateway.Message): Promise<void> {
    const command = new SendMessageCommand({
      QueueUrl: this.appConfig.queue.mealsQueueUrl,
      MessageBody: JSON.stringify(message),
    })

    await sqsClient.send(command)
  }
}

export namespace MealsQueueGateway {
  export type Message = {
    mealId: string
    accountId: string
  }
}
