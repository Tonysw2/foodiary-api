import 'reflect-metadata'

import { GetMeController } from '@app/controllers/users/get-me-controller.js'
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter.js'

export const handler = lambdaHttpAdapter(GetMeController)
