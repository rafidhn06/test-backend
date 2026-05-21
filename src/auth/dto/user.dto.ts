import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number().describe('The unique identifier of the user'),
  name: z.string().describe('The name of the user'),
  email: z.email().describe('The email address of the user'),
});

export class UserDto extends createZodDto(UserSchema) {}
