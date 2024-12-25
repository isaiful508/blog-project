import { z } from 'zod';

export const blogValidationSchema = z.object({
  title: z.string().nonempty({ message: 'Title is required' }),
  content: z.string().nonempty({ message: 'Content is required' }),
});
