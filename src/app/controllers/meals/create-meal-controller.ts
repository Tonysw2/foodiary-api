import { Controller } from '@app/contracts/controller.js'
import { Injectable } from '@kernel/decorators/injectable.js'
import KSUID from 'ksuid'

@Injectable()
export class CreateMealController extends Controller<'private', CreateMealController.Response> {
  protected override async handle(
    _request: Controller.Request<'private'>,
  ): Promise<Controller.Response<CreateMealController.Response>> {
    return {
      statusCode: 200,
      body: {
        mealId: KSUID.randomSync().string,
      },
    }
  }
}

export namespace CreateMealController {
  export type Response = {
    mealId: string
  }
}
