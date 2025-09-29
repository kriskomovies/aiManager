import { z } from 'zod';

// Partner types enum
export enum PartnerType {
  SUPPLIER = 'SUPPLIER',
  SERVICE_PROVIDER = 'SERVICE_PROVIDER',
  CONTRACTOR = 'CONTRACTOR',
  VENDOR = 'VENDOR',
  CONSULTANT = 'CONSULTANT',
  OTHER = 'OTHER',
}

// Partner status enum
export enum PartnerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED',
}

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

export const addPartnerSchema = z.object({
  // Basic Information - Required fields
  name: z
    .string()
    .min(1, 'Името на контрагента е задължително')
    .min(2, 'Името трябва да бъде поне 2 символа')
    .max(255, 'Името не може да бъде повече от 255 символа'),

  type: z.nativeEnum(PartnerType, {
    errorMap: () => ({ message: 'Моля изберете валиден тип контрагент' }),
  }),

  status: z.nativeEnum(PartnerStatus, {
    errorMap: () => ({ message: 'Моля изберете валиден статус' }),
  }),

  // Contact Information - Required fields
  email: z
    .string()
    .min(1, 'Имейлът е задължителен')
    .email('Моля въведете валиден имейл адрес')
    .max(255, 'Имейлът не може да бъде повече от 255 символа'),

  phone: z
    .string()
    .min(1, 'Телефонът е задължителен')
    .regex(
      /^[+]?[0-9\s\-()]{7,20}$/,
      'Моля въведете валиден телефонен номер'
    ),

  // Address Information - Required fields
  address: z
    .string()
    .min(1, 'Адресът е задължителен')
    .min(5, 'Адресът трябва да бъде поне 5 символа')
    .max(500, 'Адресът не може да бъде повече от 500 символа'),

  city: z
    .string()
    .min(1, 'Градът е задължителен')
    .max(100, 'Градът не може да бъде повече от 100 символа'),

  postalCode: z
    .string()
    .min(1, 'Пощенският код е задължителен')
    .regex(/^\d{4}$/, 'Пощенският код трябва да бъде 4 цифри')
    .max(20, 'Пощенският код не може да бъде повече от 20 символа'),

  country: z
    .string()
    .min(1, 'Държавата е задължителна')
    .max(100, 'Държавата не може да бъде повече от 100 символа'),

  // Business Information - Required fields
  taxNumber: z
    .string()
    .min(1, 'ДДС номерът е задължителен')
    .regex(
      /^[A-Z]{2}[0-9]{9,12}$/,
      'ДДС номерът трябва да започва с 2 букви, следвани от 9-12 цифри'
    )
    .max(20, 'ДДС номерът не може да бъде повече от 20 символа'),

  registrationNumber: z
    .string()
    .min(1, 'Регистрационният номер е задължителен')
    .max(50, 'Регистрационният номерът не може да бъде повече от 50 символа'),

  // Financial Information - Optional fields
  creditLimit: z
    .preprocess(
      val => (val === '' || val === undefined ? undefined : val),
      z
        .number({
          invalid_type_error: 'Кредитният лимит трябва да бъде валидно число',
        })
        .min(0, 'Кредитният лимит не може да бъде отрицателен')
        .optional()
    )
    .optional(),

  paymentTerms: z
    .preprocess(
      val => (val === '' || val === undefined ? undefined : val),
      requiredNumberField('Условията за плащане', 1, 365, true).optional()
    )
    .optional(),

  // Additional Information - Optional fields
  website: z
    .string()
    .url('Моля въведете валиден URL адрес')
    .max(255, 'Уебсайтът не може да бъде повече от 255 символа')
    .optional()
    .or(z.literal('')),

  description: z
    .string()
    .max(1000, 'Описанието не може да бъде повече от 1000 символа')
    .optional()
    .or(z.literal('')),

  // Contact Person Information - Optional fields
  contactPersonName: z
    .string()
    .max(255, 'Името на контактното лице не може да бъде повече от 255 символа')
    .optional()
    .or(z.literal('')),

  contactPersonEmail: z
    .string()
    .email('Моля въведете валиден имейл адрес за контактното лице')
    .max(255, 'Имейлът не може да бъде повече от 255 символа')
    .optional()
    .or(z.literal('')),

  contactPersonPhone: z
    .string()
    .regex(
      /^[+]?[0-9\s\-()]{7,20}$/,
      'Моля въведете валиден телефонен номер за контактното лице'
    )
    .optional()
    .or(z.literal('')),

  // Contract Information - Optional fields
  contractStartDate: z
    .string()
    .refine(
      date => {
        if (!date) return true; // Optional field
        const parsedDate = new Date(date);
        return !isNaN(parsedDate.getTime());
      },
      'Моля въведете валидна начална дата на договора'
    )
    .optional()
    .or(z.literal('')),

  contractEndDate: z
    .string()
    .refine(
      date => {
        if (!date) return true; // Optional field
        const parsedDate = new Date(date);
        return !isNaN(parsedDate.getTime());
      },
      'Моля въведете валидна крайна дата на договора'
    )
    .optional()
    .or(z.literal('')),

  // Services/Products - Required field
  servicesProvided: z
    .array(z.string())
    .min(1, 'Трябва да изберете поне една услуга/продукт')
    .max(20, 'Не можете да изберете повече от 20 услуги/продукта'),

  // Buildings access - Optional field
  buildingsAccess: z
    .array(z.string())
    .max(50, 'Не можете да изберете повече от 50 сгради')
    .optional(),
});

// Add cross-field validation for contract dates
export const addPartnerSchemaWithValidation = addPartnerSchema.refine(
  data => {
    if (data.contractStartDate && data.contractEndDate) {
      const startDate = new Date(data.contractStartDate);
      const endDate = new Date(data.contractEndDate);
      return startDate <= endDate;
    }
    return true;
  },
  {
    message: 'Крайната дата на договора трябва да бъде след началната дата',
    path: ['contractEndDate'],
  }
);

export type AddPartnerFormData = z.infer<typeof addPartnerSchemaWithValidation>;
