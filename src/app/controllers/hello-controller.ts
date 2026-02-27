import { Controller } from '@app/contracts/controller.js'
// biome-ignore lint/style/useImportType: value import required for emitDecoratorMetadata
import { HelloUseCase } from '@app/use-cases/hello-use-case.js'
import { Injectable } from '@kernel/decorators/injectable.js'
import { Schema } from '@kernel/decorators/schema.js'
import { type HelloBody, helloSchema } from './schemas/hello-schema.js'

@Injectable()
@Schema(helloSchema)
export class HelloController extends Controller<unknown> {
  constructor(private readonly helloUseCase: HelloUseCase) {
    super()
  }

  protected override async handle(
    request: Controller.Request<HelloBody>,
  ): Promise<Controller.Response<unknown>> {
    const output = await this.helloUseCase.execute({ name: request.body.name })

    return {
      statusCode: 200,
      body: {
        output,
      },
    }
  }
}
