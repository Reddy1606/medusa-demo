import type { HttpTypes } from "@medusajs/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sdk } from "../../lib/sdk";
import {
  mergeCategoryPresentationMetadata,
  parseCategoryPresentation,
} from "../../types/category-presentation";
import { toAdminApiError } from "./brands";

export type HomepageCategory = HttpTypes.AdminProductCategory & {
  handle: string;
  rank: number | null;
};

export const homepageCategoriesQueryKey = ["homepage-categories"] as const;

const compareCategories = (left: HomepageCategory, right: HomepageCategory) => {
  const leftRank = parseCategoryPresentation(
    left.metadata as Record<string, unknown> | null,
  ).homepage_rank;
  const rightRank = parseCategoryPresentation(
    right.metadata as Record<string, unknown> | null,
  ).homepage_rank;

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
};

const listHomepageCategories = async () => {
  const limit = 100;
  let offset = 0;
  const categories: HomepageCategory[] = [];

  do {
    const response = await sdk.admin.productCategory.list({
      fields: "id,name,handle,rank,is_active,is_internal,metadata",
      limit,
      offset,
    });
    categories.push(...(response.product_categories as HomepageCategory[]));
    offset += response.product_categories.length;
    if (offset >= response.count || response.product_categories.length === 0) {
      break;
    }
  } while (true);

  return categories
    .filter((category) => {
      const presentation = parseCategoryPresentation(
        category.metadata as Record<string, unknown> | null,
      );
      return (
        category.is_active &&
        !category.is_internal &&
        presentation.show_on_homepage
      );
    })
    .sort(compareCategories);
};

export const useHomepageCategories = () =>
  useQuery({
    queryKey: homepageCategoriesQueryKey,
    queryFn: async () => {
      try {
        return await listHomepageCategories();
      } catch (error) {
        throw toAdminApiError(error);
      }
    },
  });

export const useSaveHomepageCategoryOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryIds: string[]) => {
      const failures: Array<{ id: string; error: unknown }> = [];

      await Promise.all(
        categoryIds.map(async (id, index) => {
          try {
            const { product_category } =
              await sdk.admin.productCategory.retrieve(id, {
                fields: "id,metadata",
              });
            const metadata = (product_category.metadata ?? {}) as Record<
              string,
              unknown
            >;
            await sdk.admin.productCategory.update(id, {
              metadata: mergeCategoryPresentationMetadata(metadata, {
                homepage_rank: index + 1,
              }),
            });
          } catch (error) {
            failures.push({ id, error });
          }
        }),
      );

      if (failures.length > 0) {
        throw new Error(
          `${failures.length} of ${categoryIds.length} Categories could not be updated. The latest order has been reloaded; retry to finish saving.`,
        );
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: homepageCategoriesQueryKey,
      });
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
