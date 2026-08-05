import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils";
import productBrandLink from "../../../../links/product-brand";
import { BRAND_MODULE } from "../../../../modules/brand";
import BrandModuleService from "../../../../modules/brand/service";
import { isDuplicateHandleError, retrieveBrand } from "../helpers";
import {
  AdminUpdateBrandType,
  getBrandMediaConsistencyError,
} from "../validators";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const brandService: BrandModuleService = req.scope.resolve(BRAND_MODULE);
  const brand = await retrieveBrand(brandService, req.params.id);

  res.status(200).json({ brand });
}

export async function PATCH(
  req: MedusaRequest<AdminUpdateBrandType>,
  res: MedusaResponse,
) {
  const brandService: BrandModuleService = req.scope.resolve(BRAND_MODULE);
  const existingBrand = await retrieveBrand(brandService, req.params.id);
  const mediaError = getBrandMediaConsistencyError({
    logo_url: existingBrand.logo_url,
    logo_file_id: existingBrand.logo_file_id,
    banner_url: existingBrand.banner_url,
    banner_file_id: existingBrand.banner_file_id,
    ...req.validatedBody,
  });

  if (mediaError) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, mediaError);
  }

  try {
    const brand = await brandService.updateBrands({
      id: req.params.id,
      ...req.validatedBody,
    });
    res.status(200).json({ brand });
  } catch (error) {
    if (isDuplicateHandleError(error)) {
      res.status(409).json({
        type: MedusaError.Types.CONFLICT,
        message: `A brand with handle "${req.validatedBody.handle}" already exists`,
      });
      return;
    }

    throw error;
  }
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const brandService: BrandModuleService = req.scope.resolve(BRAND_MODULE);
  await retrieveBrand(brandService, req.params.id);

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const { data: links } = await query.graph({
    entity: productBrandLink.entryPoint,
    fields: ["product_id"],
    filters: { brand_id: req.params.id },
    pagination: { take: 1 },
  });

  if (links.length) {
    res.status(409).json({
      type: MedusaError.Types.CONFLICT,
      message: "Brand cannot be deleted while it is linked to products",
    });
    return;
  }

  await brandService.softDeleteBrands(req.params.id);
  res.status(200).json({
    id: req.params.id,
    object: "brand",
    deleted: true,
  });
}
