import { z } from "@medusajs/framework/zod";

import { normalizeVietnamesePhone } from "./utils";

export const GuestOrderTrackingSchema = z.object({
  email: z
    .string()
    .trim()
    .email()
    .max(320)
    .transform((value) => value.toLowerCase()),
  phone: z
    .string()
    .trim()
    .transform((value) => normalizeVietnamesePhone(value))
    .refine((value) => value !== null, {
      message: "Invalid Vietnamese phone number",
    })
    .transform((value) => value as string),
});

export type GuestOrderTrackingRequest = z.infer<
  typeof GuestOrderTrackingSchema
>;
