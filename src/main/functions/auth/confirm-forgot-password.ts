import 'reflect-metadata'

import { ConfirmForgotPasswordController } from '@app/controllers/auth/confirm-forgot-password-controller.js'
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter.js'

export const handler = lambdaHttpAdapter(ConfirmForgotPasswordController)
