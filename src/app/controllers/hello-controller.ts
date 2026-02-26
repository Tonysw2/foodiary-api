import { Schema } from '../../kernel/decorators/schema.js'
import { Controller } from '../contracts/controller.js'
import { type HelloBody, helloSchema } from './schemas/hello-schema.js'

@Schema(helloSchema)
export class HelloController extends Controller<unknown> {
  protected override async handle(
    request: Controller.Request<HelloBody>,
  ): Promise<Controller.Response<unknown>> {
    return {
      statusCode: 200,
      body: {
        parsedBody: request.body,
      },
    }
  }
}
