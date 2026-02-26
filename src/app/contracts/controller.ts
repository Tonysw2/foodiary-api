import type { z } from 'zod/mini'

export abstract class Controller<TBody = undefined> {
  protected schema?: z.ZodMiniObject

  protected abstract handle(
    params: Controller.Request,
  ): Promise<Controller.Response<TBody>>

  public execute(
    params: Controller.Request,
  ): Promise<Controller.Response<TBody>> {
    const body = this.validateBody(params.body)

    return this.handle({
      ...params,
      body,
    })
  }

  private validateBody(body: Controller.Request['body']) {
    if (!this.schema) return body
    return this.schema.parse(body)
  }
}

export namespace Controller {
  export type Request<
    TBody = Record<string, unknown>,
    TParams = Record<string, unknown>,
    TQueryParams = Record<string, unknown>,
  > = {
    body: TBody
    params: TParams
    queryParams: TQueryParams
  }

  export type Response<TBody = undefined> = {
    statusCode: number
    body?: TBody
  }
}
