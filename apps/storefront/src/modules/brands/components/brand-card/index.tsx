import type { StoreBrand } from "@lib/types/brand"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import BrandImage from "../brand-image"

export default function BrandCard({ brand }: { brand: StoreBrand }) {
  return (
    <LocalizedClientLink
      href={`/brands/${brand.handle}`}
      className="group flex h-full flex-col rounded-3xl border border-black/10 bg-white p-6 shadow-[0_8px_30px_rgba(17,17,17,0.05)] transition duration-300 hover:-translate-y-1.5 hover:border-[#d7a921]/60 hover:shadow-[0_18px_42px_rgba(17,17,17,0.11)]"
    >
      <div className="h-24 w-24 overflow-hidden rounded-2xl border border-black/5 bg-[#fff8df] p-3">
        <BrandImage
          src={brand.logo_url}
          name={brand.name}
          alt={`Logo ${brand.name}`}
        />
      </div>
      <h2 className="mt-6 text-xl font-semibold text-black transition group-hover:text-[#9a6800]">
        {brand.name}
      </h2>
      {brand.description && (
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-black/55">
          {brand.description}
        </p>
      )}
    </LocalizedClientLink>
  )
}
