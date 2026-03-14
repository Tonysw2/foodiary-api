import type { Goal } from '@app/entities/goal'
import { PutCommand, type PutCommandInput } from '@aws-sdk/lib-dynamodb'
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
}
