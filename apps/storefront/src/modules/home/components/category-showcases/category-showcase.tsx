import { listProducts } from "@lib/data/products"
import type { CategoryShowcaseConfig } from "@lib/config/category-showcases"
import { ArrowRight } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"

const PRODUCT_LIMIT = 8
const CHILD_CATEGORY_LIMIT = 6

export async function loadCategoryShowcase(
  category: HttpTypes.StoreProductCategory,
  config: CategoryShowcaseConfig,
  region: HttpTypes.StoreRegion,
) {
  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      category_id: [category.id],
      limit: PRODUCT_LIMIT,
      fields:
        "*variants.calculated_price,+variants.inventory_quantity,*variants.images,*variants.options",
    },
  })

  if (!products.length) return null

  return { category, config, products, region }
}

export default function CategoryShowcase({
  category,
  config,
  products,
  region,
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
          {config.title || category.name}
        </h2>
        <p className="mt-3 text-sm leading-6 text-black/55 small:text-base">
          {category.description || config.description}
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
                    {config.childLabels[child.handle] || child.name}
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

      <div className="mt-8 grid min-w-0 gap-5 large:grid-cols-[minmax(240px,0.72fr)_minmax(0,2.28fr)]">
        <LocalizedClientLink
          href={`/categories/${category.handle}`}
          className={`group relative flex aspect-[16/7] min-h-44 overflow-hidden rounded-2xl border border-[#d7a921]/35 bg-[#f5c745] p-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black small:aspect-[3/1] small:p-8 large:aspect-auto large:min-h-[560px] ${
            config.image ? "text-white" : "text-black"
          }`}
          aria-label={`Khám phá danh mục ${category.name}`}
        >
          {config.image && (
            <>
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.03]"
                style={{ backgroundImage: `url(${config.image})` }}
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
              config.image ? "border-white/10" : "border-black/5"
            }`}
          />
          <span className="relative mt-auto max-w-[16rem] text-2xl font-semibold leading-tight tracking-[-0.03em] small:text-3xl">
            {category.name}
          </span>
        </LocalizedClientLink>

        <ul className="grid min-w-0 grid-cols-2 gap-4 small:grid-cols-3 small:gap-5 large:grid-cols-4">
          {products.map((product) => (
            <li
              key={product.id}
              className="tixi-card min-w-0 overflow-hidden p-3 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_42px_rgba(17,17,17,0.12)] small:p-4"
            >
              <ProductPreview product={product} region={region} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
