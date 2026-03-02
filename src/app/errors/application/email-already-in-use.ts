import { ErrorCode } from '@app/errors/error-code.js'
import { ApplicationError } from './application-error.js'

export class EmailAlreadyInUse extends ApplicationError {
  public override code = ErrorCode.EMAIL_ALREADY_IN_USE
  public override statusCode = 409

  constructor() {
    super('This email is already in use.')
    this.name = 'EmailAlreadyInUse'
  }
}
