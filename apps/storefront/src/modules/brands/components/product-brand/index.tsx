import type { StoreBrand } from "@lib/types/brand"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import BrandImage from "../brand-image"

export default function ProductBrand({ brand }: { brand: StoreBrand }) {
  return (
    <LocalizedClientLink
      href={`/brands/${brand.handle}`}
      className="group/brand inline-flex w-fit items-center gap-3 rounded-md text-sm font-semibold text-black/60 transition hover:text-[#9a6800]"
      data-testid="product-brand"
    >
      <span className="h-9 w-9 shrink-0 overflow-hidden rounded-md border border-black/10 bg-white p-1">
        <BrandImage
          src={brand.logo_url}
          name={brand.name}
          alt={`Logo ${brand.name}`}
        />
      </span>
      <span>{brand.name}</span>
    </LocalizedClientLink>
  )
}
