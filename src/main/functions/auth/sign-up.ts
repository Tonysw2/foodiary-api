import 'reflect-metadata'

import { SignUpController } from '@app/controllers/auth/sign-up-controller.js'
import '@app/use-cases/auth/sign-up-use-case.js'
import { Registry } from '@kernel/di/registry.js'
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter.js'

const controller = Registry.getInstance().resolve(SignUpController)

export const handler = lambdaHttpAdapter(controller)
