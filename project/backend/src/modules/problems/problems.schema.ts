import { z } from 'zod';

export const getProblemsSchema = z.object({
  query: z.object({
    difficulty: z.string().optional(),
    platform: z.string().optional(),
    topic: z.string().optional(),
  }),
});
