import { z } from 'zod';
import { UserStatus } from '@repo/interfaces';

export const addUserSchema = z.object({
  // Basic Information - Required fields
  email: z
    .string()
    .min(1, 'Имейлът е задължителен')
    .email('Моля въведете валиден имейл адрес')
    .max(255, 'Имейлът не може да бъде повече от 255 символа'),

  password: z
    .string()
    .min(1, 'Паролата е задължителна')
    .min(8, 'Паролата трябва да бъде поне 8 символа')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Паролата трябва да съдържа поне 1 главна буква, 1 малка буква, 1 цифра и 1 специален символ'
    ),

  name: z
    .string()
    .min(1, 'Името е задължително')
    .min(2, 'Името трябва да бъде поне 2 символа')
    .max(100, 'Името не може да бъде повече от 100 символа'),

  surname: z
    .string()
    .min(1, 'Фамилията е задължителна')
    .min(2, 'Фамилията трябва да бъде поне 2 символа')
    .max(100, 'Фамилията не може да бъде повече от 100 символа'),

  phone: z
    .string()
    .regex(/^[+]?[0-9\s\-()]{7,20}$/, 'Моля въведете валиден телефонен номер')
    .optional()
    .or(z.literal('')),

  // Role - Required field
  roleId: z
    .string()
    .min(1, 'Ролята е задължителна')
    .uuid('Моля изберете валидна роля'),

  // Resident connection - Optional field
  residentId: z
    .string()
    .uuid('Моля изберете валиден жилец')
    .optional()
    .or(z.literal('')),

  // Building access - Optional field
  buildingAccess: z
    .array(z.string().uuid())
    .max(50, 'Не можете да изберете повече от 50 сгради')
    .optional(),

  // Mobile app usage - Optional field
  isUsingMobileApp: z.boolean().optional(),
});

// For edit mode, make password optional and add status field
export const editUserSchema = addUserSchema.extend({
  password: z
    .string()
    .min(8, 'Паролата трябва да бъде поне 8 символа')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Паролата трябва да съдържа поне 1 главна буква, 1 малка буква, 1 цифра и 1 специален символ'
    )
    .optional()
    .or(z.literal('')),

  // Status - Required field for editing
  status: z.nativeEnum(UserStatus, {
    errorMap: () => ({ message: 'Моля изберете валиден статус' }),
  }),
});

export type AddUserFormData = z.infer<typeof addUserSchema>;
export type EditUserFormData = z.infer<typeof editUserSchema>;
