const { z } = require('zod');

const passwordSchema = z
  .string()
  .min(8, 'La contraseña debe tener mínimo 8 caracteres.')
  .max(72, 'La contraseña no puede superar 72 caracteres.')
  .regex(/[A-Z]/, 'Debe incluir al menos una mayúscula.')
  .regex(/[a-z]/, 'Debe incluir al menos una minúscula.')
  .regex(/[0-9]/, 'Debe incluir al menos un número.')
  .regex(/[^A-Za-z0-9]/, 'Debe incluir al menos un carácter especial.');

const adminUpdateUserPasswordSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'El id debe ser numérico.'),
  }),
  body: z.object({
    newPassword: passwordSchema,
    forcePasswordChange: z.boolean().optional(),
  }),
});

const changePasswordSchema = z.object({
  body: z
    .object({
      currentPassword: z.string().min(1, 'La contraseña actual es requerida.'),
      newPassword: passwordSchema,
      confirmPassword: z.string().min(1, 'La confirmación es requerida.'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      path: ['confirmPassword'],
      message: 'Las contraseñas no coinciden.',
    }),
});

const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Correo inválido.'),
  }),
});

const resetPasswordSchema = z.object({
  body: z
    .object({
      token: z.string().min(20, 'Token inválido.'),
      newPassword: passwordSchema,
      confirmPassword: z.string().min(1, 'La confirmación es requerida.'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      path: ['confirmPassword'],
      message: 'Las contraseñas no coinciden.',
    }),
});

module.exports = {
  passwordSchema,
  adminUpdateUserPasswordSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
