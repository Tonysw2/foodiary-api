import { Injectable } from '@kernel/decorators/injectable'

type CompensationFn = () => Promise<void>

@Injectable()
export class Saga {
  private compensations: CompensationFn[] = []

  public addCompensation(fn: CompensationFn) {
    this.compensations.unshift(fn)
  }

  public async run<TResult>(fn: () => Promise<TResult>) {
    try {
      return await fn()
    } catch (error) {
      await this.compensate()

      throw error
    }
  }

  public async compensate() {
    for await (const compensation of this.compensations) {
      try {
        await compensation()
      } catch (error) {
        console.log(error)
      }
    }
  }
}
