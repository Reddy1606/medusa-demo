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
    <main className="tixi-page px-6 py-12 small:py-16">
      <div className="mx-auto max-w-[1280px]" data-testid="category-container">
        <div className="mb-10 max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a87200]">
            Cửa hàng TIXIMAX
          </span>
          <h1
            className="mt-3 text-4xl font-semibold tracking-[-0.03em] small:text-5xl"
            data-testid="store-page-title"
          >
            Tất cả sản phẩm
          </h1>
          <p className="mt-4 leading-7 text-black/55">
            Khám phá sản phẩm quốc tế với giá theo khu vực được hiển thị rõ
            ràng.
          </p>
        </div>
        <div className="flex flex-col gap-8 small:flex-row small:items-start">
          <RefinementList sortBy={sort} />
          <div className="min-w-0 w-full">
            <Suspense fallback={<SkeletonProductGrid />}>
              <PaginatedProducts
                sortBy={sort}
                page={pageNumber}
                countryCode={countryCode}
                optionValueIds={optionValueIds}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  )
}

export default StoreTemplate
