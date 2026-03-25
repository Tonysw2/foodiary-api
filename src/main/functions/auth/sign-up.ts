import 'reflect-metadata'

import { SignUpController } from '@app/controllers/auth/sign-up-controller.js'
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter.js'

export const handler = lambdaHttpAdapter(SignUpController)
