import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string().min(2).max(50).describe('The name of the user'),
  email: z.email().describe('The email address of the user'),
  password: z
    .string()
    .min(6)
    .describe('The password for the user (min 6 characters)'),
});

export class RegisterDto extends createZodDto(RegisterSchema) {}
