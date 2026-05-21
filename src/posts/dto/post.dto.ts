import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { UserSchema } from '../../auth/dto/user.dto';

export const PostSchema = z.object({
  id: z.number().describe('The unique identifier of the post'),
  content: z.string().describe('The content of the post'),
  createdAt: z.iso.datetime().describe('The creation timestamp'),
  updatedAt: z.iso.datetime().describe('The last update timestamp'),
  authorId: z.number().describe('The ID of the author'),
  author: UserSchema.describe('The author details'),
});

export class PostDto extends createZodDto(PostSchema) {}

export const PaginatedPostSchema = z.object({
  items: z.array(PostSchema),
  meta: z.object({
    totalItems: z.number(),
    itemCount: z.number(),
    itemsPerPage: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
  }),
});

export class PaginatedPostDto extends createZodDto(PaginatedPostSchema) {}
