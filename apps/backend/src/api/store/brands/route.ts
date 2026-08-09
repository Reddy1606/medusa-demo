import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { BRAND_MODULE } from "../../../modules/brand";
import BrandModuleService from "../../../modules/brand/service";
import { toPublicBrand } from "./helpers";
import { StoreGetBrandsParamsType } from "./validators";

export async function GET(
  req: MedusaRequest<unknown, StoreGetBrandsParamsType>,
  res: MedusaResponse,
) {
  const brandService: BrandModuleService = req.scope.resolve(BRAND_MODULE);
  const { skip, take, order } = req.queryConfig.pagination;
  const { q } = req.filterableFields;
  const filters = {
    is_active: true,
    ...(q
      ? {
          $or: [
            { name: { $ilike: `%${q}%` } },
            { handle: { $ilike: `%${q}%` } },
          ],
        }
      : {}),
  };
  const [brands, count] = await brandService.listAndCountBrands(filters, {
    skip,
    take,
    order,
  });

  res.json({
    brands: brands.map(toPublicBrand),
    count,
    limit: take ?? 20,
    offset: skip ?? 0,
  });
}
