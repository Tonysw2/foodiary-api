import { Injectable } from '@kernel/decorators/injectable'
import { env } from './env'

@Injectable()
export class AppConfig {
  readonly auth: AppConfig.Auth
  readonly database: AppConfig.Database

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
}
