import { Injectable } from '@kernel/decorators/injectable'
import { env } from './env'

@Injectable()
export class AppConfig {
  readonly auth: AppConfig.Auth
  readonly database: AppConfig.Database

  constructor() {
    this.auth = {
      cognito: {
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
