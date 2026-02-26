import 'reflect-metadata'
import { HelloController } from '@app/controllers/hello-controller.js'
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter.js'

const controller = new HelloController()

export const handler = lambdaHttpAdapter(controller)
