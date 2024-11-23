import { z } from "zod";

export const sprintCreateSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  date: z.object({
    from: z.date(),
    to: z.date().optional(),
  }),
  teamId: z.number(),
});
export type SprintCreateDataType = z.infer<typeof sprintCreateSchema>;
