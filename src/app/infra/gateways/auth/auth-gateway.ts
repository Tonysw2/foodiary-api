import { createHmac } from 'node:crypto'
import {
  InitiateAuthCommand,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider'
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
    internalId,
  }: AuthGateway.SignUpInput): Promise<AuthGateway.SignUpOutput> {
    const command = new SignUpCommand({
      ClientId: this.appConfig.auth.cognito.clientId,
      Username: email,
      Password: password,
      SecretHash: this.getSecretHash(email),
      UserAttributes: [{ Name: 'custom:internalId', Value: internalId }],
    })

    const { UserSub: externalId } = await cognitoClient.send(command)

    if (!externalId) {
      throw new Error(`Cannot sign up user: ${email}`)
    }

    return { externalId }
  }

  async signIn({
    email,
    password,
  }: AuthGateway.SignInInput): Promise<AuthGateway.SignInOutput> {
    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.appConfig.auth.cognito.clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: this.getSecretHash(email),
      },
    })

    const { AuthenticationResult } = await cognitoClient.send(command)

    const accessToken = AuthenticationResult?.AccessToken
    const refreshToken = AuthenticationResult?.RefreshToken

    if (!accessToken || !refreshToken) {
      throw new Error(`Cannot authenticate user: ${email}`)
    }

    return { accessToken, refreshToken }
  }

  private getSecretHash(email: string) {
    const { clientId, clientSecret } = this.appConfig.auth.cognito

    return createHmac('sha256', clientSecret)
      .update(`${email}${clientId}`)
      .digest('base64')
  }
}

export namespace AuthGateway {
  export type SignUpInput = {
    email: string
    password: string
    internalId: string
  }

  export type SignUpOutput = {
    externalId: string
  }

  export type SignInInput = {
    email: string
    password: string
  }

  export type SignInOutput = {
    accessToken: string
    refreshToken: string
  }
}
