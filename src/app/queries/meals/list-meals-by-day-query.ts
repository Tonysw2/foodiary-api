import { Meal } from '@app/entities/meal'
import { QueryCommand } from '@aws-sdk/lib-dynamodb'
import { dynamoClient } from '@infra/clients/dynamo-client'
import { MealItem } from '@infra/database/dynamo/items/meal-item'
import { Injectable } from '@kernel/decorators/injectable'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { AppConfig } from '@shared/config/app-config'

@Injectable()
export class ListMealsByDayQuery {
  constructor(private readonly appConfig: AppConfig) {}

  async execute(
    input: ListMealsByDayQuery.Input,
  ): Promise<ListMealsByDayQuery.Output> {
    const command = new QueryCommand({
      TableName: this.appConfig.database.dynamodb.mainTableName,
      IndexName: 'GSI1',
      KeyConditionExpression: '#GSI1PK = :GSI1PK',
      FilterExpression: '#status = :status',
      ScanIndexForward: false,
      ProjectionExpression: '#GSI1PK, #id, #name, #icon, #foods, #createdAt',
      ExpressionAttributeNames: {
        '#GSI1PK': 'GSI1PK',
        '#id': 'id',
        '#name': 'name',
        '#icon': 'icon',
        '#foods': 'foods',
        '#createdAt': 'createdAt',
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':GSI1PK': MealItem.getGSI1PK({
          accountId: input.accountId,
          createdAt: input.date,
        }),
        ':status': Meal.Status.SUCCESS,
      },
    })

    const { Items = [] } = await dynamoClient.send(command)
    const items = Items as ListMealsByDayQuery.MealItemType[]

    const meals: ListMealsByDayQuery.Output['meals'] = items.map((item) => ({
      id: item.id,
      name: item.name,
      icon: item.icon,
      foods: item.foods,
      createdAt: item.createdAt,
    }))

    return {
      meals,
    }
  }
}

export namespace ListMealsByDayQuery {
  export type Input = {
    accountId: string
    date: Date
  }

  export type Output = {
    meals: {
      id: string
      createdAt: string
      name: string
      icon: string
      foods: Meal.Food[]
    }[]
  }

  export type MealItemType = {
    GSI1PK: string
    id: string
    name: string
    icon: string
    createdAt: string
    foods: Meal.Food[]
  }
}
