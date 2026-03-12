// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { AuthGateway } from '@infra/gateways/auth/auth-gateway.js'
import { Injectable } from '@kernel/decorators/injectable'

@Injectable()
export class RefreshTokenUseCase {
  constructor(private readonly authGateway: AuthGateway) {}

  async execute({
    refreshToken,
  }: RefreshTokenUseCase.Input): Promise<RefreshTokenUseCase.Output> {
    const { accessToken, refreshToken: newRefreshToken } =
      await this.authGateway.refreshToken({ refreshToken })

    return { accessToken, refreshToken: newRefreshToken }
  }
}

export namespace RefreshTokenUseCase {
  export type Input = {
    refreshToken: string
  }

  export type Output = {
    accessToken: string
    refreshToken: string
  }
}
