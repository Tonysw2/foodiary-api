import 'reflect-metadata'

import { GetMeController } from '@app/controllers/users/get-me-controller.js'
import { Registry } from '@kernel/di/registry.js'
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter.js'

const controller = Registry.getInstance().resolve(GetMeController)

export const handler = lambdaHttpAdapter(controller)
