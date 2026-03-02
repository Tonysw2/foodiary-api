import type { ErrorCode } from '@app/errors/error-code.js'

export abstract class ApplicationError extends Error {
  public abstract code: ErrorCode
  public statusCode?: number
}
