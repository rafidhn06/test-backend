import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreatePostSchema = z.object({
  content: z.string().min(1).describe('The content of the blog post'),
});

export class CreatePostDto extends createZodDto(CreatePostSchema) {}
