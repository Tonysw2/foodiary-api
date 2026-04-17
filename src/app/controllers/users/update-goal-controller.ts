import { Controller } from '@app/contracts/controller.js'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { UpdateGoalUseCase } from '@app/use-cases/users/update-goal-use-case.js'
import { Injectable } from '@kernel/decorators/injectable.js'
import { Schema } from '@kernel/decorators/schema.js'
import {
  type UpdateGoalBody,
  updateGoalSchema,
} from './schemas/update-goal-schema.js'

@Injectable()
@Schema(updateGoalSchema)
export class UpdateGoalController extends Controller<'private', void> {
  constructor(private readonly updateGoalUseCase: UpdateGoalUseCase) {
    super()
  }

  protected override async handle(
    request: Controller.Request<'private', UpdateGoalBody>,
  ): Promise<Controller.Response<void>> {
    const { calories, proteins, carbohydrates, fats } = request.body

    await this.updateGoalUseCase.execute({
      accountId: request.accountId,
      calories,
      proteins,
      carbohydrates,
      fats,
    })

    return { statusCode: 204 }
  }
}
