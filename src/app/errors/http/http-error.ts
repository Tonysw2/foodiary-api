import type { ErrorCode } from '@app/errors/error-code.js'

export abstract class HttpError extends Error {
  public abstract statusCode: number
  public abstract code: ErrorCode
}
