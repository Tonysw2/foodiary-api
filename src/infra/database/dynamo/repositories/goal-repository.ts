import type { Goal } from '@app/entities/goal'
import {
  GetCommand,
  PutCommand,
  type PutCommandInput,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb'
import { dynamoClient } from '@infra/clients/dynamo-client'
import { Injectable } from '@kernel/decorators/injectable'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { AppConfig } from '@shared/config/app-config'
import { GoalItem } from '../items/goal-item'

@Injectable()
export class GoalRepository {
  constructor(private readonly appConfig: AppConfig) {}

  getPutCommand(goal: Goal): PutCommandInput {
    return {
      TableName: this.appConfig.database.dynamodb.mainTableName,
      Item: GoalItem.fromEntity(goal).toItem(),
    }
  }

  async create(goal: Goal): Promise<void> {
    await dynamoClient.send(new PutCommand(this.getPutCommand(goal)))
  }

  async findByAccountId(accountId: string): Promise<Goal | null> {
    const command = new GetCommand({
      TableName: this.appConfig.database.dynamodb.mainTableName,
      Key: {
        PK: GoalItem.getPK(accountId),
        SK: GoalItem.getSK(accountId),
      },
    })

    const { Item: goalItem } = await dynamoClient.send(command)

    if (!goalItem) {
      return null
    }

    return GoalItem.toEntity(goalItem as GoalItem.ItemType)
  }

  async save({
    accountId,
    calories,
    proteins,
    carbohydrates,
    fats,
  }: Goal): Promise<void> {
    const command = new UpdateCommand({
      TableName: this.appConfig.database.dynamodb.mainTableName,
      Key: {
        PK: GoalItem.getPK(accountId),
        SK: GoalItem.getSK(accountId),
      },
      UpdateExpression:
        'SET calories = :calories, proteins = :proteins, carbohydrates = :carbohydrates, fats = :fats',
      ExpressionAttributeValues: {
        ':calories': calories,
        ':proteins': proteins,
        ':carbohydrates': carbohydrates,
        ':fats': fats,
      },
    })

    await dynamoClient.send(command)
  }
}
