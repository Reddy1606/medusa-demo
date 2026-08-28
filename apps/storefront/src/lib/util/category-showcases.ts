import { CATEGORY_CHILD_LABELS } from "@lib/config/category-child-labels"
import { parseCategoryPresentation } from "@lib/types/category-presentation"
import { HttpTypes } from "@medusajs/types"

export type CategoryShowcasePresentation = {
  title: string
  description: string
  image: string | null
  childLabels: Record<string, string>
}

export type CategoryShowcaseCandidate = {
  category: HttpTypes.StoreProductCategory
  presentation: CategoryShowcasePresentation
  homepageRank: number | null
}

export const selectCategoryShowcases = (
  categories: HttpTypes.StoreProductCategory[]
): CategoryShowcaseCandidate[] => {
  return categories
    .flatMap((category): CategoryShowcaseCandidate[] => {
      const metadata = category.metadata as Record<string, unknown> | null
      const stored = parseCategoryPresentation(metadata)

      if (!stored?.show_on_homepage) return []

      return [
        {
          category,
          presentation: {
            title: stored.homepage_title || category.name,
            description:
              stored.homepage_description || category.description || "",
            image: stored.banner_url,
            childLabels: CATEGORY_CHILD_LABELS[category.handle] ?? {},
          },
          homepageRank: stored.homepage_rank,
        },
      ]
    })
    .sort((left, right) => {
      const leftRanked = left.homepageRank !== null
      const rightRanked = right.homepageRank !== null

      if (leftRanked !== rightRanked) return leftRanked ? -1 : 1
      if (leftRanked && rightRanked) {
        const rankDifference = left.homepageRank! - right.homepageRank!
        if (rankDifference) return rankDifference
      }

      const nativeRankDifference =
        (left.category.rank ?? Number.MAX_SAFE_INTEGER) -
        (right.category.rank ?? Number.MAX_SAFE_INTEGER)
      if (nativeRankDifference) return nativeRankDifference

      return (
        left.category.name.localeCompare(right.category.name) ||
        left.category.handle.localeCompare(right.category.handle) ||
        left.category.id.localeCompare(right.category.id)
      )
    })
}
