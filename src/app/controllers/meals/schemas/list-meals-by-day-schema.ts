import { z } from 'zod/mini'

export const listMealsByDaySchema = z.object({
  date: z.pipe(
    z.iso.date(),
    z.transform((date) => new Date(date)),
  ),
})

export type ListMealsByDayQueryParams = z.infer<typeof listMealsByDaySchema>
