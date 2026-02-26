export class HelloUseCase {
  async execute(input: HelloUseCase.Input): Promise<HelloUseCase.Output> {
    return {
      message: `Hello, ${input.name}!`,
    }
  }
}

export namespace HelloUseCase {
  export type Input = {
    name: string
  }

  export type Output = {
    message: string
  }
}
