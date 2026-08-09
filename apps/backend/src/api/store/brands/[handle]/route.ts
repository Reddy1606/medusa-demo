import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { MedusaError } from "@medusajs/framework/utils";
import { findActiveBrand, toPublicBrand } from "../helpers";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const brand = await findActiveBrand(req, req.params.handle);
  if (!brand) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "Brand not found");
  }
  res.json({ brand: toPublicBrand(brand) });
}
