import 'reflect-metadata'

import { CreateMealController } from '@app/controllers/meals/create-meal-controller'
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter'

export const handler = lambdaHttpAdapter(CreateMealController)
