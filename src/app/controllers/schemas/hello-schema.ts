import { z } from 'zod/mini'

export const helloSchema = z.object({
  name: z.string().check(z.minLength(1, { error: 'Name is required.' })),
  email: z.email({ error: 'Invalid email.' }),
})

export type HelloBody = z.infer<typeof helloSchema>
