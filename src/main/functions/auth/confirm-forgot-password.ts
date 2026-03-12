import 'reflect-metadata'

import { ConfirmForgotPasswordController } from '@app/controllers/auth/confirm-forgot-password-controller.js'
import { Registry } from '@kernel/di/registry.js'
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter.js'

const controller = Registry.getInstance().resolve(ConfirmForgotPasswordController)

export const handler = lambdaHttpAdapter(controller)
