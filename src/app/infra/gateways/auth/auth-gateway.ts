import { SignUpCommand } from '@aws-sdk/client-cognito-identity-provider'
import { Injectable } from '@kernel/decorators/injectable.js'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { AppConfig } from '@shared/config/app-config'
import { cognitoClient } from '@shared/config/cognito-client-provider'

@Injectable()
export class AuthGateway {
  constructor(private appConfig: AppConfig) {}

  async signUp({
    email,
    password,
  }: AuthGateway.SignUpInput): Promise<AuthGateway.SignUpOutput> {
    const command = new SignUpCommand({
      ClientId: this.appConfig.auth.cognito.clientId,
      Username: email,
      Password: password,
    })

    const { UserSub: externalId } = await cognitoClient.send(command)

    if (!externalId) {
      throw new Error(`Cannot sign up user: ${email}`)
    }

    return { externalId }
  }
}

export namespace AuthGateway {
  export type SignUpInput = {
    email: string
    password: string
  }

  export type SignUpOutput = {
    externalId: string
  }
}
