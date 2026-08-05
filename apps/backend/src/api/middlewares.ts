import {
  authenticate,
  defineMiddlewares,
  type MedusaNextFunction,
  type MedusaRequest,
  type MedusaResponse,
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework/http";

import {
  AdminCreateBrand,
  AdminGetBrandsParams,
  AdminUpdateBrand,
} from "./admin/brands/validators";

import { GuestOrderTrackingSchema } from "./store/guest-order-tracking/validators";

function disableGuestOrderTrackingCache(
  _req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction,
) {
  res.setHeader("Cache-Control", "no-store");
  next();
}

export default defineMiddlewares({
  routes: [
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
      matcher: "/admin/brands*",
      middlewares: [authenticate("user", ["session", "bearer", "api-key"])],
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
