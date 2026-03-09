import { z } from 'zod/mini'

export const signInSchema = z.object({
  email: z.email({ error: 'Invalid email.' }),
  password: z
    .string()
    .check(
      z.minLength(8, { error: 'Password must be at least 8 characters.' }),
    ),
})

export type SignInBody = z.infer<typeof signInSchema>
