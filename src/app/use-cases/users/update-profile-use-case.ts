// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { Profile } from '@app/entities/profile'
import { ResourceNotFound } from '@app/errors/application/resource-not-found'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { ProfileRepository } from '@infra/database/dynamo/repositories/profile-repository.js'
import { Injectable } from '@kernel/decorators/injectable.js'

@Injectable()
export class UpdateProfileUseCase {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async execute({
    accountId,
    name,
    birthDate,
    gender,
    height,
    weight,
  }: UpdateProfileUseCase.Input): Promise<void> {
    const profile = await this.profileRepository.findByAccountId(accountId)

    if (!profile) {
      throw new ResourceNotFound('Profile not found.')
    }

    profile.name = name
    profile.birthDate = birthDate
    profile.gender = gender
    profile.height = height
    profile.weight = weight

    await this.profileRepository.save(profile)
  }
}

export namespace UpdateProfileUseCase {
  export type Input = {
    accountId: string
    name: string
    birthDate: Date
    gender: Profile.Gender
    height: number
    weight: number
  }
}
