import type { Account } from '@app/entities/account'
import { dynamoClient } from '@infra/clients/dynamo-client'
import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { Injectable } from '@kernel/decorators/injectable'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { AppConfig } from '@shared/config/app-config'
import { AccountItem } from '../items/account-item'

@Injectable()
export class AccountRepository {
  constructor(private readonly appConfig: AppConfig) {}

  async findByEmail(email: string): Promise<Account | null> {
    const command = new QueryCommand({
      TableName: this.appConfig.database.dynamodb.mainTableName,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :GSI1PK AND GSI1SK = :GSI1SK',
      ExpressionAttributeValues: {
        ':GSI1PK': AccountItem.getGSI1PK(email),
        ':GSI1SK': AccountItem.getGSI1SK(email),
      },
      Limit: 1,
    })

    const { Items = [] } = await dynamoClient.send(command)
    const account = Items[0] as AccountItem.ItemType | undefined

    if (!account) {
      return null
    }

    return AccountItem.toEntity(account)
  }

  async create(account: Account): Promise<void> {
    const accountItem = AccountItem.fromEntity(account)

    const command = new PutCommand({
      TableName: this.appConfig.database.dynamodb.mainTableName,
      Item: accountItem.toItem(),
    })

    await dynamoClient.send(command)
  }
}
