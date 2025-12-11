import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.string().email({ message: "Debe ser un correo electrónico válido." }),
  fullName: z.string().min(3, { message: "El nombre completo debe tener al menos 3 caracteres." }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
  role: z.enum(['mecanico', 'coordinador']).default('mecanico'),
});

export type CreateUserData = z.infer<typeof CreateUserSchema>;