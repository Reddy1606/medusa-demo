import { listBrandProducts } from "@lib/data/brands"
import type { StoreBrand } from "@lib/types/brand"
import type { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import BrandImage from "../components/brand-image"

const PRODUCT_LIMIT = 12

export default async function BrandDetailTemplate({
  brand,
  region,
  page,
}: {
  brand: StoreBrand
  region: HttpTypes.StoreRegion
  page: number
}) {
  const { products, count } = await listBrandProducts({
    handle: brand.handle,
    regionId: region.id,
    page,
    limit: PRODUCT_LIMIT,
  })
  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  return (
    <main className="bg-[#fbf6e9] pb-20">
      <div className="relative h-56 overflow-hidden small:h-80">
        <BrandImage
          src={brand.banner_url}
          name={brand.name}
          alt={`Ảnh bìa ${brand.name}`}
          kind="banner"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
      </div>
      <div className="mx-auto max-w-[1280px] px-6">
        <section className="relative -mt-16 rounded-3xl bg-white p-6 shadow-[0_16px_50px_rgba(17,17,17,0.12)] small:flex small:items-center small:gap-8 small:p-10">
          <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-black/10 bg-white p-3 shadow-sm">
            <BrandImage
              src={brand.logo_url}
              name={brand.name}
              alt={`Logo ${brand.name}`}
            />
          </div>
          <div className="mt-6 small:mt-0">
            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-black small:text-5xl">
              {brand.name}
            </h1>
            {brand.description && (
              <p className="mt-4 max-w-3xl leading-7 text-black/60">
                {brand.description}
              </p>
            )}
          </div>
        </section>

        <section className="pt-16 small:pt-24">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-black small:text-4xl">
            Sản phẩm của {brand.name}
          </h2>
          {products.length ? (
            <>
              <ul className="mt-10 grid grid-cols-2 gap-4 medium:grid-cols-3 medium:gap-6">
                {products.map((product) => (
                  <li
                    key={product.id}
                    className="tixi-card overflow-hidden p-3 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_42px_rgba(17,17,17,0.12)] small:p-4"
                  >
                    <ProductPreview product={product} region={region} />
                  </li>
                ))}
              </ul>
              {totalPages > 1 && (
                <Pagination page={page} totalPages={totalPages} />
              )}
            </>
          ) : (
            <div className="mt-10 rounded-3xl border border-black/10 bg-white px-6 py-16 text-center">
              <h3 className="text-xl font-semibold text-black">
                Chưa có sản phẩm
              </h3>
              <p className="mt-2 text-sm text-black/55">
                Sản phẩm của thương hiệu này sẽ sớm được cập nhật.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
