import { MedusaService } from "@medusajs/framework/utils";
import Brand from "./models/brand";
import { normalizeBrandHandle } from "./utils/normalize-handle";

type BrandInput = {
  handle?: string;
  [key: string]: unknown;
};

type BrandUpdateInput =
  | BrandInput
  | BrandInput[]
  | {
      selector: Record<string, unknown>;
      data: BrandInput | BrandInput[];
    }
  | Array<{
      selector: Record<string, unknown>;
      data: BrandInput | BrandInput[];
    }>;

const normalizeBrandInput = <T extends BrandInput>(input: T): T => ({
  ...input,
  ...(typeof input.handle === "string"
    ? { handle: normalizeBrandHandle(input.handle) }
    : {}),
});

const normalizeBrandUpdateInput = (
  input: BrandUpdateInput,
): BrandUpdateInput => {
  if (Array.isArray(input)) {
    return input.map((item) =>
      normalizeBrandUpdateInput(item),
    ) as BrandUpdateInput;
  }

  if ("selector" in input && "data" in input) {
    return {
      ...input,
      data: Array.isArray(input.data)
        ? input.data.map(normalizeBrandInput)
        : normalizeBrandInput(input.data as BrandInput),
    };
  }

  return normalizeBrandInput(input);
};

const BaseBrandModuleService = MedusaService({ Brand });

class BrandModuleService extends BaseBrandModuleService {
  createBrands = async (data: any, ...rest: any[]): Promise<any> => {
    const normalized = Array.isArray(data)
      ? data.map(normalizeBrandInput)
      : normalizeBrandInput(data);

    return BaseBrandModuleService.prototype.createBrands.call(
      this,
      normalized,
      ...rest,
    );
  };

  updateBrands = async (data: any, ...rest: any[]): Promise<any> => {
    return BaseBrandModuleService.prototype.updateBrands.call(
      this,
      normalizeBrandUpdateInput(data) as any,
      ...rest,
    );
  };
}

export default BrandModuleService;
