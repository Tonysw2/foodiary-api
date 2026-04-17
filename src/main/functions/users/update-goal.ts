import 'reflect-metadata'

import { UpdateGoalController } from '@app/controllers/users/update-goal-controller.js'
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter.js'

export const handler = lambdaHttpAdapter(UpdateGoalController)
