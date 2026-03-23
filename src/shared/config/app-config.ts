import { Injectable } from '@kernel/decorators/injectable'
import { env } from './env'

@Injectable()
export class AppConfig {
  readonly auth: AppConfig.Auth
  readonly database: AppConfig.Database
  readonly storage: AppConfig.Storage
  readonly queue: AppConfig.Queue
  readonly cdns: AppConfig.CDNs

  constructor() {
    this.auth = {
      cognito: {
        pool: { id: env.COGNITO_USER_POOL_ID },
        clientId: env.COGNITO_CLIENT_ID,
        clientSecret: env.COGNITO_CLIENT_SECRET,
      },
    }

    this.database = {
      dynamodb: {
        mainTableName: env.MAIN_TABLE_NAME,
      },
    }

    this.storage = {
      mealsBucket: env.MEALS_BUCKET_NAME,
    }

    this.queue = {
      mealsQueueUrl: env.MEALS_QUEUE_URL,
    }

    this.cdns = {
      mealsCDN: env.MEALS_CDN_URL,
    }
  }
}

export namespace AppConfig {
  export type Auth = {
    cognito: {
      pool: { id: string }
      clientId: string
      clientSecret: string
    }
  }

  export type Database = {
    dynamodb: {
      mainTableName: string
    }
  }

  export type Storage = {
    mealsBucket: string
  }

  export type Queue = {
    mealsQueueUrl: string
  }

  export type CDNs = {
    mealsCDN: string
  }
}
