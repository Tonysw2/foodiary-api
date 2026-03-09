import 'reflect-metadata'

import { SignInController } from '@app/controllers/auth/sign-in-controller.js'
import { Registry } from '@kernel/di/registry.js'
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter.js'

const controller = Registry.getInstance().resolve(SignInController)

export const handler = lambdaHttpAdapter(controller)
