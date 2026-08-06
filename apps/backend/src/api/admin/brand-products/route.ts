import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import productBrandLink from "../../../links/product-brand";
import { BRAND_MODULE } from "../../../modules/brand";
import BrandModuleService from "../../../modules/brand/service";
import { AdminGetBrandProductsParamsType } from "./validators";

type ProductSummary = {
  id: string;
  title: string;
  subtitle: string | null;
  handle: string;
  thumbnail: string | null;
  updated_at: Date | string;
};

type ProductService = {
  listAndCountProducts: (
    filters: Record<string, unknown>,
    config: { skip?: number; take?: number; order?: Record<string, string> },
  ) => Promise<[ProductSummary[], number]>;
};

type ProductBrandLink = { product_id: string; brand_id: string };

const listLinks = async (
  req: MedusaRequest,
  filters: Record<string, unknown>,
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const links: ProductBrandLink[] = [];
  const batchSize = 1000;

  for (let skip = 0; ; skip += batchSize) {
    const { data } = await query.graph({
      entity: productBrandLink.entryPoint,
      fields: ["product_id", "brand_id"],
      filters,
      pagination: { skip, take: batchSize },
    });
    links.push(...(data as ProductBrandLink[]));

    if (data.length < batchSize) {
      return links;
    }
  }
};

export async function GET(
  req: MedusaRequest<unknown, AdminGetBrandProductsParamsType>,
  res: MedusaResponse,
) {
  const productService = req.scope.resolve<ProductService>(Modules.PRODUCT);
  const { skip, take, order } = req.queryConfig.pagination;
  const { q, brand_id: brandId, assignment } = req.filterableFields;
  const requiresAssignmentFilter = Boolean(brandId || assignment);
  const matchingLinks = requiresAssignmentFilter
    ? await listLinks(req, brandId ? { brand_id: brandId } : {})
    : [];
  const linkedProductIds = [
    ...new Set(matchingLinks.map((link) => link.product_id)),
  ];

  if ((brandId || assignment === "assigned") && !linkedProductIds.length) {
    res
      .status(200)
      .json({ products: [], count: 0, limit: take ?? 20, offset: skip ?? 0 });
    return;
  }

  const filters: Record<string, unknown> = {};
  if (q) {
    filters.$or = [
      { title: { $ilike: `%${q}%` } },
      { subtitle: { $ilike: `%${q}%` } },
      { handle: { $ilike: `%${q}%` } },
    ];
  }
  if (brandId || assignment === "assigned") {
    filters.id = linkedProductIds;
  } else if (assignment === "unassigned") {
    filters.id = linkedProductIds.length
      ? { $nin: linkedProductIds }
      : undefined;
  }

  const [products, count] = await productService.listAndCountProducts(filters, {
    skip,
    take,
    order,
  });
  const pageLinks = products.length
    ? await listLinks(req, {
        product_id: products.map((product) => product.id),
      })
    : [];
  const brandIds = [...new Set(pageLinks.map((link) => link.brand_id))];
  const brandService: BrandModuleService = req.scope.resolve(BRAND_MODULE);
  const brands = brandIds.length
    ? await brandService.listBrands({ id: brandIds })
    : [];
  const brandsById = new Map(brands.map((brand) => [brand.id, brand]));
  const brandIdByProductId = new Map(
    pageLinks.map((link) => [link.product_id, link.brand_id]),
  );

  res.status(200).json({
    products: products.map((product) => ({
      ...product,
      brand: brandsById.get(brandIdByProductId.get(product.id) ?? "") ?? null,
    })),
    count,
    limit: take ?? 20,
    offset: skip ?? 0,
  });
}
