"use client"

import FilterRadioGroup from "@modules/common/components/filter-radio-group"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: string) => void
  "data-testid"?: string
  compact?: boolean
}

const sortOptions = [
  {
    value: "created_at",
    label: "Latest Arrivals",
  },
  {
    value: "price_asc",
    label: "Price: Low to High",
  },
  {
    value: "price_desc",
    label: "Price: High to Low",
  },
]

const SortProducts = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
  compact = false,
}: SortProductsProps) => {
  const handleChange = (value: string) => {
    setQueryParams("sortBy", value as SortOptions)
  }

  if (compact) {
    return (
      <label className="flex items-center gap-3 text-small-regular text-ui-fg-subtle">
        <span className="hidden xsmall:inline">Sort by</span>
        <select
          value={sortBy}
          onChange={(event) => handleChange(event.target.value)}
          className="h-10 rounded-rounded border border-ui-border-base bg-ui-bg-base px-3 pr-8 text-small-regular text-ui-fg-base outline-none transition-colors hover:border-ui-border-strong focus:border-ui-border-interactive"
          data-testid={dataTestId}
          aria-label="Sort products"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    )
  }

  return (
    <FilterRadioGroup
      title="Sort by"
      items={sortOptions}
      value={sortBy}
      handleChange={handleChange}
      data-testid={dataTestId}
    />
  )
}

export default SortProducts
