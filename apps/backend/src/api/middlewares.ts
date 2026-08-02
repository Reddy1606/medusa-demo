import {
  defineMiddlewares,
  type MedusaNextFunction,
  type MedusaRequest,
  type MedusaResponse,
  validateAndTransformBody,
} from "@medusajs/framework/http";

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
  ],
});
