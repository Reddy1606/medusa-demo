import { listBrands } from "@lib/data/brands"
import BrandImage from "@modules/brands/components/brand-image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function FeaturedBrands() {
  const { brands } = await listBrands({ limit: 8 })
  if (!brands.length) return null

  return (
    <section className="bg-white px-6 py-20 small:py-24">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex items-end justify-between gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a87200]">
              Khám phá nhãn hàng
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-black small:text-4xl">
              Thương hiệu nổi bật
            </h2>
          </div>
          <LocalizedClientLink
            href="/brands"
            className="hidden font-semibold text-black underline decoration-[#e8b51e] decoration-2 underline-offset-8 hover:text-[#9a6800] xsmall:block"
          >
            Xem tất cả thương hiệu
          </LocalizedClientLink>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 xsmall:grid-cols-4 medium:grid-cols-8">
          {brands.map((brand) => (
            <LocalizedClientLink
              key={brand.id}
              href={`/brands/${brand.handle}`}
              className="group flex flex-col items-center gap-3 text-center"
            >
              <div className="h-24 w-full overflow-hidden rounded-2xl border border-black/10 bg-[#fff8df] p-3 transition group-hover:border-[#d7a921] group-hover:shadow-md">
                <BrandImage src={brand.logo_url} alt={`Logo ${brand.name}`} />
              </div>
              <span className="text-sm font-semibold text-black group-hover:text-[#9a6800]">
                {brand.name}
              </span>
            </LocalizedClientLink>
          ))}
        </div>
        <LocalizedClientLink
          href="/brands"
          className="mt-8 inline-block font-semibold text-black underline decoration-[#e8b51e] decoration-2 underline-offset-8 xsmall:hidden"
        >
          Xem tất cả thương hiệu
        </LocalizedClientLink>
      </div>
    </section>
  )
}
