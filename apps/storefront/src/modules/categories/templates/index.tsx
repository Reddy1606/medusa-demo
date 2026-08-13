import { notFound } from "next/navigation"
import { Suspense } from "react"

import InteractiveLink from "@modules/common/components/interactive-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { OptionValueIds } from "@lib/util/product-option-filters"
import { listBrands } from "@lib/data/brands"

export default async function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
  optionValueIds,
  brand,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
  optionValueIds?: OptionValueIds
  brand?: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  const { brands } = await listBrands({ limit: 100 })

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)

  return (
    <div
      className="content-container py-8 small:py-12"
      data-testid="category-container"
    >
      <div className="mb-8 small:mb-10">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-2xl-semi">
          {parents.map((parent) => (
            <span key={parent.id} className="text-ui-fg-subtle">
              <LocalizedClientLink
                className="mr-4 hover:text-black"
                href={`/categories/${parent.handle}`}
                data-testid="sort-by-link"
              >
                {parent.name}
              </LocalizedClientLink>
              /
            </span>
          ))}
          <h1 data-testid="category-page-title">{category.name}</h1>
        </div>
        {category.description && (
          <p className="mt-4 max-w-2xl text-base-regular">
            {category.description}
          </p>
        )}
        {!!category.category_children?.length && (
          <ul className="mt-5 grid grid-cols-1 gap-2 text-base-large">
            {category.category_children.map((child) => (
              <li key={child.id}>
                <InteractiveLink href={`/categories/${child.handle}`}>
                  {child.name}
                </InteractiveLink>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col gap-8 small:flex-row small:items-start medium:gap-12">
        <RefinementList
          sortBy={sort}
          data-testid="sort-by-container"
          hideOptionsPicker
          brands={brands}
          selectedBrand={brand}
        />
        <div className="min-w-0 flex-1">
          <Suspense
            fallback={
              <SkeletonProductGrid
                numberOfProducts={category.products?.length ?? 8}
              />
            }
          >
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              categoryId={category.id}
              countryCode={countryCode}
              optionValueIds={optionValueIds}
              brand={brand}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
