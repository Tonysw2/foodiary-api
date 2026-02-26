import { ErrorCode } from '@app/errors/error-code.js'
import { HttpError } from './http-error.js'

export class BadRequest extends HttpError {
  public override statusCode = 400
  public override code: ErrorCode

  constructor(message?: any, code?: ErrorCode) {
    super()

    this.name = 'BadRequest'
    this.message = message ?? 'Bad Request'
    this.code = code ?? ErrorCode.BAD_REQUEST
  }
}
