import { ErrorCode } from '@app/errors/error-code.js'
import { ApplicationError } from './application-error.js'

export class InvalidRefreshToken extends ApplicationError {
  public override code = ErrorCode.INVALID_REFRESH_TOKEN
  public override statusCode = 401

  constructor() {
    super('Invalid refresh token.')
    this.name = 'InvalidRefreshToken'
  }
}
