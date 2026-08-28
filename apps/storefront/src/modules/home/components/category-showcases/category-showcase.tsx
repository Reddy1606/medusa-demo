import { listProducts } from "@lib/data/products"
import type { CategoryShowcasePresentation } from "@lib/util/category-showcases"
import { ArrowRight } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"
import { listCategoryBrands } from "@lib/data/brands"
import BrandImage from "@modules/brands/components/brand-image"

const PRODUCT_LIMIT = 8
const CHILD_CATEGORY_LIMIT = 6
const BRAND_LIMIT = 6

export const collectCategoryTreeIds = (
  category: HttpTypes.StoreProductCategory,
) => {
  const ids = new Set<string>()
  const pending = [category]

  while (pending.length) {
    const current = pending.pop()
    if (!current || ids.has(current.id)) continue

    ids.add(current.id)
    pending.push(...(current.category_children ?? []))
  }

  return Array.from(ids)
}

export async function loadCategoryShowcase(
  category: HttpTypes.StoreProductCategory,
  presentation: CategoryShowcasePresentation,
  region: HttpTypes.StoreRegion,
) {
  const categoryIds = collectCategoryTreeIds(category)
  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      category_id: categoryIds,
      limit: PRODUCT_LIMIT,
      fields:
        "*variants.calculated_price,+variants.inventory_quantity,*variants.images,*variants.options",
    },
  })
  const { brands } = await listCategoryBrands(categoryIds)
  const uniqueProducts = Array.from(
    new Map(products.map((product) => [product.id, product])).values(),
  ).slice(0, PRODUCT_LIMIT)
  const uniqueBrands = Array.from(
    new Map(brands.map((brand) => [brand.id, brand])).values(),
  ).slice(0, BRAND_LIMIT)

  if (!uniqueProducts.length) return null

  return {
    category,
    presentation,
    products: uniqueProducts,
    region,
    brands: uniqueBrands,
  }
}

export default function CategoryShowcase({
  category,
  presentation,
  products,
  region,
  brands,
}: NonNullable<Awaited<ReturnType<typeof loadCategoryShowcase>>>) {
  const children = (category.category_children || []).slice(
    0,
    CHILD_CATEGORY_LIMIT,
  )

  return (
    <section
      className="border-t border-black/10 py-14 first:border-t-0 small:py-16"
      aria-labelledby={`category-showcase-${category.id}`}
    >
      <div className="max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a87200]">
          Danh mục nổi bật
        </span>
        <h2
          id={`category-showcase-${category.id}`}
          className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-black small:text-4xl"
        >
          {presentation.title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-black/55 small:text-base">
          {presentation.description}
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-4 xsmall:flex-row xsmall:items-end xsmall:justify-between">
        {!!children.length && (
          <nav
            className="min-w-0"
            aria-label={`Danh mục con của ${category.name}`}
          >
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {children.map((child) => (
                <li key={child.id}>
                  <LocalizedClientLink
                    href={`/categories/${child.handle}`}
                    className="rounded-sm text-sm font-medium text-black/60 underline-offset-4 hover:text-[#9a6800] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a87200]"
                  >
                    {presentation.childLabels[child.handle] || child.name}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </nav>
        )}
        <LocalizedClientLink
          href={`/categories/${category.handle}`}
          className="inline-flex w-fit items-center gap-2 rounded-sm font-semibold text-black underline decoration-[#e8b51e] decoration-2 underline-offset-8 transition hover:text-[#9a6800] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a87200]"
        >
          Xem tất cả <ArrowRight className="h-4 w-4" />
        </LocalizedClientLink>
      </div>

      <div className="mt-8 grid min-w-0 grid-cols-[minmax(0,1fr)] items-start gap-5 large:grid-cols-[minmax(240px,0.72fr)_minmax(0,2.28fr)]">
        <div
          className={`group relative flex h-44 min-w-0 w-full overflow-hidden rounded-2xl border border-[#d7a921]/35 bg-[#f5c745] p-4 small:aspect-[3/1] small:h-auto small:p-6 large:aspect-auto large:h-[790px] large:p-8 ${
            presentation.image ? "text-white" : "text-black"
          }`}
          aria-label={`Khám phá danh mục ${category.name}`}
        >
          {presentation.image && (
            <>
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.03]"
                style={{ backgroundImage: `url(${presentation.image})` }}
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent"
              />
            </>
          )}
          <span
            aria-hidden="true"
            className={`absolute -bottom-14 -right-10 h-44 w-44 rounded-full border-[28px] transition-transform duration-500 group-hover:scale-110 ${
              presentation.image ? "border-white/10" : "border-black/5"
            }`}
          />
          <div className="relative mt-auto w-full">
            {!!brands.length && (
              <ul className="mb-4 grid max-w-[22rem] grid-cols-2 gap-2 small:mb-5 small:gap-2.5 large:max-w-none">
                {brands.map((brand) => (
                  <li key={brand.id} className="min-w-0">
                    <LocalizedClientLink
                      href={`/categories/${
                        category.handle
                      }?brand=${encodeURIComponent(brand.handle)}`}
                      aria-label={`Xem sản phẩm ${brand.name} trong danh mục ${category.name}`}
                      className="flex h-12 min-w-0 items-center justify-center overflow-hidden rounded-lg border border-black/10 bg-white/95 p-2 shadow-sm transition hover:border-[#d7a921] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8b51e] small:h-14 large:h-16"
                    >
                      <BrandImage
                        src={brand.logo_url}
                        name={brand.name}
                        alt={`${brand.name} logo`}
                      />
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            )}
            <LocalizedClientLink
              href={`/categories/${category.handle}`}
              className="inline-block max-w-[16rem] rounded-sm text-2xl font-semibold leading-tight tracking-[-0.03em] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e8b51e] small:text-3xl"
            >
              {category.name}
            </LocalizedClientLink>
          </div>
        </div>

        <ul className="grid min-w-0 grid-cols-2 content-start items-start gap-4 small:grid-cols-3 small:gap-5 large:grid-cols-4">
          {products.map((product) => (
            <li
              key={product.id}
              className="tixi-card min-w-0 overflow-hidden p-3 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_42px_rgba(17,17,17,0.12)] small:p-4 large:h-[385px]"
            >
              <ProductPreview product={product} region={region} equalHeight />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
