import {
  authenticate,
  defineMiddlewares,
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework/http";
import {
  AdminCreateBrand,
  AdminGetBrandsParams,
  AdminUpdateBrand,
} from "./admin/brands/validators";

export default defineMiddlewares({
  routes: [
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
