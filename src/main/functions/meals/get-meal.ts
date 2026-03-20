import 'reflect-metadata'

import { GetMealByIdController } from '@app/controllers/meals/get-meal-by-id-controller'
import { Registry } from '@kernel/di/registry'
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter'

const controller = Registry.getInstance().resolve(GetMealByIdController)

export const handler = lambdaHttpAdapter(controller)
