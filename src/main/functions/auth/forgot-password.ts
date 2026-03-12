import 'reflect-metadata'

import { ForgotPasswordController } from '@app/controllers/auth/forgot-password-controller.js'
import { Registry } from '@kernel/di/registry.js'
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter.js'

const controller = Registry.getInstance().resolve(ForgotPasswordController)

export const handler = lambdaHttpAdapter(controller)
