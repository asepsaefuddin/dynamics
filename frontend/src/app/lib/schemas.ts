import { z } from 'zod';

export const jobSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  jobPosition: z.string().min(1, 'Job position is required'),
  category: z.string().min(1, 'Category is required'),
});

export type JobInput = z.infer<typeof jobSchema>;
