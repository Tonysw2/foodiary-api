import { Controller } from '@app/contracts/controller.js'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { UpdateProfileUseCase } from '@app/use-cases/users/update-profile-use-case.js'
import { Injectable } from '@kernel/decorators/injectable.js'
import { Schema } from '@kernel/decorators/schema.js'
import {
  type UpdateProfileBody,
  updateProfileSchema,
} from './schemas/update-profile-schema.js'

@Injectable()
@Schema(updateProfileSchema)
export class UpdateProfileController extends Controller<'private', void> {
  constructor(private readonly updateProfileUseCase: UpdateProfileUseCase) {
    super()
  }

  protected override async handle(
    request: Controller.Request<'private', UpdateProfileBody>,
  ): Promise<Controller.Response<void>> {
    const { name, birthDate, gender, height, weight } = request.body

    await this.updateProfileUseCase.execute({
      accountId: request.accountId,
      name,
      birthDate,
      gender,
      height,
      weight,
    })

    return { statusCode: 204 }
  }
}
