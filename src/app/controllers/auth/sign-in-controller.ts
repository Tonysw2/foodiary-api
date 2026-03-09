import { Controller } from '@app/contracts/controller.js'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { SignInUseCase } from '@app/use-cases/auth/sign-in-use-case.js'
import { Injectable } from '@kernel/decorators/injectable.js'
import { Schema } from '@kernel/decorators/schema.js'
import { type SignInBody, signInSchema } from './schemas/sign-in-schema.js'

@Injectable()
@Schema(signInSchema)
export class SignInController extends Controller<SignInUseCase.Output> {
  constructor(private readonly signInUseCase: SignInUseCase) {
    super()
  }

  protected override async handle(
    request: Controller.Request<SignInBody>,
  ): Promise<Controller.Response<SignInUseCase.Output>> {
    const { email, password } = request.body
    const { accessToken, refreshToken } = await this.signInUseCase.execute({
      email,
      password,
    })

    return {
      statusCode: 201,
      body: { accessToken, refreshToken },
    }
  }
}
