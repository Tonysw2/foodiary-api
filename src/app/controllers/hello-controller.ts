import { z } from 'zod/mini'
import { Controller } from '../contracts/controller.js'

const schema = z.object({
  name: z.string().check(z.minLength(1, { error: 'Name is required.' })),
  email: z.email({ error: 'Invalid email.' }),
})

export class HelloController extends Controller<unknown> {
  protected override schema = schema

  protected override async handle(
    request: Controller.Request,
  ): Promise<Controller.Response<unknown>> {
    const parsedBody = schema.parse(request.body)

    return {
      statusCode: 200,
      body: {
        parsedBody,
      },
    }
  }
}
