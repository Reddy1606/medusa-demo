import { MedusaResponse, MedusaStoreRequest } from "@medusajs/framework/http";
import {
  ContainerRegistrationKeys,
  isPresent,
  QueryContext,
} from "@medusajs/framework/utils";
import { HttpTypes } from "@medusajs/framework/types";
import { wrapProductsWithTaxPrices } from "@medusajs/medusa/api/store/products/helpers";

export async function GET(req: MedusaStoreRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const context: Record<string, unknown> = {};

  if (isPresent(req.pricingContext)) {
    context.variants = {
      calculated_price: QueryContext(req.pricingContext!),
    };
  }

  const { data: products = [], metadata } = await query.graph(
    {
      entity: "product",
      fields: req.queryConfig.fields,
      filters: req.filterableFields,
      pagination: req.queryConfig.pagination,
      context,
    },
    { cache: { enable: false }, locale: req.locale },
  );

  await wrapProductsWithTaxPrices(req, products as HttpTypes.StoreProduct[]);
  res.json({
    products,
    count: metadata?.count ?? products.length,
    offset: metadata?.skip ?? req.queryConfig.pagination.skip ?? 0,
    limit: metadata?.take ?? req.queryConfig.pagination.take ?? 12,
  });
}
