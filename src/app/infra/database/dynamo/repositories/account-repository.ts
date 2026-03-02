import type { Account } from '@app/entities/account'
import { dynamoClient } from '@app/infra/clients/dynamo-client'
import { PutCommand } from '@aws-sdk/lib-dynamodb'
import { Injectable } from '@kernel/decorators/injectable'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { AppConfig } from '@shared/config/app-config'
import { AccountItem } from '../items/account-item'

@Injectable()
export class AccountRepository {
  constructor(private readonly appConfig: AppConfig) {}

  async create(account: Account): Promise<void> {
    const accountItem = AccountItem.fromEntity(account)

    const command = new PutCommand({
      TableName: this.appConfig.database.dynamodb.mainTableName,
      Item: accountItem.toItem(),
    })

    await dynamoClient.send(command)
  }
}
