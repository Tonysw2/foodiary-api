import type { Meal } from '@app/entities/meal'
import { PutCommand } from '@aws-sdk/lib-dynamodb'
import { dynamoClient } from '@infra/clients/dynamo-client'
import { MealItem } from '@infra/database/dynamo/items/meal-item'
import { Injectable } from '@kernel/decorators/injectable'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { AppConfig } from '@shared/config/app-config'

@Injectable()
export class MealRepository {
  constructor(private readonly appConfig: AppConfig) {}

  async create(meal: Meal): Promise<void> {
    await dynamoClient.send(
      new PutCommand({
        TableName: this.appConfig.database.dynamodb.mainTableName,
        Item: MealItem.fromEntity(meal).toItem(),
      }),
    )
  }
}
