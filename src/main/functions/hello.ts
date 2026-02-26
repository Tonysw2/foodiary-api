import 'reflect-metadata'
import { HelloController } from '@app/controllers/hello-controller.js'
import { HelloUseCase } from '@app/use-cases/hello-use-case.js'
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter.js'

const controller = new HelloController(new HelloUseCase())

export const handler = lambdaHttpAdapter(controller)
