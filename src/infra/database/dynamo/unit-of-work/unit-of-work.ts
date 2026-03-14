import {
  type PutCommandInput,
  TransactWriteCommand,
  type TransactWriteCommandInput,
} from '@aws-sdk/lib-dynamodb'
import { dynamoClient } from '@infra/clients/dynamo-client'

export abstract class UnitOfWork {
  private transactItems: NonNullable<
    TransactWriteCommandInput['TransactItems']
  > = []

  protected addPut(input: PutCommandInput) {
    this.transactItems.push({ Put: input })
  }

  protected async commit(): Promise<void> {
    await dynamoClient.send(
      new TransactWriteCommand({ TransactItems: this.transactItems }),
    )
  }
}
