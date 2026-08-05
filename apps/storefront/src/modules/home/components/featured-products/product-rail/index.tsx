import { listProducts } from "@lib/data/products"
import { ArrowRight } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts) {
    return null
  }

  return (
    <section className="px-6 py-16 small:py-24">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-col justify-between gap-5 xsmall:flex-row xsmall:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/55">
              Tuyển chọn cho bạn
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-black small:text-5xl">
              {collection.title}
            </h2>
          </div>
          <LocalizedClientLink
            href={`/collections/${collection.handle}`}
            className="inline-flex items-center gap-2 font-semibold text-black underline decoration-black/30 decoration-2 underline-offset-8 transition hover:decoration-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
          >
            Xem tất cả <ArrowRight className="h-4 w-4" />
          </LocalizedClientLink>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-4 small:mt-12 small:grid-cols-3 small:gap-6">
          {pricedProducts.map((product) => (
            <li
              key={product.id}
              className="rounded-3xl bg-white p-3 shadow-[0_8px_24px_rgba(71,48,0,0.10)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_20px_42px_rgba(71,48,0,0.18)] small:p-4"
            >
              <ProductPreview product={product} region={region} isFeatured />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
