import { Account } from '@app/entities/account.js'
import { Goal } from '@app/entities/goal.js'
import { Profile } from '@app/entities/profile.js'
import { EmailAlreadyInUse } from '@app/errors/application/email-already-in-use'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { AccountRepository } from '@infra/database/dynamo/repositories/account-repository.js'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { SignUpUnitOfWork } from '@infra/database/dynamo/unit-of-work/sign-up-unit-of-work.js'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { AuthGateway } from '@infra/gateways/auth/auth-gateway.js'
import { Injectable } from '@kernel/decorators/injectable.js'

@Injectable()
export class SignUpUseCase {
  constructor(
    private readonly authGateway: AuthGateway,
    private readonly accountRepository: AccountRepository,
    private readonly signUpUnitOfWork: SignUpUnitOfWork,
  ) {}

  async execute({
    account,
    profile,
  }: SignUpUseCase.Input): Promise<SignUpUseCase.Output> {
    const accountExists = await this.accountRepository.findByEmail(
      account.email,
    )

    if (accountExists) {
      throw new EmailAlreadyInUse()
    }

    const newAccount = new Account({ email: account.email })
    const { externalId } = await this.authGateway.signUp({
      email: account.email,
      password: account.password,
      internalId: newAccount.id,
    })
    newAccount.externalId = externalId

    const newProfile = new Profile({
      accountId: newAccount.id,
      ...profile,
      birthDate: new Date(profile.birthDate),
    })
    const newGoal = new Goal({
      accountId: newAccount.id,
      calories: 2000,
      proteins: 150,
      carbohydrates: 200,
      fats: 67,
    })

    await this.signUpUnitOfWork.run({
      account: newAccount,
      profile: newProfile,
      goal: newGoal,
    })

    const { accessToken, refreshToken } = await this.authGateway.signIn({
      email: account.email,
      password: account.password,
    })

    return { accessToken, refreshToken }
  }
}

export namespace SignUpUseCase {
  export type Input = {
    account: {
      email: string
      password: string
    }
    profile: {
      name: string
      birthDate: string
      gender: Profile.Gender
      height: number
      weight: number
      activityLevel: Profile.ActivityLevel
      goal: Profile.Goal
    }
  }

  export type Output = {
    accessToken: string
    refreshToken: string
  }
}
