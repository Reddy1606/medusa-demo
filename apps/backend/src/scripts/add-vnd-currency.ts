import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { updateStoresWorkflow } from "@medusajs/medusa/core-flows";
import { IStoreModuleService } from "@medusajs/types";

export default async function ensureVndIsDefaultCurrency({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const storeModuleService = container.resolve<IStoreModuleService>(
    Modules.STORE,
  );
  const stores = await storeModuleService.listStores(
    {},
    { relations: ["supported_currencies"] },
  );

  if (stores.length !== 1) {
    throw new Error(`Expected exactly one store, found ${stores.length}`);
  }

  const store = stores[0];
  const supportedCurrencies = store.supported_currencies ?? [];
  const hasVnd = supportedCurrencies.some(
    ({ currency_code }) => currency_code.toLowerCase() === "vnd",
  );
  const hasEur = supportedCurrencies.some(
    ({ currency_code }) => currency_code.toLowerCase() === "eur",
  );
  const hasUsd = supportedCurrencies.some(
    ({ currency_code }) => currency_code.toLowerCase() === "usd",
  );
  const isVndTheOnlyDefault =
    hasVnd &&
    supportedCurrencies.every(({ currency_code, is_default }) =>
      currency_code.toLowerCase() === "vnd" ? is_default : !is_default,
    );
  const currencySummary = supportedCurrencies
    .map(
      ({ currency_code, is_default }) =>
        `${currency_code.toLowerCase()}${is_default ? " (default)" : ""}`,
    )
    .join(", ");

  logger.info(`Current supported currencies: ${currencySummary}`);

  if (hasEur && hasUsd && isVndTheOnlyDefault) {
    logger.info(
      "VND is already the default store currency; no changes needed.",
    );
    return;
  }

  const defaultCurrency = supportedCurrencies.find(({ is_default }) =>
    Boolean(is_default),
  );
  const previousDefault =
    defaultCurrency?.currency_code.toLowerCase() ?? "none";
  const updatedCurrencies = supportedCurrencies.map(({ currency_code }) => ({
    currency_code: currency_code.toLowerCase(),
    is_default: currency_code.toLowerCase() === "vnd",
  }));

  for (const currencyCode of ["eur", "usd", "vnd"]) {
    if (
      !updatedCurrencies.some(
        ({ currency_code }) => currency_code === currencyCode,
      )
    ) {
      updatedCurrencies.push({
        currency_code: currencyCode,
        is_default: currencyCode === "vnd",
      });
    }
  }

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        supported_currencies: updatedCurrencies,
      },
    },
  });

  logger.info(`Changed default store currency from ${previousDefault} to vnd.`);
}
