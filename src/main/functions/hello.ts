import 'reflect-metadata'

import { HelloController } from '@app/controllers/hello-controller.js'
import '@app/use-cases/hello-use-case.js'
import { Registry } from '@kernel/di/registry.js'
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter.js'

const controller = Registry.getInstance().resolve(HelloController)

export const handler = lambdaHttpAdapter(controller)
