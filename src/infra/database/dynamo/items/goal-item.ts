import { Goal } from '@app/entities/goal'
import type { AccountItem } from './account-item'

export class GoalItem {
  private readonly type = 'Goal'
  private keys: GoalItem.Keys

  constructor(private readonly attr: GoalItem.Attributes) {
    this.keys = {
      PK: GoalItem.getPK(this.attr.accountId),
      SK: GoalItem.getSK(this.attr.accountId),
    }
  }

  public toItem(): GoalItem.ItemType {
    return {
      ...this.keys,
      ...this.attr,
      type: this.type,
    }
  }

  static toEntity(goalItem: GoalItem.ItemType): Goal {
    return new Goal({
      accountId: goalItem.accountId,
      calories: goalItem.calories,
      proteins: goalItem.proteins,
      carbohydrates: goalItem.carbohydrates,
      fats: goalItem.fats,
      createdAt: new Date(goalItem.createdAt),
    })
  }

  static fromEntity(goal: Goal) {
    return new GoalItem({
      ...goal,
      createdAt: goal.createdAt.toISOString(),
    })
  }

  static getPK(accountId: string): GoalItem.Keys['PK'] {
    return `ACCOUNT#${accountId}`
  }

  static getSK(accountId: string): GoalItem.Keys['SK'] {
    return `ACCOUNT#${accountId}#GOAL`
  }
}

export namespace GoalItem {
  export type Keys = {
    PK: AccountItem.Keys['PK']
    SK: `ACCOUNT#${string}#GOAL`
  }

  export type Attributes = {
    accountId: string
    calories: number
    proteins: number
    carbohydrates: number
    fats: number
    createdAt: string
  }

  export type ItemType = Keys & Attributes & { type: 'Goal' }
}
