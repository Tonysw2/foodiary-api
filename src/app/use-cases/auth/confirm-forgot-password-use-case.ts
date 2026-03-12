// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { AuthGateway } from '@infra/gateways/auth/auth-gateway.js'
import { Injectable } from '@kernel/decorators/injectable'

@Injectable()
export class ConfirmForgotPasswordUseCase {
  constructor(private readonly authGateway: AuthGateway) {}

  async execute({
    email,
    confirmationCode,
    newPassword,
  }: ConfirmForgotPasswordUseCase.Input): Promise<void> {
    await this.authGateway.confirmForgotPassword({
      email,
      confirmationCode,
      newPassword,
    })
  }
}

export namespace ConfirmForgotPasswordUseCase {
  export type Input = {
    email: string
    confirmationCode: string
    newPassword: string
  }
}
