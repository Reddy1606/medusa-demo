import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { MedusaError } from "@medusajs/framework/utils";
import { BRAND_MODULE } from "../../../modules/brand";
import BrandModuleService from "../../../modules/brand/service";
import { normalizeBrandHandle } from "../../../modules/brand/utils/normalize-handle";
import { isDuplicateHandleError } from "./helpers";
import {
  AdminCreateBrandType,
  AdminGetBrandsParamsType,
  getBrandMediaConsistencyError,
} from "./validators";

export async function GET(
  req: MedusaRequest<unknown, AdminGetBrandsParamsType>,
  res: MedusaResponse,
) {
  const brandService: BrandModuleService = req.scope.resolve(BRAND_MODULE);
  const { skip, take, order } = req.queryConfig.pagination;
  const { q, ...filterableFields } = req.filterableFields;
  const filters = q
    ? {
        ...filterableFields,
        $or: [{ name: { $ilike: `%${q}%` } }, { handle: { $ilike: `%${q}%` } }],
      }
    : filterableFields;
  const [brands, count] = await brandService.listAndCountBrands(filters, {
    skip,
    take,
    order,
  });

  res.status(200).json({
    brands,
    count,
    limit: take ?? 20,
    offset: skip ?? 0,
  });
}

export async function POST(
  req: MedusaRequest<AdminCreateBrandType>,
  res: MedusaResponse,
) {
  const brandService: BrandModuleService = req.scope.resolve(BRAND_MODULE);
  const handle = normalizeBrandHandle(
    req.validatedBody.handle ?? req.validatedBody.name,
  );

  if (!handle) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Handle must contain at least one letter or number",
    );
  }

  const input = { ...req.validatedBody, handle };
  const mediaError = getBrandMediaConsistencyError(input);

  if (mediaError) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, mediaError);
  }

  try {
    const brand = await brandService.createBrands(input);
    res.status(201).json({ brand });
  } catch (error) {
    if (isDuplicateHandleError(error)) {
      res.status(409).json({
        type: MedusaError.Types.CONFLICT,
        message: `A brand with handle "${handle}" already exists`,
      });
      return;
    }

    throw error;
  }
}
