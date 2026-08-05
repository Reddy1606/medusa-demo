import { MedusaError } from "@medusajs/framework/utils";
import BrandModuleService from "../../../modules/brand/service";

export const retrieveBrand = async (
  brandService: BrandModuleService,
  id: string,
) => {
  const brands = await brandService.listBrands({ id }, { take: 1 });

  if (!brands.length) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Brand with id "${id}" not found`,
    );
  }

  return brands[0];
};

export const isDuplicateHandleError = (error: unknown) => {
  if (!error || typeof error !== "object") {
    return false;
  }

  const candidate = error as {
    code?: string;
    constraint?: string;
    message?: string;
    type?: string;
  };

  return (
    (candidate.code === "23505" &&
      (candidate.constraint === "IDX_brand_handle_unique" ||
        candidate.message?.includes("IDX_brand_handle_unique") === true)) ||
    (candidate.type === MedusaError.Types.INVALID_DATA &&
      candidate.message?.startsWith("Brand with handle:") === true &&
      candidate.message.endsWith("already exists."))
  );
};
