import {
  applyDefaultFilters,
  authenticate,
  clearFiltersByKey,
  defineMiddlewares,
  maybeApplyLinkFilter,
  type MedusaNextFunction,
  type MedusaRequest,
  type MedusaResponse,
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework/http";
import { ProductStatus } from "@medusajs/framework/utils";
import { filterByValidSalesChannels } from "@medusajs/medusa/api/utils/middlewares/products/filter-by-valid-sales-channels";
import { normalizeDataForContext } from "@medusajs/medusa/api/utils/middlewares/products/normalize-data-for-context";
import { setPricingContext } from "@medusajs/medusa/api/utils/middlewares/products/set-pricing-context";
import { setTaxContext } from "@medusajs/medusa/api/utils/middlewares/products/set-tax-context";
import { StoreGetProductsParams } from "@medusajs/medusa/api/store/products/validators";
import { defaultStoreProductFields } from "@medusajs/medusa/api/store/products/query-config";

import {
  AdminCreateBrand,
  AdminGetBrandsParams,
  AdminUpdateBrand,
} from "./admin/brands/validators";
import { AdminGetBrandProductsParams } from "./admin/brand-products/validators";
import { AdminSetProductBrand } from "./admin/products/[id]/brand/validators";

import { GuestOrderTrackingSchema } from "./store/guest-order-tracking/validators";
import { findActiveBrand, listLinkedProductIds } from "./store/brands/helpers";
import { StoreGetBrandsParams } from "./store/brands/validators";
import { z } from "@medusajs/framework/zod";

const StoreGetBrandProductsParams = StoreGetProductsParams.and(
  z.object({
    limit: z.coerce.number().int().min(1).max(100).optional(),
    offset: z.coerce.number().int().min(0).optional(),
  }),
);

function disableGuestOrderTrackingCache(
  _req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction,
) {
  res.setHeader("Cache-Control", "no-store");
  next();
}

async function filterProductsByBrand(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction,
) {
  const brand = await findActiveBrand(req, req.params.handle);
  if (!brand) {
    res.status(404).json({ message: "Brand not found" });
    return;
  }

  const productIds = await listLinkedProductIds(req, brand.id);
  req.filterableFields.id = productIds.length ? productIds : ["__no_product__"];
  next();
}

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/brands",
      method: "GET",
      middlewares: [
        validateAndTransformQuery(StoreGetBrandsParams, {
          defaults: [
            "id",
            "name",
            "handle",
            "description",
            "logo_url",
            "banner_url",
          ],
          isList: true,
        }),
      ],
    },
    {
      matcher: "/store/brands/:handle/products",
      method: "GET",
      middlewares: [
        authenticate("customer", ["session", "bearer"], {
          allowUnauthenticated: true,
        }),
        validateAndTransformQuery(StoreGetBrandProductsParams, {
          defaults: defaultStoreProductFields,
          defaultLimit: 12,
          isList: true,
        }),
        filterProductsByBrand,
        filterByValidSalesChannels(),
        maybeApplyLinkFilter({
          entryPoint: "product_sales_channel",
          resourceId: "product_id",
          filterableField: "sales_channel_id",
        }),
        applyDefaultFilters({ status: ProductStatus.PUBLISHED }),
        normalizeDataForContext(),
        setPricingContext(),
        setTaxContext(),
        clearFiltersByKey(["region_id", "country_code", "province", "cart_id"]),
      ],
    },
    {
      matcher: /^\/store\/guest-order-tracking(?:\/.*)?$/,
      middlewares: [disableGuestOrderTrackingCache],
    },
    {
      matcher: "/store/guest-order-tracking",
      method: "POST",
      middlewares: [validateAndTransformBody(GuestOrderTrackingSchema)],
    },
    {
      matcher: "/admin/brand-products",
      middlewares: [authenticate("user", ["session", "bearer", "api-key"])],
    },
    {
      matcher: "/admin/brand-products",
      method: "GET",
      middlewares: [
        validateAndTransformQuery(AdminGetBrandProductsParams, {
          defaults: [
            "id",
            "title",
            "subtitle",
            "handle",
            "thumbnail",
            "updated_at",
          ],
          isList: true,
        }),
      ],
    },
    {
      matcher: "/admin/brands*",
      middlewares: [authenticate("user", ["session", "bearer", "api-key"])],
    },
    {
      matcher: "/admin/products/:id/brand",
      middlewares: [authenticate("user", ["session", "bearer", "api-key"])],
    },
    {
      matcher: "/admin/products/:id/brand",
      method: "PUT",
      middlewares: [validateAndTransformBody(AdminSetProductBrand)],
    },
    {
      matcher: "/admin/brands",
      method: "GET",
      middlewares: [
        validateAndTransformQuery(AdminGetBrandsParams, {
          defaults: [
            "id",
            "name",
            "handle",
            "description",
            "logo_url",
            "logo_file_id",
            "banner_url",
            "banner_file_id",
            "is_active",
            "metadata",
            "created_at",
            "updated_at",
          ],
          isList: true,
        }),
      ],
    },
    {
      matcher: "/admin/brands",
      method: "POST",
      middlewares: [validateAndTransformBody(AdminCreateBrand)],
    },
    {
      matcher: "/admin/brands/:id",
      method: "PATCH",
      middlewares: [validateAndTransformBody(AdminUpdateBrand)],
    },
  ],
});
