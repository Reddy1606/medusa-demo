import { listBrands } from "@lib/data/brands"
import BrandImage from "@modules/brands/components/brand-image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function FeaturedBrands() {
  const { brands } = await listBrands({ limit: 8 })
  if (!brands.length) return null

  return (
    <section
      className="bg-[#fffdf7] px-6 py-16 small:py-20"
      aria-labelledby="featured-brands-heading"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-col gap-6 xsmall:flex-row xsmall:items-end xsmall:justify-between">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a87200]">
              Khám phá nhãn hàng
            </span>
            <h2
              id="featured-brands-heading"
              className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-black small:text-4xl"
            >
              Thương hiệu nổi bật
            </h2>
            <p className="mt-3 text-sm leading-6 text-black/55 small:text-base">
              Khám phá sản phẩm từ những thương hiệu được yêu thích trên toàn
              thế giới.
            </p>
          </div>
          <LocalizedClientLink
            href="/brands"
            className="group/all inline-flex w-fit items-center gap-2 rounded-sm font-semibold text-black underline decoration-[#e8b51e] decoration-2 underline-offset-8 transition hover:text-[#9a6800] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a87200]"
          >
            Xem tất cả thương hiệu
            <span
              aria-hidden="true"
              className="transition-transform group-hover/all:translate-x-1"
            >
              →
            </span>
          </LocalizedClientLink>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 xsmall:grid-cols-4 xsmall:gap-4 medium:grid-cols-8">
          {brands.map((brand) => (
            <LocalizedClientLink
              key={brand.id}
              href={`/brands/${brand.handle}`}
              aria-label={`Khám phá thương hiệu ${brand.name}`}
              className="group flex min-w-0 flex-col items-center gap-3 rounded-xl text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a87200]"
            >
              <div className="flex h-24 w-full items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-white p-4 transition duration-300 group-hover:-translate-y-1 group-hover:border-[#d7a921] group-hover:shadow-[0_10px_24px_rgba(17,17,17,0.08)] small:h-28">
                <BrandImage
                  src={brand.logo_url}
                  name={brand.name}
                  alt={`Logo ${brand.name}`}
                />
              </div>
              <span className="text-sm font-semibold text-black group-hover:text-[#9a6800]">
                {brand.name}
              </span>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}
