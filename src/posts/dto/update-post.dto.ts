import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UpdatePostSchema = z.object({
  content: z.string().min(1).describe('The updated content of the blog post'),
});

export class UpdatePostDto extends createZodDto(UpdatePostSchema) {}
