import { z } from "@medusajs/framework/zod";
import { createFindParams } from "@medusajs/medusa/api/utils/validators";

export const StoreGetBrandsParams = createFindParams({
  limit: 20,
  offset: 0,
  order: "name",
}).merge(
  z.object({
    q: z.string().trim().max(255).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    offset: z.coerce.number().int().min(0).optional(),
    order: z
      .string()
      .regex(/^-(name|created_at)$|^(name|created_at)$/)
      .default("name"),
  }),
);

export type StoreGetBrandsParamsType = z.infer<typeof StoreGetBrandsParams>;
