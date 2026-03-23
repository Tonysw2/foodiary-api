import type { Meal } from '@app/entities/meal'
import { GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'
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

  async save(meal: Meal): Promise<void> {
    const command = new UpdateCommand({
      TableName: this.appConfig.database.dynamodb.mainTableName,
      Key: {
        PK: MealItem.getPK({ accountId: meal.accountId, mealId: meal.id }),
        SK: MealItem.getSK({ accountId: meal.accountId, mealId: meal.id }),
      },
      UpdateExpression:
        'SET #status = :status, attempts = :attempts, #name = :name, icon = :icon, foods = :foods',
      ExpressionAttributeNames: { '#status': 'status', '#name': 'name' },
      ExpressionAttributeValues: {
        ':status': meal.status,
        ':attempts': meal.attempts,
        ':name': meal.name,
        ':icon': meal.icon,
        ':foods': meal.foods,
      },
    })

    await dynamoClient.send(command)
  }

  async findById({
    accountId,
    mealId,
  }: MealRepository.FindByIdParams): Promise<Meal | null> {
    const command = new GetCommand({
      TableName: this.appConfig.database.dynamodb.mainTableName,
      Key: {
        PK: MealItem.getPK({ accountId, mealId }),
        SK: MealItem.getSK({ accountId, mealId }),
      },
    })

    const { Item } = await dynamoClient.send(command)

    if (!Item) {
      return null
    }

    return MealItem.toEntity(Item as MealItem.ItemType)
  }
}

export namespace MealRepository {
  export type FindByIdParams = {
    accountId: string
    mealId: string
  }
}
