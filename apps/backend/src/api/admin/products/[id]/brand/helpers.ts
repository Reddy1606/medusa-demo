import { MedusaRequest } from "@medusajs/framework/http";
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils";
import productBrandLink from "../../../../../links/product-brand";
import { BRAND_MODULE } from "../../../../../modules/brand";
import BrandModuleService from "../../../../../modules/brand/service";

type ProductService = {
  listProducts: (
    filters: { id: string },
    config: { take: number },
  ) => Promise<Array<{ id: string }>>;
};

export const retrieveProduct = async (req: MedusaRequest, id: string) => {
  const productService = req.scope.resolve<ProductService>(Modules.PRODUCT);
  const products = await productService.listProducts({ id }, { take: 1 });

  if (!products.length) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Product with id "${id}" not found`,
    );
  }

  return products[0];
};

export const retrieveProductBrandLink = async (
  req: MedusaRequest,
  productId: string,
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const { data: links } = await query.graph({
    entity: productBrandLink.entryPoint,
    fields: ["brand_id"],
    filters: { product_id: productId },
    pagination: { take: 1 },
  });

  return links[0] as { brand_id: string } | undefined;
};

export const retrieveBrand = async (req: MedusaRequest, id: string) => {
  const brandService: BrandModuleService = req.scope.resolve(BRAND_MODULE);
  const brands = await brandService.listBrands({ id }, { take: 1 });

  if (!brands.length) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Brand with id "${id}" not found`,
    );
  }

  return brands[0];
};

export const productBrandLinkDefinition = (
  productId: string,
  brandId: string,
) => ({
  [Modules.PRODUCT]: { product_id: productId },
  [BRAND_MODULE]: { brand_id: brandId },
});
