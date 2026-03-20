import { Profile } from '@app/entities/profile.js'
import { z } from 'zod/mini'

export const updateProfileSchema = z.object({
  name: z.string(),
  birthDate: z.string(),
  gender: z.enum([Profile.Gender.MALE, Profile.Gender.FEMALE]),
  height: z.number(),
  weight: z.number(),
})

export type UpdateProfileBody = z.infer<typeof updateProfileSchema>
