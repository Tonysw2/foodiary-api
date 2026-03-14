import type { Profile } from '@app/entities/profile'
import { PutCommand, type PutCommandInput } from '@aws-sdk/lib-dynamodb'
import { dynamoClient } from '@infra/clients/dynamo-client'
import { Injectable } from '@kernel/decorators/injectable'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { AppConfig } from '@shared/config/app-config'
import { ProfileItem } from '../items/profile-item'

@Injectable()
export class ProfileRepository {
  constructor(private readonly appConfig: AppConfig) {}

  getPutCommand(profile: Profile): PutCommandInput {
    return {
      TableName: this.appConfig.database.dynamodb.mainTableName,
      Item: ProfileItem.fromEntity(profile).toItem(),
    }
  }

  async create(profile: Profile): Promise<void> {
    await dynamoClient.send(new PutCommand(this.getPutCommand(profile)))
  }
}
