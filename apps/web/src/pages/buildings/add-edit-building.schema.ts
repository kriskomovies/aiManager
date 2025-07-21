import { z } from 'zod';
import { BuildingType, TaxGenerationPeriod } from '@repo/interfaces';

// Helper function to handle required number fields
const requiredNumberField = (
  fieldName: string,
  min: number = 0,
  max?: number,
  isInteger: boolean = false
) =>
  z.preprocess(
    val => {
      // Convert string to number if it's a string
      if (typeof val === 'string') {
        if (val.trim() === '') return undefined; // Empty string becomes undefined
        const num = Number(val);
        return isNaN(num) ? val : num; // Return original if NaN, number if valid
      }
      return val;
    },
    z
      .number({
        required_error: `${fieldName} е задължително поле`,
        invalid_type_error: `${fieldName} трябва да бъде валидно число`,
      })
      .min(min, `${fieldName} трябва да бъде поне ${min}`)
      .max(
        max || Number.MAX_SAFE_INTEGER,
        max ? `${fieldName} не може да бъде повече от ${max}` : ''
      )
      .refine(val => !isInteger || Number.isInteger(val), {
        message: `${fieldName} трябва да бъде цяло число`,
      })
  );

export const addBuildingSchema = z.object({
  // General Information - Required fields
  name: z
    .string()
    .min(1, 'Името на сградата е задължително')
    .min(3, 'Името трябва да бъде поне 3 символа')
    .max(255, 'Името не може да бъде повече от 255 символа'),

  type: z.nativeEnum(BuildingType, {
    errorMap: () => ({ message: 'Моля изберете валиден тип сграда' }),
  }),

  // Address - Required fields
  city: z
    .string()
    .min(1, 'Градът е задължителен')
    .max(100, 'Градът не може да бъде повече от 100 символа'),

  district: z
    .string()
    .min(1, 'Районът е задължителен')
    .max(100, 'Районът не може да бъде повече от 100 символа'),

  street: z
    .string()
    .min(1, 'Улицата е задължителна')
    .max(255, 'Улицата не може да бъде повече от 255 символа'),

  number: z
    .string()
    .min(1, 'Номерът е задължителен')
    .max(50, 'Номерът не може да бъде повече от 50 символа'),

  entrance: z
    .string()
    .min(1, 'Входът е задължителен')
    .max(50, 'Входът не може да бъде повече от 50 символа'),

  postalCode: z
    .string()
    .min(1, 'Пощенският код е задължителен')
    .regex(/^\d{4}$/, 'Пощенският код трябва да бъде 4 цифри')
    .max(20, 'Пощенският код не може да бъде повече от 20 символа'),

  // Physical properties - Required fields
  commonPartsArea: requiredNumberField('Площта на общите части', 0),

  quadrature: requiredNumberField('Квадратурата', 0),

  parkingSlots: requiredNumberField('Паркоместата', 0, undefined, true),

  basements: requiredNumberField('Мазетата', 0, undefined, true),

  // Tax settings - Required fields
  taxGenerationPeriod: z.nativeEnum(TaxGenerationPeriod, {
    errorMap: () => ({
      message: 'Моля изберете валиден период за генериране на такси',
    }),
  }),

  taxGenerationDay: requiredNumberField(
    'Денят за генериране на такси',
    1,
    31,
    true
  ),

  homebookStartDate: z
    .string()
    .min(1, 'Началната дата на домовата книга е задължителна')
    .refine(date => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    }, 'Моля въведете валидна дата'),

  // Description - Required field
  description: z
    .string()
    .min(1, 'Описанието е задължително')
    .min(10, 'Описанието трябва да бъде поне 10 символа')
    .max(1000, 'Описанието не може да бъде повече от 1000 символа'),

  // Features - Required field
  invoiceEnabled: z.boolean({
    errorMap: () => ({ message: 'Моля изберете дали фактурирането е активно' }),
  }),

  // People with access - Required field
  peopleWithAccess: z
    .array(z.string())
    .min(1, 'Трябва да изберете поне един човек с достъп до сградата'),
});

export type AddBuildingFormData = z.infer<typeof addBuildingSchema>;
