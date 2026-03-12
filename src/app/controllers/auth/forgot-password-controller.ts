import { Controller } from '@app/contracts/controller.js'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { ForgotPasswordUseCase } from '@app/use-cases/auth/forgot-password-use-case.js'
import { Injectable } from '@kernel/decorators/injectable.js'
import { Schema } from '@kernel/decorators/schema.js'
import {
  type ForgotPasswordBody,
  forgotPasswordSchema,
} from './schemas/forgot-password-schema.js'

@Injectable()
@Schema(forgotPasswordSchema)
export class ForgotPasswordController extends Controller<'public', void> {
  constructor(private readonly forgotPasswordUseCase: ForgotPasswordUseCase) {
    super()
  }

  protected override async handle(
    request: Controller.Request<'public', ForgotPasswordBody>,
  ): Promise<Controller.Response<void>> {
    const { email } = request.body

    await this.forgotPasswordUseCase.execute({ email })

    return { statusCode: 204 }
  }
}
