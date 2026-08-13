import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sdk } from "../../lib/sdk";
import {
  CategoryPresentation,
  mergeCategoryPresentationMetadata,
} from "../../types/category-presentation";
import { toAdminApiError } from "./brands";

export const categoryPresentationQueryKeys = {
  detail: (id: string) => ["product-category-presentation", id] as const,
};

const retrieveCategory = (id: string) =>
  sdk.admin.productCategory.retrieve(id, {
    fields: "id,name,metadata",
  });

export const useCategoryPresentation = (id: string) =>
  useQuery({
    queryKey: categoryPresentationQueryKeys.detail(id),
    queryFn: async () => {
      try {
        return await retrieveCategory(id);
      } catch (error) {
        throw toAdminApiError(error);
      }
    },
    enabled: Boolean(id),
  });

export const useUpdateCategoryPresentation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (presentation: CategoryPresentation) => {
      try {
        const { product_category: current } = await retrieveCategory(id);
        const metadata = (current.metadata ?? {}) as Record<string, unknown>;

        return await sdk.admin.productCategory.update(
          id,
          {
            metadata: mergeCategoryPresentationMetadata(metadata, presentation),
          },
          { fields: "id,name,metadata" },
        );
      } catch (error) {
        throw toAdminApiError(error);
      }
    },
    onSuccess: async (response) => {
      queryClient.setQueryData(
        categoryPresentationQueryKeys.detail(id),
        response,
      );
      await queryClient.invalidateQueries({
        queryKey: categoryPresentationQueryKeys.detail(id),
      });
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
