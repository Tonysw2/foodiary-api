import { z } from 'zod/mini'

const schema = z.object({
  COGNITO_CLIENT_ID: z.string().check(z.minLength(1)),
  COGNITO_CLIENT_SECRET: z.string().check(z.minLength(1)),
})

const getEnv = () => {
  try {
    return schema.parse(process.env)
  } catch (error) {
    if (error instanceof z.core.$ZodError) {
      throw new Error(JSON.stringify(error))
    }

    throw error
  }
}

export const env = getEnv()
