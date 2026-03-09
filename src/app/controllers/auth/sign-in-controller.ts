import { Controller } from '@app/contracts/controller.js'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { SignInUseCase } from '@app/use-cases/auth/sign-in-use-case.js'
import { Injectable } from '@kernel/decorators/injectable.js'
import { Schema } from '@kernel/decorators/schema.js'
import { type SignInBody, signInSchema } from './schemas/sign-in-schema.js'

@Injectable()
@Schema(signInSchema)
export class SignInController extends Controller<SignInController.Response> {
  constructor(private readonly signInUseCase: SignInUseCase) {
    super()
  }

  protected override async handle(
    request: Controller.Request<SignInBody>,
  ): Promise<Controller.Response<SignInController.Response>> {
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

export namespace SignInController {
  export type Response = {
    accessToken: string
    refreshToken: string
  }
}
