import { z } from "@medusajs/framework/zod";
import { createFindParams } from "@medusajs/medusa/api/utils/validators";
import { normalizeBrandHandle } from "../../../modules/brand/utils/normalize-handle";

const nullableAssetLocation = z
  .string()
  .trim()
  .max(2048)
  .refine(
    (value) => {
      if (value.startsWith("/")) {
        return !value.startsWith("//");
      }

      try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "Must be an HTTP(S) URL or an absolute local path" },
  )
  .nullable();

const optionalBoolean = z.preprocess((value) => {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return value;
}, z.boolean().optional());

const brandFields = {
  name: z.string().trim().min(1).max(255),
  handle: z
    .string()
    .trim()
    .min(1)
    .max(255)
    .transform(normalizeBrandHandle)
    .refine((value) => value.length > 0, {
      message: "Handle must contain at least one letter or number",
    }),
  description: z.string().trim().max(10_000).nullable(),
  logo_url: nullableAssetLocation,
  logo_file_id: z.string().trim().min(1).max(255).nullable(),
  banner_url: nullableAssetLocation,
  banner_file_id: z.string().trim().min(1).max(255).nullable(),
  is_active: z.boolean(),
  metadata: z.record(z.string(), z.unknown()).nullable(),
};

export const AdminGetBrandsParams = createFindParams({
  limit: 20,
  offset: 0,
  order: "-created_at",
}).merge(
  z.object({
    q: z.string().trim().max(255).optional(),
    is_active: optionalBoolean,
    order: z
      .string()
      .regex(
        /^-(created_at|updated_at|name|handle)$|^(created_at|updated_at|name|handle)$/,
      )
      .default("-created_at"),
  }),
);

export const AdminCreateBrand = z
  .object({
    ...brandFields,
    handle: brandFields.handle.optional(),
    description: brandFields.description.optional(),
    logo_url: brandFields.logo_url.optional(),
    logo_file_id: brandFields.logo_file_id.optional(),
    banner_url: brandFields.banner_url.optional(),
    banner_file_id: brandFields.banner_file_id.optional(),
    is_active: brandFields.is_active.optional(),
    metadata: brandFields.metadata.optional(),
  })
  .strict();

export const AdminUpdateBrand = z.object(brandFields).partial().strict();

export type AdminCreateBrandType = z.infer<typeof AdminCreateBrand>;
export type AdminUpdateBrandType = z.infer<typeof AdminUpdateBrand>;
export type AdminGetBrandsParamsType = z.infer<typeof AdminGetBrandsParams>;

type BrandMediaFields = Pick<
  AdminCreateBrandType,
  "logo_url" | "logo_file_id" | "banner_url" | "banner_file_id"
>;

export const getBrandMediaConsistencyError = (
  brand: BrandMediaFields,
): string | undefined => {
  if (brand.logo_file_id && !brand.logo_url) {
    return "logo_url is required when logo_file_id is set";
  }

  if (brand.banner_file_id && !brand.banner_url) {
    return "banner_url is required when banner_file_id is set";
  }
};
