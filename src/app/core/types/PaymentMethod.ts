import { z } from 'zod';

const PaymentMethodTypeSchema = z.enum([
  'credit_card',
  'debit_card',
  'paypal',
  'bank_transfer',
  'cash_on_delivery',
]);

export const PaymentMethodSchema = z.object({
  _id: z.string(),
  type: PaymentMethodTypeSchema,
  cardNumber: z
    .string()
    .regex(/^\d{16}$/)
    .optional(),
  cardHolderName: z.string().optional(),
  expiryDate: z.string().optional(),
  paypalEmail: z
    .string()
    .regex(/^\S+@\S+\.\S+$/)
    .optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().min(8).optional(),
  isDefault: z.boolean(),
  isActive: z.boolean(),
});

export const PaymentMethodArraySchema = z.array(PaymentMethodSchema);

export type PaymentMethod = z.infer<typeof PaymentMethodSchema>

export const CreatePaymentMethodSchema = PaymentMethodSchema.omit({_id: true})
export type CreatePaymentMethod = z.infer<typeof CreatePaymentMethodSchema>;

export const UpdatePaymentMethodSchema = PaymentMethodSchema.partial().required({_id: true});
export type UpdatePaymentMethod = z.infer<typeof UpdatePaymentMethodSchema>;