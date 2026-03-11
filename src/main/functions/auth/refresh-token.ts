import 'reflect-metadata'

import { RefreshTokenController } from '@app/controllers/auth/refresh-token-controller.js'
import { Registry } from '@kernel/di/registry.js'
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter.js'

const controller = Registry.getInstance().resolve(RefreshTokenController)

export const handler = lambdaHttpAdapter(controller)
