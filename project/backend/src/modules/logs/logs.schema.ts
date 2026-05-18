import { z } from 'zod';

export const createLogSchema = z.object({
  body: z.object({
    problem_id: z.number().int().positive(),
    status: z.enum(['AC', 'WA', 'TLE', 'MLE', 'RE', 'CE']),
  }),
});
