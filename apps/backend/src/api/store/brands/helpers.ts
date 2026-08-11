import { MedusaRequest } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import productBrandLink from "../../../links/product-brand";
import { BRAND_MODULE } from "../../../modules/brand";
import BrandModuleService from "../../../modules/brand/service";

export type PublicBrand = {
  id: string;
  name: string;
  handle: string;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
};

export const toPublicBrand = (brand: PublicBrand): PublicBrand => ({
  id: brand.id,
  name: brand.name,
  handle: brand.handle,
  description: brand.description,
  logo_url: brand.logo_url,
  banner_url: brand.banner_url,
});

export const findActiveBrand = async (req: MedusaRequest, handle: string) => {
  const brandService: BrandModuleService = req.scope.resolve(BRAND_MODULE);
  const brands = await brandService.listBrands(
    { handle, is_active: true },
    { take: 1 },
  );
  return brands[0];
};

export const listLinkedProductIds = async (
  req: MedusaRequest,
  brandId: string,
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const productIds: string[] = [];
  const take = 1000;

  for (let skip = 0; ; skip += take) {
    const { data } = await query.graph({
      entity: productBrandLink.entryPoint,
      fields: ["product_id"],
      filters: { brand_id: brandId },
      pagination: { skip, take },
    });
    productIds.push(
      ...(data as Array<{ product_id: string }>).map((link) => link.product_id),
    );
    if (data.length < take) return productIds;
  }
};

export const findActiveBrandForProduct = async (
  req: MedusaRequest,
  productId: string,
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const { data } = await query.graph({
    entity: productBrandLink.entryPoint,
    fields: ["brand_id"],
    filters: { product_id: productId },
    pagination: { take: 1 },
  });
  const brandId = (data[0] as { brand_id?: string } | undefined)?.brand_id;

  if (!brandId) return undefined;

  const brandService: BrandModuleService = req.scope.resolve(BRAND_MODULE);
  const brands = await brandService.listBrands(
    { id: brandId, is_active: true },
    { take: 1 },
  );
  return brands[0];
};
