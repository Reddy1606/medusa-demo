"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useMemo, useState } from "react"
import { ChevronDownMini } from "@medusajs/icons"
import clsx from "clsx"

import {
  OPTION_VALUE_QUERY_KEY,
  parseOptionValueIds,
} from "@lib/util/product-option-filters"
import OptionsPicker from "./options-picker"
import SortProducts, { SortOptions } from "./sort-products"

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  hideOptionsPicker?: boolean
  "data-testid"?: string
  layout?: "default" | "filters" | "sort"
}

const RefinementList = ({
  sortBy,
  hideOptionsPicker = false,
  "data-testid": dataTestId,
  layout = "default",
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)

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
    [pathname, router, searchParams]
  )

  const setQueryParams = (name: string, value: string) =>
    updateQueryParams((params) => params.set(name, value))

  const selectedOptionValueIds = useMemo(
    () => parseOptionValueIds(searchParams),
    [searchParams]
  )

  const setOptionValueIds = (valueIds: string[]) =>
    updateQueryParams((params) => {
      params.delete(OPTION_VALUE_QUERY_KEY)
      valueIds.forEach((valueId) =>
        params.append(OPTION_VALUE_QUERY_KEY, valueId)
      )
    })

  if (layout === "sort") {
    return (
      <SortProducts
        sortBy={sortBy}
        setQueryParams={setQueryParams}
        data-testid={dataTestId}
        compact
      />
    )
  }

  if (layout === "filters") {
    const hasSelections = selectedOptionValueIds.length > 0

    return (
      <aside className="self-start overflow-hidden rounded-large border border-ui-border-base bg-ui-bg-base shadow-elevation-card-rest small:sticky small:top-24">
        <button
          type="button"
          className="flex w-full items-center justify-between bg-ui-bg-subtle px-4 py-4 text-left small:pointer-events-none"
          onClick={() => setFiltersOpen((open) => !open)}
          aria-expanded={filtersOpen}
          aria-controls="store-filters"
        >
          <span className="text-base-semi">
            Filters
            {hasSelections && (
              <span className="ml-2 text-small-regular text-ui-fg-muted">
                ({selectedOptionValueIds.length})
              </span>
            )}
          </span>
          <ChevronDownMini
            className={clsx("transition-transform small:hidden", {
              "rotate-180": filtersOpen,
            })}
          />
        </button>
        <div
          id="store-filters"
          className={clsx(
            "border-t border-ui-border-base px-4 pb-4 pt-3 small:block",
            {
              hidden: !filtersOpen,
              block: filtersOpen,
            }
          )}
        >
          {hasSelections && (
            <button
              type="button"
              onClick={() => setOptionValueIds([])}
              className="mb-3 w-full rounded-rounded border border-ui-border-base px-3 py-2 text-small-regular text-ui-fg-interactive transition-colors hover:bg-ui-bg-subtle hover:text-ui-fg-base"
            >
              Clear filters
            </button>
          )}
          <OptionsPicker
            selectedValueIds={selectedOptionValueIds}
            setOptionValueIds={setOptionValueIds}
          />
        </div>
      </aside>
    )
  }

  return (
    <div className="flex flex-col gap-12 py-4 mb-8 small:px-0 pl-6 small:min-w-[250px] small:ml-[1.675rem]">
      <SortProducts
        sortBy={sortBy}
        setQueryParams={setQueryParams}
        data-testid={dataTestId}
      />
      {!hideOptionsPicker && (
        <OptionsPicker
          selectedValueIds={selectedOptionValueIds}
          setOptionValueIds={setOptionValueIds}
        />
      )}
    </div>
  )
}

export default RefinementList
