import { Controller } from '../contracts/controller.js'
import { type HelloBody, helloSchema } from './schemas/hello-schema.js'

export class HelloController extends Controller<unknown> {
  protected override schema = helloSchema

  protected override async handle(
    request: Controller.Request<HelloBody>,
  ): Promise<Controller.Response<unknown>> {
    const parsedBody = this.schema.parse(request.body)

    return {
      statusCode: 200,
      body: {
        parsedBody,
      },
    }
  }
}
