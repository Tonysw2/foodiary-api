import type { Profile } from '@app/entities/profile.js'
import { ResourceNotFound } from '@app/errors/application/resource-not-found.js'
import { QueryCommand } from '@aws-sdk/lib-dynamodb'
import { dynamoClient } from '@infra/clients/dynamo-client.js'
import { AccountItem } from '@infra/database/dynamo/items/account-item'
import { Injectable } from '@kernel/decorators/injectable.js'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { AppConfig } from '@shared/config/app-config.js'

@Injectable()
export class GetProfileAndGoalQuery {
  constructor(private readonly appConfig: AppConfig) {}

  async execute({
    accountId,
  }: GetProfileAndGoalQuery.Input): Promise<GetProfileAndGoalQuery.Output> {
    const command = new QueryCommand({
      TableName: this.appConfig.database.dynamodb.mainTableName,
      Limit: 2,
      ProjectionExpression:
        '#PK, #SK, #name, #birthDate, #gender, #height, #weight, #calories, #proteins, #carbohydrates, #fats, #type, #goal',
      KeyConditionExpression: '#PK = :PK AND begins_with(#SK, :SK)',
      ExpressionAttributeNames: {
        '#PK': 'PK',
        '#SK': 'SK',
        '#name': 'name',
        '#birthDate': 'birthDate',
        '#gender': 'gender',
        '#height': 'height',
        '#weight': 'weight',
        '#calories': 'calories',
        '#proteins': 'proteins',
        '#carbohydrates': 'carbohydrates',
        '#fats': 'fats',
        '#type': 'type',
        '#goal': 'goal',
      },
      ExpressionAttributeValues: {
        ':PK': AccountItem.getPK(accountId),
        ':SK': `${AccountItem.getPK(accountId)}#`,
      },
    })

    const { Items = [] } = await dynamoClient.send(command)

    const profileItem = Items.find(
      (item): item is GetProfileAndGoalQuery.ProfileItemType =>
        item.type === 'Profile',
    )

    const goalItem = Items.find(
      (item): item is GetProfileAndGoalQuery.GoalItemType =>
        item.type === 'Goal',
    )

    if (!profileItem || !goalItem) {
      throw new ResourceNotFound('Account not found.')
    }

    return {
      profile: {
        birthDate: profileItem.birthDate,
        gender: profileItem.gender,
        height: profileItem.height,
        name: profileItem.name,
        weight: profileItem.weight,
        goal: profileItem.goal,
      },
      goal: {
        calories: goalItem.calories,
        carbohydrates: goalItem.carbohydrates,
        fats: goalItem.fats,
        proteins: goalItem.proteins,
      },
    }
  }
}

export namespace GetProfileAndGoalQuery {
  export type Input = {
    accountId: string
  }

  export type ProfileItemType = {
    name: string
    birthDate: string
    gender: Profile.Gender
    height: number
    weight: number
    goal: Profile.Goal
  }

  export type GoalItemType = {
    calories: number
    proteins: number
    carbohydrates: number
    fats: number
  }

  export type Output = {
    profile: ProfileItemType
    goal: GoalItemType
  }
}
