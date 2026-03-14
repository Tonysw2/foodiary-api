import { Profile } from '@app/entities/profile'
import type { AccountItem } from './account-item'

export class ProfileItem {
  private readonly type = 'Profile'
  private keys: ProfileItem.Keys

  constructor(private readonly attr: ProfileItem.Attributes) {
    this.keys = {
      PK: ProfileItem.getPK(this.attr.accountId),
      SK: ProfileItem.getSK(this.attr.accountId),
    }
  }

  public toItem(): ProfileItem.ItemType {
    return {
      ...this.keys,
      ...this.attr,
      type: this.type,
    }
  }

  static toEntity(profileItem: ProfileItem.ItemType): Profile {
    return new Profile({
      accountId: profileItem.accountId,
      name: profileItem.name,
      birthDate: new Date(profileItem.birthDate),
      gender: profileItem.gender,
      height: profileItem.height,
      weight: profileItem.weight,
      activityLevel: profileItem.activityLevel,
      goal: profileItem.goal,
      createdAt: new Date(profileItem.createdAt),
    })
  }

  static fromEntity(profile: Profile) {
    return new ProfileItem({
      ...profile,
      birthDate: profile.birthDate.toISOString(),
      createdAt: profile.createdAt.toISOString(),
    })
  }

  static getPK(accountId: string): ProfileItem.Keys['PK'] {
    return `ACCOUNT#${accountId}`
  }

  static getSK(accountId: string): ProfileItem.Keys['SK'] {
    return `ACCOUNT#${accountId}#PROFILE`
  }
}

export namespace ProfileItem {
  export type Keys = {
    PK: AccountItem.Keys['PK']
    SK: `ACCOUNT#${string}#PROFILE`
  }

  export type Attributes = {
    accountId: string
    name: string
    birthDate: string
    gender: Profile.Gender
    height: number
    weight: number
    activityLevel: Profile.ActivityLevel
    goal: Profile.Goal
    createdAt: string
  }

  export type ItemType = Keys & Attributes & { type: 'Profile' }
}
