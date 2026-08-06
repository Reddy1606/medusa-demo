import { z } from "@medusajs/framework/zod";
import { createFindParams } from "@medusajs/medusa/api/utils/validators";

export const AdminGetBrandProductsParams = createFindParams({
  limit: 20,
  offset: 0,
  order: "-updated_at",
}).merge(
  z.object({
    q: z.string().trim().max(255).optional(),
    brand_id: z.string().trim().min(1).max(255).optional(),
    assignment: z.enum(["assigned", "unassigned"]).optional(),
    order: z
      .string()
      .regex(/^-(updated_at|title)$|^(updated_at|title)$/)
      .default("-updated_at"),
  }),
);

export type AdminGetBrandProductsParamsType = z.infer<
  typeof AdminGetBrandProductsParams
>;
