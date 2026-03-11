import { Controller } from '@app/contracts/controller.js'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { RefreshTokenUseCase } from '@app/use-cases/auth/refresh-token-use-case.js'
import { Injectable } from '@kernel/decorators/injectable.js'
import { Schema } from '@kernel/decorators/schema.js'
import {
  type RefreshTokenBody,
  refreshTokenSchema,
} from './schemas/refresh-token-schema.js'

@Injectable()
@Schema(refreshTokenSchema)
export class RefreshTokenController extends Controller<
  'public',
  RefreshTokenController.Response
> {
  constructor(private readonly refreshTokenUseCase: RefreshTokenUseCase) {
    super()
  }

  protected override async handle(
    request: Controller.Request<'public', RefreshTokenBody>,
  ): Promise<Controller.Response<RefreshTokenController.Response>> {
    const { refreshToken } = request.body
    const { accessToken, refreshToken: newRefreshToken } =
      await this.refreshTokenUseCase.execute({ refreshToken })

    return {
      statusCode: 201,
      body: { accessToken, refreshToken: newRefreshToken },
    }
  }
}

export namespace RefreshTokenController {
  export type Response = {
    accessToken: string
    refreshToken: string
  }
}
