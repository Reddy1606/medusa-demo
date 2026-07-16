import { Suspense } from "react"

import { OptionValueIds } from "@lib/util/product-option-filters"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
  optionValueIds,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  optionValueIds?: OptionValueIds
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div
      className="content-container max-w-[1600px] py-7 small:px-8 small:py-9"
      data-testid="category-container"
    >
      <div className="mb-7 border-b border-ui-border-base pb-6 small:mb-8">
        <h1
          className="text-3xl font-semibold tracking-tight"
          data-testid="store-page-title"
        >
          All Products
        </h1>
        <p className="mt-2 max-w-2xl text-base-regular text-ui-fg-subtle">
          Browse our latest selection and find something that fits your needs.
        </p>
      </div>

      <div className="grid gap-6 small:grid-cols-[220px_minmax(0,1fr)] small:gap-7 medium:grid-cols-[230px_minmax(0,1fr)] medium:gap-8">
        <RefinementList sortBy={sort} layout="filters" />
        <div className="min-w-0 w-full">
          <div className="mb-5 flex items-center justify-between border-b border-ui-border-base pb-4">
            <h2 className="text-base-semi">Product selection</h2>
            <RefinementList sortBy={sort} layout="sort" />
          </div>
          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              countryCode={countryCode}
              optionValueIds={optionValueIds}
              listingLayout
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default StoreTemplate
