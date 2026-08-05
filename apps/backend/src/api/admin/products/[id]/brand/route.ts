import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils";
import {
  productBrandLinkDefinition,
  retrieveBrand,
  retrieveProduct,
  retrieveProductBrandLink,
} from "./helpers";
import { AdminSetProductBrandType } from "./validators";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  await retrieveProduct(req, req.params.id);
  const currentLink = await retrieveProductBrandLink(req, req.params.id);
  const brand = currentLink
    ? await retrieveBrand(req, currentLink.brand_id)
    : null;

  res.status(200).json({ brand });
}

export async function PUT(
  req: MedusaRequest<AdminSetProductBrandType>,
  res: MedusaResponse,
) {
  const productId = req.params.id;
  const requestedBrandId = req.validatedBody.brand_id;
  await retrieveProduct(req, productId);

  const requestedBrand = requestedBrandId
    ? await retrieveBrand(req, requestedBrandId)
    : null;

  if (requestedBrand && !requestedBrand.is_active) {
    res.status(409).json({
      type: MedusaError.Types.NOT_ALLOWED,
      message: "Inactive Brands cannot be assigned",
    });
    return;
  }

  const currentLink = await retrieveProductBrandLink(req, productId);

  if (currentLink?.brand_id === requestedBrandId) {
    res.status(200).json({ product_id: productId, brand: requestedBrand });
    return;
  }

  const link = req.scope.resolve(ContainerRegistrationKeys.LINK);
  const currentDefinition = currentLink
    ? productBrandLinkDefinition(productId, currentLink.brand_id)
    : null;

  if (currentDefinition) {
    try {
      await link.dismiss(currentDefinition);
    } catch {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "Brand assignment could not be updated",
      );
    }
  }

  if (requestedBrandId) {
    try {
      await link.create(
        productBrandLinkDefinition(productId, requestedBrandId),
      );
    } catch {
      if (currentDefinition) {
        try {
          await link.create(currentDefinition);
        } catch {
          throw new MedusaError(
            MedusaError.Types.UNEXPECTED_STATE,
            "Brand assignment failed and the previous association could not be restored",
          );
        }
      }

      res.status(409).json({
        type: MedusaError.Types.CONFLICT,
        message: "Brand cannot be assigned",
      });
      return;
    }
  }

  res.status(200).json({ product_id: productId, brand: requestedBrand });
}
