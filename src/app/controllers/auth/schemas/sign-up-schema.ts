import { Profile } from '@app/entities/profile.js'
import { z } from 'zod/mini'

export const signUpSchema = z.object({
  account: z.object({
    email: z.email({ error: 'Invalid email.' }),
    password: z
      .string()
      .check(
        z.minLength(8, { error: 'Password must be at least 8 characters.' }),
      ),
  }),
  profile: z.object({
    name: z.string(),
    birthDate: z.string(),
    gender: z.enum(Profile.Gender),
    height: z.number(),
    weight: z.number(),
    activityLevel: z.enum(Profile.ActivityLevel),
    goal: z.enum(Profile.Goal),
  }),
})

export type SignUpBody = z.infer<typeof signUpSchema>
