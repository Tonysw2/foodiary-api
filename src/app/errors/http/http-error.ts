import type { ErrorCode } from '../error-code.js'

export abstract class HttpError extends Error {
  public abstract statusCode: number
  public abstract code: ErrorCode
}
