// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { AuthGateway } from '@infra/gateways/auth/auth-gateway.js'
import { Injectable } from '@kernel/decorators/injectable'

@Injectable()
export class ForgotPasswordUseCase {
  constructor(private readonly authGateway: AuthGateway) {}

  async execute({ email }: ForgotPasswordUseCase.Input): Promise<void> {
    await this.authGateway.forgotPassword({ email })
  }
}

export namespace ForgotPasswordUseCase {
  export type Input = {
    email: string
  }
}
