// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { AuthGateway } from '@app/infra/gateways/auth/auth-gateway.js'
import { Injectable } from '@kernel/decorators/injectable.js'

@Injectable()
export class SignUpUseCase {
  constructor(private readonly authGateway: AuthGateway) {}

  async execute({
    email,
    password,
  }: SignUpUseCase.Input): Promise<SignUpUseCase.Output> {
    const { externalId } = await this.authGateway.signUp({ email, password })

    // TODO: persist externalId to database

    return {
      accessToken: 'stub-access-token',
      refreshToken: 'stub-refresh-token',
    }
  }
}

export namespace SignUpUseCase {
  export type Input = {
    email: string
    password: string
  }

  export type Output = {
    accessToken: string
    refreshToken: string
  }
}
