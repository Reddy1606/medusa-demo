import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import {
  createServiceZonesWorkflow,
  createShippingOptionsWorkflow,
} from "@medusajs/medusa/core-flows";
import { IFulfillmentModuleService } from "@medusajs/types";

export default async function setupVietnamShipping({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const fulfillmentService = container.resolve<IFulfillmentModuleService>(
    Modules.FULFILLMENT,
  );
  const fulfillmentSets = await fulfillmentService.listFulfillmentSets(
    { type: "shipping" },
    { relations: ["service_zones.geo_zones"] },
  );
  const warehouseFulfillmentSet = fulfillmentSets.find((fulfillmentSet) =>
    fulfillmentSet.service_zones.some((zone) => zone.name === "Europe"),
  );

  if (!warehouseFulfillmentSet) {
    throw new Error("Could not find the European Warehouse fulfillment set");
  }

  let vietnamZone = warehouseFulfillmentSet.service_zones.find((zone) =>
    zone.geo_zones.some(
      (geoZone) => geoZone.country_code?.toLowerCase() === "vn",
    ),
  );

  if (!vietnamZone) {
    const { result } = await createServiceZonesWorkflow(container).run({
      input: {
        data: [
          {
            name: "Vietnam",
            fulfillment_set_id: warehouseFulfillmentSet.id,
            geo_zones: [{ type: "country", country_code: "vn" }],
          },
        ],
      },
    });

    vietnamZone = result[0];
    logger.info("Created Vietnam service zone.");
  }

  const shippingProfiles = await fulfillmentService.listShippingProfiles({
    type: "default",
  });

  if (shippingProfiles.length !== 1) {
    throw new Error(
      `Expected exactly one default shipping profile, found ${shippingProfiles.length}`,
    );
  }

  const existingOptions = await fulfillmentService.listShippingOptions({
    name: "Standard Shipping",
    service_zone: { id: vietnamZone.id },
  });

  if (existingOptions.length) {
    logger.info("Vietnam Standard Shipping already exists; no changes needed.");
    return;
  }

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: vietnamZone.id,
        shipping_profile_id: shippingProfiles[0].id,
        type: {
          label: "Standard",
          description: "Standard shipping in Vietnam.",
          code: "standard-vn",
        },
        prices: [{ currency_code: "vnd", amount: 30000 }],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
    ],
  });

  logger.info("Created Vietnam Standard Shipping for 30000 VND.");
}
