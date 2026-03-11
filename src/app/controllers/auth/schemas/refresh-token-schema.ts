import { z } from 'zod/mini'

export const refreshTokenSchema = z.object({
  refreshToken: z
    .string()
    .check(z.minLength(1, { error: 'Refresh token is required.' })),
})

export type RefreshTokenBody = z.infer<typeof refreshTokenSchema>
