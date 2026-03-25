import 'reflect-metadata'

import { RefreshTokenController } from '@app/controllers/auth/refresh-token-controller.js'
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter.js'

export const handler = lambdaHttpAdapter(RefreshTokenController)
