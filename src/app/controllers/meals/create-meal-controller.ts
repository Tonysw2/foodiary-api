import { Controller } from '@app/contracts/controller.js'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { CreateMealUseCase } from '@app/use-cases/meals/create-meal-use-case.js'
import { Injectable } from '@kernel/decorators/injectable.js'
import { Schema } from '@kernel/decorators/schema.js'
import {
  type CreateMealBody,
  createMealSchema,
} from './schemas/create-meal-schema.js'

@Injectable()
@Schema(createMealSchema)
export class CreateMealController extends Controller<
  'private',
  CreateMealController.Response
> {
  constructor(private readonly createMealUseCase: CreateMealUseCase) {
    super()
  }

  protected override async handle(
    request: Controller.Request<'private', CreateMealBody>,
  ): Promise<Controller.Response<CreateMealController.Response>> {
    const { file } = request.body

    const { mealId } = await this.createMealUseCase.execute({
      accountId: request.accountId,
      file: {
        size: file.size,
        inputType: file.inputType,
      },
    })

    return {
      statusCode: 201,
      body: { mealId },
    }
  }
}

export namespace CreateMealController {
  export type Response = {
    mealId: string
  }
}
