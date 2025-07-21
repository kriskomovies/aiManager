import { z } from 'zod';
import { ApartmentType, ResidentRole } from '@repo/interfaces';

// Resident schema
export const residentSchema = z.object({
  name: z.string().min(1, 'Името е задължително'),
  surname: z.string().min(1, 'Фамилията е задължителна'),
  phone: z.string().min(1, 'Телефонът е задължителен'),
  email: z.string().email('Невалиден имейл адрес'),
  role: z.nativeEnum(ResidentRole),
  isMainContact: z.boolean(),
});

// Main apartment schema
export const addApartmentSchema = z
  .object({
    // Basic Information
    type: z.nativeEnum(ApartmentType, {
      required_error: 'Изберете тип на апартамента',
    }),
    number: z.string().min(1, 'Номерът на апартамента е задължителен'),
    floor: z.coerce.number().min(0, 'Етажът трябва да е положително число'),
    quadrature: z.coerce
      .number()
      .min(0.1, 'Квадратурата трябва да е положително число'),
    commonParts: z.coerce
      .number()
      .min(0, 'Общите части трябва да са положително число')
      .optional(),
    idealParts: z.coerce
      .number()
      .min(0, 'Идеалните части трябва да са положително число')
      .optional(),

    // Residents Information
    residentsCount: z.coerce
      .number()
      .min(0, 'Броят живущи трябва да е положително число'),
    pets: z.coerce
      .number()
      .min(0, 'Броят домашни любимци трябва да е положително число'),

    // Settings
    invoiceEnabled: z.boolean(),
    blockForPayment: z.boolean(),
    cashierNote: z.string().optional(),

    // Financial Information
    monthlyRent: z.coerce
      .number()
      .min(0, 'Месечната наемна цена трябва да е положително число')
      .optional(),
    maintenanceFee: z.coerce
      .number()
      .min(0, 'Таксата поддръжка трябва да е положително число')
      .optional(),

    // Residents
    residents: z.array(residentSchema),
  })
  .refine(
    data => {
      // Validate residents count matches actual residents
      if (data.residents.length !== data.residentsCount) {
        return false;
      }
      return true;
    },
    {
      message: 'Броят живущи не съвпада с добавените живущи',
      path: ['residentsCount'],
    }
  )
  .refine(
    data => {
      // Validate only one main contact
      const mainContacts = data.residents.filter(r => r.isMainContact);
      return mainContacts.length <= 1;
    },
    {
      message: 'Може да има само един основен контакт',
      path: ['residents'],
    }
  );

export type AddApartmentFormData = z.infer<typeof addApartmentSchema>;
export type ResidentFormData = z.infer<typeof residentSchema>;
