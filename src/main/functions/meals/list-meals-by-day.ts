import 'reflect-metadata'

import { ListMealsByDayController } from '@app/controllers/meals/list-meals-by-day-controller'
import { Registry } from '@kernel/di/registry'
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter'

const controller = Registry.getInstance().resolve(ListMealsByDayController)

export const handler = lambdaHttpAdapter(controller)
