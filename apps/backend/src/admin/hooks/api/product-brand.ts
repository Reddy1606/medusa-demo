import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sdk } from "../../lib/sdk";
import type {
  AdminProductBrandResponse,
  AdminSetProductBrandRequest,
  AdminSetProductBrandResponse,
} from "../../types/brand";
import { toAdminApiError } from "./brands";

export const productBrandQueryKeys = {
  all: ["product-brand"] as const,
  detail: (productId: string) =>
    [...productBrandQueryKeys.all, productId] as const,
};

export const useProductBrand = (productId: string) =>
  useQuery({
    queryKey: productBrandQueryKeys.detail(productId),
    queryFn: async () => {
      try {
        return await sdk.client.fetch<AdminProductBrandResponse>(
          `/admin/products/${productId}/brand`,
        );
      } catch (error) {
        throw toAdminApiError(error);
      }
    },
    enabled: Boolean(productId),
  });

export const useSetProductBrand = (productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AdminSetProductBrandRequest) => {
      try {
        return await sdk.client.fetch<AdminSetProductBrandResponse>(
          `/admin/products/${productId}/brand`,
          { method: "PUT", body: payload },
        );
      } catch (error) {
        throw toAdminApiError(error);
      }
    },
    onSuccess: async (response) => {
      queryClient.setQueryData<AdminProductBrandResponse>(
        productBrandQueryKeys.detail(productId),
        { brand: response.brand },
      );
      await queryClient.invalidateQueries({
        queryKey: productBrandQueryKeys.detail(productId),
        exact: true,
      });
    },
  });
};
