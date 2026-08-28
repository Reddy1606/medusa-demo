import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sdk } from "../../lib/sdk";
import {
  CategoryPresentation,
  mergeCategoryPresentationMetadata,
  parseCategoryPresentation,
} from "../../types/category-presentation";
import { toAdminApiError } from "./brands";

export const categoryPresentationQueryKeys = {
  detail: (id: string) => ["product-category-presentation", id] as const,
};

const retrieveCategory = (id: string) =>
  sdk.admin.productCategory.retrieve(id, {
    fields: "id,name,metadata",
  });

const listAllCategories = async () => {
  const limit = 100;
  let offset = 0;
  const categories = [];

  do {
    const response = await sdk.admin.productCategory.list({
      fields: "id,name,handle,rank,is_active,is_internal,metadata",
      limit,
      offset,
    });
    categories.push(...response.product_categories);
    offset += response.product_categories.length;

    if (offset >= response.count || response.product_categories.length === 0) {
      break;
    }
  } while (true);

  return categories;
};

const updateHomepageRank = async (id: string, homepageRank: number | null) => {
  const { product_category: current } = await retrieveCategory(id);
  const metadata = (current.metadata ?? {}) as Record<string, unknown>;

  return sdk.admin.productCategory.update(
    id,
    {
      metadata: mergeCategoryPresentationMetadata(metadata, {
        homepage_rank: homepageRank,
      }),
    },
    { fields: "id,name,metadata" },
  );
};

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
        const previous = parseCategoryPresentation(metadata);
        let nextPresentation = presentation;

        if (
          !previous.show_on_homepage &&
          presentation.show_on_homepage &&
          presentation.homepage_rank === null
        ) {
          const categories = await listAllCategories();
          const maximumRank = categories.reduce((maximum, category) => {
            if (
              category.id === id ||
              !category.is_active ||
              category.is_internal
            ) {
              return maximum;
            }

            const candidate = parseCategoryPresentation(
              category.metadata as Record<string, unknown> | null,
            );
            return candidate.show_on_homepage &&
              candidate.homepage_rank !== null
              ? Math.max(maximum, candidate.homepage_rank)
              : maximum;
          }, 0);
          nextPresentation = {
            ...presentation,
            homepage_rank: maximumRank + 1,
          };
        } else if (
          previous.show_on_homepage &&
          !presentation.show_on_homepage
        ) {
          nextPresentation = { ...presentation, homepage_rank: null };
        }

        const response = await sdk.admin.productCategory.update(
          id,
          {
            metadata: mergeCategoryPresentationMetadata(
              metadata,
              nextPresentation,
            ),
          },
          { fields: "id,name,metadata" },
        );

        if (previous.show_on_homepage && !presentation.show_on_homepage) {
          const remaining = (await listAllCategories())
            .filter((category) => {
              const value = parseCategoryPresentation(
                category.metadata as Record<string, unknown> | null,
              );
              return (
                category.id !== id &&
                category.is_active &&
                !category.is_internal &&
                value.show_on_homepage
              );
            })
            .sort((left, right) => {
              const leftValue = parseCategoryPresentation(
                left.metadata as Record<string, unknown> | null,
              );
              const rightValue = parseCategoryPresentation(
                right.metadata as Record<string, unknown> | null,
              );
              const leftRank = leftValue.homepage_rank;
              const rightRank = rightValue.homepage_rank;
              if (leftRank !== null || rightRank !== null) {
                if (leftRank === null) return 1;
                if (rightRank === null) return -1;
                if (leftRank !== rightRank) return leftRank - rightRank;
              }
              return (
                (left.rank ?? Number.MAX_SAFE_INTEGER) -
                  (right.rank ?? Number.MAX_SAFE_INTEGER) ||
                left.name.localeCompare(right.name) ||
                left.handle.localeCompare(right.handle) ||
                left.id.localeCompare(right.id)
              );
            });

          await Promise.all(
            remaining.map((category, index) => {
              const rank = index + 1;
              const currentRank = parseCategoryPresentation(
                category.metadata as Record<string, unknown> | null,
              ).homepage_rank;
              return currentRank === rank
                ? Promise.resolve()
                : updateHomepageRank(category.id, rank);
            }),
          );
        }

        return response;
      } catch (error) {
        throw toAdminApiError(error);
      }
    },
    onSuccess: async (response) => {
      queryClient.setQueryData(
        categoryPresentationQueryKeys.detail(id),
        response,
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: categoryPresentationQueryKeys.detail(id),
      });
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
