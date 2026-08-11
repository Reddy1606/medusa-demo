import { PRODUCT_ORIGINS } from "@lib/config/product-origins"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function CountryDiscovery() {
  return (
    <section
      className="bg-white px-6 py-16 small:py-20"
      aria-labelledby="country-discovery-heading"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a87200]">
            Khám phá toàn cầu
          </span>
          <h2
            id="country-discovery-heading"
            className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-black small:text-4xl"
          >
            Mua sắm theo quốc gia
          </h2>
          <p className="mt-3 text-sm leading-6 text-black/55 small:text-base">
            Tìm sản phẩm theo quốc gia xuất xứ với mức giá phù hợp khu vực của
            bạn.
          </p>
        </div>

        <div className="mt-9 grid grid-cols-2 gap-3 xsmall:grid-cols-3 small:grid-cols-5 small:gap-4">
          {PRODUCT_ORIGINS.map((origin) => (
            <LocalizedClientLink
              key={origin.code}
              href={`/store?origin=${origin.code}`}
              className="group flex min-w-0 items-center gap-3 rounded-xl border border-black/10 bg-[#fffdf7] px-4 py-4 text-black transition duration-300 hover:-translate-y-1 hover:border-[#d7a921] hover:shadow-[0_10px_24px_rgba(17,17,17,0.07)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a87200]"
              aria-label={`Mua sắm sản phẩm từ ${origin.label}`}
            >
              <span className="text-3xl leading-none" aria-hidden="true">
                {origin.flag}
              </span>
              <span className="min-w-0 text-sm font-semibold leading-5 group-hover:text-[#9a6800]">
                {origin.label}
              </span>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}
