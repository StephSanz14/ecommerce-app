import { z } from 'zod';

export const AddressTypeSchema = z.enum(['home', 'work', 'other']);
export type AddressType = z.infer<typeof AddressTypeSchema>;

export const ShippingAddressSchema = z.object({
  _id: z.string().min(1, 'El ID es requerido'),

  user: z.string().min(1, 'El usuario es requerido'), 

  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .trim(),

  address: z
    .string()
    .min(1, 'La dirección es requerida')
    .trim(),

  city: z
    .string()
    .min(1, 'La ciudad es requerida')
    .trim(),

  state: z
    .string()
    .min(1, 'El estado es requerido')
    .trim(),

  postalCode: z
    .string()
    .min(4, 'El código postal debe tener al menos 4 caracteres')
    .max(6, 'El código postal debe tener máximo 6 caracteres')
    .trim(),

  country: z
    .string()
    .min(1, 'El país es requerido')
    .default('México'),

  phone: z
    .string()
    .min(1, 'El teléfono es requerido')
    .trim(),

  isDefault: z.boolean().default(false),

  addressType: AddressTypeSchema.default('home'),
});

export type ShippingAddress = z.infer<typeof ShippingAddressSchema>;

export const ShippingAddressArraySchema = z.array(ShippingAddressSchema);

// Create (sin _id)
export const CreateShippingAddressSchema = ShippingAddressSchema.omit({
  _id: true,
});
export type CreateShippingAddress = z.infer<typeof CreateShippingAddressSchema>;

// Update (parcial, pero _id requerido)
export const UpdateShippingAddressSchema = ShippingAddressSchema.partial().required({
  _id: true,
});
export type UpdateShippingAddress = z.infer<typeof UpdateShippingAddressSchema>;