"use client"

import { PRODUCT_ORIGINS } from "@lib/config/product-origins"
import FilterRadioGroup from "@modules/common/components/filter-radio-group"

export default function OriginPicker({
  selectedOrigin,
  setOrigin,
}: {
  selectedOrigin?: string
  setOrigin: (origin?: string) => void
}) {
  return (
    <FilterRadioGroup
      title="Quốc gia"
      items={[
        { value: "", label: "Tất cả quốc gia" },
        ...PRODUCT_ORIGINS.map((origin) => ({
          value: origin.code,
          label: `${origin.flag} ${origin.label}`,
        })),
      ]}
      value={selectedOrigin || ""}
      handleChange={(value) => setOrigin(value || undefined)}
    />
  )
}
