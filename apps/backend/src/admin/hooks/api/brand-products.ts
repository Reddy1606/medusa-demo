import { useQuery } from "@tanstack/react-query";
import { sdk } from "../../lib/sdk";
import type {
  AdminBrandProductListParams,
  AdminBrandProductListResponse,
} from "../../types/brand";
import { toAdminApiError } from "./brands";
import { brandProductsQueryKeys } from "./product-brand";

const buildPath = (params: AdminBrandProductListParams) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") search.set(key, String(value));
  });
  const query = search.toString();
  return `/admin/brand-products${query ? `?${query}` : ""}`;
};

export const useBrandProducts = (params: AdminBrandProductListParams) =>
  useQuery({
    queryKey: [...brandProductsQueryKeys.all, params],
    queryFn: async () => {
      try {
        return await sdk.client.fetch<AdminBrandProductListResponse>(
          buildPath(params),
        );
      } catch (error) {
        throw toAdminApiError(error);
      }
    },
  });
