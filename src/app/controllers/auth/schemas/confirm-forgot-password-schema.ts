import { z } from 'zod/mini'

export const confirmForgotPasswordSchema = z.object({
  email: z.email({ error: 'Invalid email.' }),
  confirmationCode: z
    .string()
    .check(z.minLength(1, { error: 'Confirmation code is required.' })),
  newPassword: z
    .string()
    .check(z.minLength(8, { error: 'Password must be at least 8 characters.' })),
})

export type ConfirmForgotPasswordBody = z.infer<typeof confirmForgotPasswordSchema>
