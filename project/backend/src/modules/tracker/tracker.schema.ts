import { z } from 'zod';

export const toggleProblemSchema = z.object({
  body: z.object({
    problem_id: z.number().int().positive()
  })
});

export const toggleVideoSchema = z.object({
  body: z.object({
    video_id: z.number().int().positive()
  })
});
