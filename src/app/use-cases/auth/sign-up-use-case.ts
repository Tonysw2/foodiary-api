import { Injectable } from '@kernel/decorators/injectable.js'

@Injectable()
export class SignUpUseCase {
  async execute(input: SignUpUseCase.Input): Promise<SignUpUseCase.Output> {
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
