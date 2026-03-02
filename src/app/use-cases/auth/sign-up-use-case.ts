import { Account } from '@app/entities/account.js'
import { EmailAlreadyInUse } from '@app/errors/application/email-already-in-use'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { AccountRepository } from '@app/infra/database/dynamo/repositories/account-repository.js'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { AuthGateway } from '@app/infra/gateways/auth/auth-gateway.js'
import { Injectable } from '@kernel/decorators/injectable.js'

@Injectable()
export class SignUpUseCase {
  constructor(
    private readonly authGateway: AuthGateway,
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute({
    email,
    password,
  }: SignUpUseCase.Input): Promise<SignUpUseCase.Output> {
    const accountExists = await this.accountRepository.findByEmail(email)

    if (accountExists) {
      throw new EmailAlreadyInUse()
    }

    const { externalId } = await this.authGateway.signUp({ email, password })

    const account = new Account({ email, externalId })
    await this.accountRepository.create(account)

    const { accessToken, refreshToken } = await this.authGateway.signIn({
      email,
      password,
    })

    return {
      accessToken,
      refreshToken,
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
