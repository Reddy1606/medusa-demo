import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
  findActiveBrandForProduct,
  toPublicBrand,
} from "../../../brands/helpers";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const brand = await findActiveBrandForProduct(req, req.params.id);
  res.json({ brand: brand ? toPublicBrand(brand) : null });
}
