import { Controller } from '@app/contracts/controller.js'
import type { Meal } from '@app/entities/meal.js'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { ListMealsByDayQuery } from '@app/queries/meals/list-meals-by-day-query.js'
import { Injectable } from '@kernel/decorators/injectable.js'
import {
  type ListMealsByDayQueryParams,
  listMealsByDaySchema,
} from './schemas/list-meals-by-day-schema.js'

@Injectable()
export class ListMealsByDayController extends Controller<
  'private',
  ListMealsByDayController.Response
> {
  constructor(private readonly listMealsByDayQuery: ListMealsByDayQuery) {
    super()
  }

  protected override async handle(
    request: Controller.Request<
      'private',
      Record<string, unknown>,
      Record<string, unknown>,
      ListMealsByDayQueryParams
    >,
  ): Promise<Controller.Response<ListMealsByDayController.Response>> {
    const { date } = listMealsByDaySchema.parse(request.queryParams)

    const { meals } = await this.listMealsByDayQuery.execute({
      accountId: request.accountId,
      date,
    })

    return {
      statusCode: 200,
      body: { meals },
    }
  }
}

export namespace ListMealsByDayController {
  export type Response = {
    meals: {
      id: string
      createdAt: string
      name: string
      icon: string
      foods: Meal.Food[]
    }[]
  }
}
