import { z } from 'zod/mini'

export const updateGoalSchema = z.object({
  calories: z.number(),
  proteins: z.number(),
  carbohydrates: z.number(),
  fats: z.number(),
})

export type UpdateGoalBody = z.infer<typeof updateGoalSchema>
