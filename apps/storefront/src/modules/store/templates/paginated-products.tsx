import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { OptionValueIds } from "@lib/util/product-option-filters"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { listBrandProducts } from "@lib/data/brands"
import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { normalizeProductOrigin } from "@lib/config/product-origins"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
  optionValueIds,
  brand,
  origin,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
  optionValueIds?: OptionValueIds
  brand?: string
  origin?: string
}) {
  const queryParams: PaginatedProductsParams = {
    limit: 12,
  }

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  let products: HttpTypes.StoreProduct[]
  let count: number

  if (brand) {
    const response = await listBrandProducts({
      handle: brand,
      regionId: region.id,
      limit: 100,
      optionValueIds,
    })
    const matchingProducts = origin
      ? response.products.filter(
          (product) =>
            normalizeProductOrigin(product.origin_country) === origin,
        )
      : response.products
    const sorted = sortProducts(matchingProducts, sortBy || "created_at")
    count = matchingProducts.length
    products = sorted.slice((page - 1) * PRODUCT_LIMIT, page * PRODUCT_LIMIT)
  } else {
    const result = await listProductsWithSort({
      page,
      queryParams,
      sortBy,
      countryCode,
      optionValueIds,
      origin,
    })
    products = result.response.products
    count = result.response.count
  }

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  if (!products.length) {
    return (
      <div
        className="rounded-2xl border border-black/10 bg-white px-6 py-12 text-center"
        data-testid="products-empty-state"
      >
        <h2 className="text-lg font-semibold text-black">
          Chưa có sản phẩm phù hợp
        </h2>
        <p className="mt-2 text-sm text-black/55">
          Hãy quay lại sau hoặc thử thay đổi bộ lọc hiện tại.
        </p>
      </div>
    )
  }

  return (
    <>
      <ul
        className="grid w-full grid-cols-2 gap-4 medium:grid-cols-3 medium:gap-6"
        data-testid="products-list"
      >
        {products.map((p) => {
          return (
            <li
              key={p.id}
              className="tixi-card overflow-hidden p-3 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_42px_rgba(17,17,17,0.12)] small:p-4"
            >
              <ProductPreview product={p} region={region} />
            </li>
          )
        })}
      </ul>
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}
