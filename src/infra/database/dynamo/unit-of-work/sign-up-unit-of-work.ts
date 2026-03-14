import type { Account } from '@app/entities/account'
import type { Goal } from '@app/entities/goal'
import type { Profile } from '@app/entities/profile'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { AccountRepository } from '@infra/database/dynamo/repositories/account-repository'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { GoalRepository } from '@infra/database/dynamo/repositories/goal-repository'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { ProfileRepository } from '@infra/database/dynamo/repositories/profile-repository'
import { Injectable } from '@kernel/decorators/injectable'
import { UnitOfWork } from './unit-of-work'

@Injectable()
export class SignUpUnitOfWork extends UnitOfWork {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly profileRepository: ProfileRepository,
    private readonly goalRepository: GoalRepository,
  ) {
    super()
  }

  async run({ account, profile, goal }: SignUpUnitOfWork.RunParams) {
    this.addPut(this.accountRepository.getPutCommand(account))
    this.addPut(this.profileRepository.getPutCommand(profile))
    this.addPut(this.goalRepository.getPutCommand(goal))
    await this.commit()
  }
}

export namespace SignUpUnitOfWork {
  export type RunParams = {
    account: Account
    profile: Profile
    goal: Goal
  }
}
