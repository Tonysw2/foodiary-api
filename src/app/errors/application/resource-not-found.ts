import { ErrorCode } from '@app/errors/error-code.js'
import { ApplicationError } from './application-error.js'

export class ResourceNotFound extends ApplicationError {
  public override code = ErrorCode.RESOURCE_NOT_FOUND
  public override statusCode = 404

  constructor(message?: string) {
    super(message)
    this.name = 'ResourceNotFound'
    this.message = message ?? 'Resource not found.'
  }
}
