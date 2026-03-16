import { Controller } from '@app/contracts/controller.js'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { GetProfileAndGoalQuery } from '@app/queries/users/get-profile-and-goal-query.js'
import { Injectable } from '@kernel/decorators/injectable.js'

@Injectable()
export class GetMeController extends Controller<'private', GetMeController.Response> {
  constructor(private readonly getProfileAndGoalQuery: GetProfileAndGoalQuery) {
    super()
  }

  protected override async handle(
    request: Controller.Request<'private'>,
  ): Promise<Controller.Response<GetMeController.Response>> {
    const { profile, goal } = await this.getProfileAndGoalQuery.execute({
      accountId: request.accountId,
    })

    return { statusCode: 200, body: { profile, goal } }
  }
}

export namespace GetMeController {
  export type Response = GetProfileAndGoalQuery.Output
}
