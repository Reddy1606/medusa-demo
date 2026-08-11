"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useMemo } from "react"

import {
  OPTION_VALUE_QUERY_KEY,
  parseOptionValueIds,
} from "@lib/util/product-option-filters"
import OptionsPicker from "./options-picker"
import SortProducts, { SortOptions } from "./sort-products"
import type { StoreBrand } from "@lib/types/brand"
import BrandPicker from "./brand-picker"
import OriginPicker from "./origin-picker"

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  hideOptionsPicker?: boolean
  "data-testid"?: string
  brands?: StoreBrand[]
  selectedBrand?: string
  selectedOrigin?: string
}

const RefinementList = ({
  sortBy,
  hideOptionsPicker = false,
  "data-testid": dataTestId,
  brands = [],
  selectedBrand,
  selectedOrigin,
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateQueryParams = useCallback(
    (updater: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString())
      updater(params)

      params.delete("page")

      const queryString = params.toString()
      const currentQuery = searchParams.toString()
      const nextPath = queryString ? `${pathname}?${queryString}` : pathname
      const currentPath = currentQuery
        ? `${pathname}?${currentQuery}`
        : pathname

      if (nextPath !== currentPath) {
        router.push(nextPath)
      }
    },
    [pathname, router, searchParams],
  )

  const setQueryParams = (name: string, value: string) =>
    updateQueryParams((params) => params.set(name, value))

  const selectedOptionValueIds = useMemo(
    () => parseOptionValueIds(searchParams),
    [searchParams],
  )

  const setOptionValueIds = (valueIds: string[]) =>
    updateQueryParams((params) => {
      params.delete(OPTION_VALUE_QUERY_KEY)
      valueIds.forEach((valueId) =>
        params.append(OPTION_VALUE_QUERY_KEY, valueId),
      )
    })

  const setBrand = (handle?: string) =>
    updateQueryParams((params) => {
      if (handle) params.set("brand", handle)
      else params.delete("brand")
    })

  const setOrigin = (origin?: string) =>
    updateQueryParams((params) => {
      if (origin) params.set("origin", origin)
      else params.delete("origin")
    })

  return (
    <aside className="tixi-card flex w-full flex-col gap-8 p-5 small:sticky small:top-28 small:w-[240px] small:min-w-[240px]">
      <SortProducts
        sortBy={sortBy}
        setQueryParams={setQueryParams}
        data-testid={dataTestId}
      />
      <OriginPicker selectedOrigin={selectedOrigin} setOrigin={setOrigin} />
      {!!brands.length && (
        <BrandPicker
          brands={brands}
          selectedBrand={selectedBrand}
          setBrand={setBrand}
        />
      )}
      {!hideOptionsPicker && (
        <OptionsPicker
          selectedValueIds={selectedOptionValueIds}
          setOptionValueIds={setOptionValueIds}
        />
      )}
    </aside>
  )
}

export default RefinementList
