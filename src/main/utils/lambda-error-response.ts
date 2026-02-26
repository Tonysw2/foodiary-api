import type { ErrorCode } from '@app/errors/error-code.js'
import type { APIGatewayProxyResultV2 } from 'aws-lambda'

interface ILambdaErrorResponseParams {
  code: ErrorCode
  message: any
  statusCode: number
}

export function lambdaErrorResponse({
  code,
  message,
  statusCode,
}: ILambdaErrorResponseParams): APIGatewayProxyResultV2 {
  return {
    statusCode,
    body: JSON.stringify({
      error: {
        code,
        message,
      },
    }),
  }
}
