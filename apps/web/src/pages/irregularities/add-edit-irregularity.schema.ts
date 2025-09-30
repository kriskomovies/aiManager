import { z } from 'zod';
import { IrregularityPriority } from '@repo/interfaces';

export const addEditIrregularitySchema = z.object({
  title: z
    .string()
    .min(1, 'Заглавието е задължително')
    .min(3, 'Заглавието трябва да бъде поне 3 символа')
    .max(200, 'Заглавието не може да бъде повече от 200 символа'),
  
  description: z
    .string()
    .max(2000, 'Описанието не може да бъде повече от 2000 символа')
    .optional(),
  
  buildingId: z
    .string()
    .min(1, 'Сградата е задължителна'),
  
  apartmentId: z
    .string()
    .optional(),
  
  priority: z
    .nativeEnum(IrregularityPriority, {
      errorMap: () => ({ message: 'Моля изберете валиден приоритет' }),
    }),
  
  location: z
    .string()
    .max(500, 'Локацията не може да бъде повече от 500 символа')
    .optional(),
  
  expectedCompletionDate: z
    .string()
    .optional()
    .refine(
      (date) => {
        if (!date) return true;
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      },
      {
        message: 'Очакваната дата за завършване не може да бъде в миналото',
      }
    ),
  
  estimatedCost: z
    .number()
    .min(0, 'Очакваната цена не може да бъде отрицателна')
    .max(999999.99, 'Очакваната цена е твърде висока')
    .optional(),
  
  assignedUserId: z
    .string()
    .optional(),
});

export type AddEditIrregularityFormData = z.infer<typeof addEditIrregularitySchema>;
