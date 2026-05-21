import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.email().describe('The email address of the user'),
  password: z.string().min(6).describe('The password of the user'),
});

export class LoginDto extends createZodDto(LoginSchema) {}
