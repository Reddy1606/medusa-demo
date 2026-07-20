import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { IPricingModuleService } from "@medusajs/types";

const vndPricesByProductHandle: Record<string, number> = {
  "t-shirt": 150000,
  sweatshirt: 250000,
  shorts: 100000,
  sweatpants: 200000,
  "magie-citrate-unimedica-180-vien": 450000,
  "magie-citrate-unimedica-300g": 320000,
};

type ProductPriceData = {
  id: string;
  title: string;
  handle: string;
  variants: Array<{
    id: string;
    title: string;
    price_set: {
      id: string;
      prices: Array<{
        id: string;
        amount: number;
        currency_code: string;
      }>;
    };
  }>;
};

const getProductsWithPrices = async (container: MedusaContainer) => {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const { data } = await query.graph({
    entity: "product",
    fields: [
      "id",
      "title",
      "handle",
      "variants.id",
      "variants.title",
      "variants.price_set.id",
      "variants.price_set.prices.id",
      "variants.price_set.prices.amount",
      "variants.price_set.prices.currency_code",
    ],
  });

  return data as ProductPriceData[];
};

const getNonVndPriceSignature = (products: ProductPriceData[]) => {
  return products
    .flatMap((product) =>
      product.variants.flatMap((variant) =>
        variant.price_set.prices
          .filter(({ currency_code }) => currency_code.toLowerCase() !== "vnd")
          .map(
            ({ id, amount, currency_code }) =>
              `${variant.id}:${id}:${currency_code.toLowerCase()}:${amount}`,
          ),
      ),
    )
    .sort()
    .join("|");
};

export default async function addVndProductPrices({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const pricingService = container.resolve<IPricingModuleService>(
    Modules.PRICING,
  );
  const products = await getProductsWithPrices(container);
  const missingMappings = products
    .filter((product) => vndPricesByProductHandle[product.handle] === undefined)
    .map((product) => product.handle);

  if (missingMappings.length) {
    throw new Error(
      `Missing explicit VND price mapping for: ${missingMappings.join(", ")}`,
    );
  }

  const nonVndPricesBefore = getNonVndPriceSignature(products);
  const additions = products.flatMap((product) =>
    product.variants
      .filter(
        (variant) =>
          !variant.price_set.prices.some(
            ({ currency_code }) => currency_code.toLowerCase() === "vnd",
          ),
      )
      .map((variant) => ({
        priceSetId: variant.price_set.id,
        prices: [
          {
            currency_code: "vnd",
            amount: vndPricesByProductHandle[product.handle],
          },
        ],
      })),
  );
  const variantCount = products.reduce(
    (count, product) => count + product.variants.length,
    0,
  );
  const skippedCount = variantCount - additions.length;

  if (additions.length) {
    await pricingService.addPrices(additions);
  }

  const updatedProducts = await getProductsWithPrices(container);
  const variantsMissingVnd = updatedProducts.flatMap((product) =>
    product.variants.filter(
      (variant) =>
        !variant.price_set.prices.some(
          ({ currency_code }) => currency_code.toLowerCase() === "vnd",
        ),
    ),
  );

  if (variantsMissingVnd.length) {
    throw new Error(
      `${variantsMissingVnd.length} variants are still missing a VND price`,
    );
  }

  if (getNonVndPriceSignature(updatedProducts) !== nonVndPricesBefore) {
    throw new Error("Existing non-VND prices changed unexpectedly");
  }

  logger.info(`Updated ${additions.length} variants with VND prices.`);
  logger.info(`Skipped ${skippedCount} variants that already had VND prices.`);
  logger.info(`Verified VND prices on all ${variantCount} variants.`);
  logger.info("Verified that all existing non-VND prices are unchanged.");
}
