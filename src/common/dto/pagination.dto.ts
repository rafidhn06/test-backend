import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const PaginationSchema = z.object({
  page: z
    .preprocess(
      (val) => (val === undefined ? 1 : Number(val)),
      z.number().min(1).default(1),
    )
    .describe('Page number'),
  limit: z
    .preprocess(
      (val) => (val === undefined ? 10 : Number(val)),
      z.number().min(1).max(100).default(10),
    )
    .describe('Number of items per page'),
});

export class PaginationDto extends createZodDto(PaginationSchema) {}
