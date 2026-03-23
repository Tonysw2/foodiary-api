import { Controller } from '@app/contracts/controller.js'
import type { Meal } from '@app/entities/meal.js'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { GetMealByIdUseCase } from '@app/use-cases/meals/get-meal-by-id-use-case.js'
import { Injectable } from '@kernel/decorators/injectable.js'

@Injectable()
export class GetMealByIdController extends Controller<
  'private',
  GetMealByIdController.Response
> {
  constructor(private readonly getMealUseCase: GetMealByIdUseCase) {
    super()
  }

  protected override async handle(
    request: GetMealByIdController.Request,
  ): Promise<Controller.Response<GetMealByIdController.Response>> {
    const { mealId } = request.params

    const { meal } = await this.getMealUseCase.execute({
      accountId: request.accountId,
      mealId,
    })

    return {
      statusCode: 200,
      body: {
        meal: {
          ...meal,
          createdAt: meal.createdAt.toISOString(),
        },
      },
    }
  }
}

export namespace GetMealByIdController {
  export type Params = {
    mealId: string
  }

  export type Request = Controller.Request<
    'private',
    Record<string, unknown>,
    GetMealByIdController.Params
  >

  export type Response = {
    meal: {
      id: string
      status: Meal.Status
      inputType: Meal.InputType
      name: string
      icon: string
      foods: Meal.Food[]
      createdAt: string
      inputFileURL: string
    }
  }
}
