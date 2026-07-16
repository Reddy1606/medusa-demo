"use client"

import { clx } from "@modules/common/components/ui"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ChevronLeftMini, ChevronRightMini } from "@medusajs/icons"

export function Pagination({
  page,
  totalPages,
  "data-testid": dataTestid,
}: {
  page: number
  totalPages: number
  "data-testid"?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Helper function to generate an array of numbers within a range
  const arrayRange = (start: number, stop: number) =>
    Array.from({ length: stop - start + 1 }, (_, index) => start + index)

  // Function to handle page changes
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", newPage.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  // Function to render a page button
  const renderPageButton = (
    p: number,
    label: string | number,
    isCurrent: boolean
  ) => (
    <button
      key={p}
      className={clx(
        "flex h-10 min-w-10 items-center justify-center rounded-rounded border border-transparent px-3 text-small-regular text-ui-fg-subtle transition-colors hover:border-ui-border-base hover:bg-ui-bg-subtle",
        {
          "pointer-events-none border-ui-border-strong bg-ui-bg-subtle font-medium text-ui-fg-base":
            isCurrent,
        }
      )}
      disabled={isCurrent}
      onClick={() => handlePageChange(p)}
    >
      {label}
    </button>
  )

  // Function to render ellipsis
  const renderEllipsis = (key: string) => (
    <span
      key={key}
      className="flex h-10 min-w-8 cursor-default items-center justify-center text-ui-fg-muted"
    >
      ...
    </span>
  )

  // Function to render page buttons based on the current page and total pages
  const renderPageButtons = () => {
    const buttons = []

    if (totalPages <= 7) {
      // Show all pages
      buttons.push(
        ...arrayRange(1, totalPages).map((p) =>
          renderPageButton(p, p, p === page)
        )
      )
    } else {
      // Handle different cases for displaying pages and ellipses
      if (page <= 4) {
        // Show 1, 2, 3, 4, 5, ..., lastpage
        buttons.push(
          ...arrayRange(1, 5).map((p) => renderPageButton(p, p, p === page))
        )
        buttons.push(renderEllipsis("ellipsis1"))
        buttons.push(
          renderPageButton(totalPages, totalPages, totalPages === page)
        )
      } else if (page >= totalPages - 3) {
        // Show 1, ..., lastpage - 4, lastpage - 3, lastpage - 2, lastpage - 1, lastpage
        buttons.push(renderPageButton(1, 1, 1 === page))
        buttons.push(renderEllipsis("ellipsis2"))
        buttons.push(
          ...arrayRange(totalPages - 4, totalPages).map((p) =>
            renderPageButton(p, p, p === page)
          )
        )
      } else {
        // Show 1, ..., page - 1, page, page + 1, ..., lastpage
        buttons.push(renderPageButton(1, 1, 1 === page))
        buttons.push(renderEllipsis("ellipsis3"))
        buttons.push(
          ...arrayRange(page - 1, page + 1).map((p) =>
            renderPageButton(p, p, p === page)
          )
        )
        buttons.push(renderEllipsis("ellipsis4"))
        buttons.push(
          renderPageButton(totalPages, totalPages, totalPages === page)
        )
      }
    }

    return buttons
  }

  const navigationButton = (direction: "previous" | "next") => {
    const isPrevious = direction === "previous"
    const disabled = isPrevious ? page <= 1 : page >= totalPages
    const target = isPrevious ? page - 1 : page + 1

    return (
      <button
        type="button"
        onClick={() => handlePageChange(target)}
        disabled={disabled}
        aria-label={`${isPrevious ? "Previous" : "Next"} page`}
        className="flex h-10 items-center gap-1 rounded-rounded border border-ui-border-base px-3 text-small-regular text-ui-fg-base transition-colors hover:bg-ui-bg-subtle disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isPrevious ? <ChevronLeftMini /> : null}
        <span className="hidden xsmall:inline">
          {isPrevious ? "Previous" : "Next"}
        </span>
        {!isPrevious ? <ChevronRightMini /> : null}
      </button>
    )
  }

  return (
    <div className="flex justify-center w-full mt-12 border-t border-ui-border-base pt-8">
      <div className="flex items-center gap-1" data-testid={dataTestid}>
        {navigationButton("previous")}
        <div className="mx-1 flex items-center gap-1">
          {renderPageButtons()}
        </div>
        {navigationButton("next")}
      </div>
    </div>
  )
}
