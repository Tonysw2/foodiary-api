import { z } from 'zod/mini'
import type { IController } from '../contracts/controller.js'

const schema = z.object({
  name: z.string().check(z.minLength(1, { error: 'Name is required.' })),
  email: z.email({ error: 'Invalid email.' }),
})

export class HelloController implements IController<unknown> {
  async handle(
    request: IController.Request,
  ): Promise<IController.Response<unknown>> {
    const parsedBody = schema.parse(request.body)

    return {
      statusCode: 200,
      body: {
        parsedBody,
      },
    }
  }
}
