import 'reflect-metadata'

import { ForgotPasswordController } from '@app/controllers/auth/forgot-password-controller.js'
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter.js'

export const handler = lambdaHttpAdapter(ForgotPasswordController)
