import { Controller } from '@app/contracts/controller.js'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { ConfirmForgotPasswordUseCase } from '@app/use-cases/auth/confirm-forgot-password-use-case.js'
import { Injectable } from '@kernel/decorators/injectable.js'
import { Schema } from '@kernel/decorators/schema.js'
import {
  type ConfirmForgotPasswordBody,
  confirmForgotPasswordSchema,
} from './schemas/confirm-forgot-password-schema.js'

@Injectable()
@Schema(confirmForgotPasswordSchema)
export class ConfirmForgotPasswordController extends Controller<
  'public',
  void
> {
  constructor(
    private readonly confirmForgotPasswordUseCase: ConfirmForgotPasswordUseCase,
  ) {
    super()
  }

  protected override async handle(
    request: Controller.Request<'public', ConfirmForgotPasswordBody>,
  ): Promise<Controller.Response<void>> {
    const { email, confirmationCode, newPassword } = request.body

    try {
      await this.confirmForgotPasswordUseCase.execute({
        email,
        confirmationCode,
        newPassword,
      })
    } catch {}

    return { statusCode: 204 }
  }
}
