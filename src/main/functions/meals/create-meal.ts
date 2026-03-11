import 'reflect-metadata'

import { CreateMealController } from '@app/controllers/meals/create-meal-controller'
import { Registry } from '@kernel/di/registry'
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter'

const controller = Registry.getInstance().resolve(CreateMealController)

export const handler = lambdaHttpAdapter(controller)
