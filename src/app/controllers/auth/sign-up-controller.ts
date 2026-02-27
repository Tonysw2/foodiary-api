import { Controller } from '@app/contracts/controller.js'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { SignUpUseCase } from '@app/use-cases/auth/sign-up-use-case.js'
import { Injectable } from '@kernel/decorators/injectable.js'
import { Schema } from '@kernel/decorators/schema.js'
import { type SignUpBody, signUpSchema } from './schemas/sign-up-schema.js'

@Injectable()
@Schema(signUpSchema)
export class SignUpController extends Controller<SignUpUseCase.Output> {
  constructor(private readonly signUpUseCase: SignUpUseCase) {
    super()
  }

  protected override async handle(
    request: Controller.Request<SignUpBody>,
  ): Promise<Controller.Response<SignUpUseCase.Output>> {
    const { account } = request.body
    const { accessToken, refreshToken } = await this.signUpUseCase.execute({
      email: account.email,
      password: account.password,
    })

    return {
      statusCode: 201,
      body: { accessToken, refreshToken },
    }
  }
}
