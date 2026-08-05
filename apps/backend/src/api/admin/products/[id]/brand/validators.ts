import { z } from "@medusajs/framework/zod";

export const AdminSetProductBrand = z
  .object({
    brand_id: z.string().trim().min(1).max(255).nullable(),
  })
  .strict();

export type AdminSetProductBrandType = z.infer<typeof AdminSetProductBrand>;
