import { Controller } from '@app/contracts/controller.js'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { SignUpUseCase } from '@app/use-cases/auth/sign-up-use-case.js'
import { Injectable } from '@kernel/decorators/injectable.js'
import { Schema } from '@kernel/decorators/schema.js'
import { type SignUpBody, signUpSchema } from './schemas/sign-up-schema.js'

@Injectable()
@Schema(signUpSchema)
export class SignUpController extends Controller<
  'public',
  SignUpController.Response
> {
  constructor(private readonly signUpUseCase: SignUpUseCase) {
    super()
  }

  protected override async handle(
    request: Controller.Request<'public', SignUpBody>,
  ): Promise<Controller.Response<SignUpController.Response>> {
    const { account, profile } = request.body
    const { accessToken, refreshToken } = await this.signUpUseCase.execute({
      account,
      profile,
    })

    return {
      statusCode: 201,
      body: { accessToken, refreshToken },
    }
  }
}

export namespace SignUpController {
  export type Response = {
    accessToken: string
    refreshToken: string
  }
}
