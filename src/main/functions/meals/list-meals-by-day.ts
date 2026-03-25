import 'reflect-metadata'

import { ListMealsByDayController } from '@app/controllers/meals/list-meals-by-day-controller'
import { lambdaHttpAdapter } from '@main/adapters/lambda-http-adapter'

export const handler = lambdaHttpAdapter(ListMealsByDayController)
