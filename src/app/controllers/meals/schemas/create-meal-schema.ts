import { mbToBytes } from '@shared/utils/mbToBytes.js'
import { z } from 'zod/mini'

export const createMealSchema = z.object({
  file: z.object({
    inputType: z.enum(['audio/m4a', 'image/jpeg']),
    size: z
      .number()
      .check(
        z.minimum(1, { error: 'The file should have at least 1 byte.' }),
        z.maximum(mbToBytes(10), { error: 'The file should have up to 10MB.' }),
      ),
  }),
})

export type CreateMealBody = z.infer<typeof createMealSchema>
