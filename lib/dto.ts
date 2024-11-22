import { z } from "zod";

export const sprintCreateSchema = z.object({
  name: z.string().min(3),
  description: z.string().nullable(),
  startDate: z.date().nullable(),
  endDate: z.date().nullable(),
  teamId: z.number(),
});
export type SprintCreateDataType = z.infer<typeof sprintCreateSchema>;
