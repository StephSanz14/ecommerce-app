import { z } from 'zod';

export const PaymentMethodTypeSchema = z.enum([
  'credit_card',
  'debit_card',
  'paypal',
  'bank_transfer',
  'cash_on_delivery',
]);

export type PaymentMethodType = z.infer<typeof PaymentMethodTypeSchema>;

export const PaymentMethodSchema = z.object({
  _id: z.string().min(1, 'El ID es requerido'),

  type: PaymentMethodTypeSchema,

  cardNumber: z
    .string()
    .optional()
    .nullable(),

  cardHolderName: z.string().optional().nullable(),

  expiryDate: z.string().optional().nullable(),

  paypalEmail: z
    .string()
    .optional()
    .nullable(),

  bankName: z
    .string()

    .optional(),

  accountNumber: z
    .string()
    .optional()
    .nullable(),

  isDefault: z.boolean(),
  isActive: z.boolean(),
});

export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;

export const PaymentMethodArraySchema = z.array(PaymentMethodSchema);

export const CreatePaymentMethodSchema = PaymentMethodSchema.omit({
  _id: true,
});
export type CreatePaymentMethod = z.infer<typeof CreatePaymentMethodSchema>;

export const UpdatePaymentMethodSchema = PaymentMethodSchema.partial().required(
  { _id: true }
);
export type UpdatePaymentMethod = z.infer<typeof UpdatePaymentMethodSchema>;
