import { z } from 'zod/mini'

export const signUpSchema = z.object({
  account: z.object({
    email: z.email({ error: 'Invalid email.' }),
    password: z.string().check(z.minLength(8, { error: 'Password must be at least 8 characters.' })),
  }),
})

export type SignUpBody = z.infer<typeof signUpSchema>
