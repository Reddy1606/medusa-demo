"use client"

import type { StoreBrand } from "@lib/types/brand"
import FilterRadioGroup from "@modules/common/components/filter-radio-group"

export default function BrandPicker({
  brands,
  selectedBrand,
  setBrand,
}: {
  brands: StoreBrand[]
  selectedBrand?: string
  setBrand: (handle?: string) => void
}) {
  return (
    <FilterRadioGroup
      title="Thương hiệu"
      items={[
        { value: "", label: "Tất cả thương hiệu" },
        ...brands.map((brand) => ({ value: brand.handle, label: brand.name })),
      ]}
      value={selectedBrand || ""}
      handleChange={(value) => setBrand(value || undefined)}
    />
  )
}
