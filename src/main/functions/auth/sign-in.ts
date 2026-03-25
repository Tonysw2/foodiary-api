import 'reflect-metadata'

import { SignInController } from '@app/controllers/auth/sign-in-controller.js'
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter.js'

export const handler = lambdaHttpAdapter(SignInController)
