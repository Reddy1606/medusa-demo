import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import productBrandLink from "../../../../../links/product-brand";
import { BRAND_MODULE } from "../../../../../modules/brand";
import BrandModuleService from "../../../../../modules/brand/service";
import { toPublicBrand } from "../../../brands/helpers";

const BRAND_LIMIT = 6;

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const requestedCategoryIds = req.query.category_id;
  const categoryIds = Array.from(
    new Set([
      req.params.id,
      ...(Array.isArray(requestedCategoryIds)
        ? requestedCategoryIds
        : requestedCategoryIds
          ? [requestedCategoryIds]
          : []),
    ]),
  ).filter((id): id is string => typeof id === "string" && Boolean(id));
  const { data: categories } = await query.graph({
    entity: "product_category",
    fields: ["products.id"],
    filters: { id: categoryIds },
    pagination: { take: categoryIds.length },
  });
  const productIds = [
    ...new Set(
      (categories as Array<{ products?: Array<{ id: string }> }>).flatMap(
        (category) => category.products?.map((product) => product.id) ?? [],
      ),
    ),
  ];

  if (!productIds.length) {
    res.json({ brands: [], count: 0, limit: BRAND_LIMIT, offset: 0 });
    return;
  }

  const { data: links } = await query.graph({
    entity: productBrandLink.entryPoint,
    fields: ["brand_id"],
    filters: { product_id: productIds },
    pagination: { take: 1000 },
  });
  const brandIds = [
    ...new Set(
      (links as Array<{ brand_id: string }>).map((link) => link.brand_id),
    ),
  ];

  if (!brandIds.length) {
    res.json({ brands: [], count: 0, limit: BRAND_LIMIT, offset: 0 });
    return;
  }

  const brandService: BrandModuleService = req.scope.resolve(BRAND_MODULE);
  const brands = await brandService.listBrands(
    { id: brandIds, is_active: true },
    { take: BRAND_LIMIT, order: { name: "ASC" } },
  );

  res.json({
    brands: brands.map(toPublicBrand),
    count: brands.length,
    limit: BRAND_LIMIT,
    offset: 0,
  });
}
