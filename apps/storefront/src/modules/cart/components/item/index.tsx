"use client"

import { Table, Text, clx } from "@modules/common/components/ui"
import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import CartItemSelect from "@modules/cart/components/cart-item-select"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import { useState } from "react"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
}

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)

    await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setUpdating(false)
      })
  }

  const maxQtyFromInventory = 10
  const maxQuantity = item.variant?.manage_inventory
    ? maxQtyFromInventory
    : 10

  return (
    <Table.Row
      className="w-full border-b last:border-b-0"
      data-testid="product-row"
    >
      <Table.Cell className="w-24 !pl-0 py-5 pr-4">
        <LocalizedClientLink
          href={`/products/${item.product_handle}`}
          className={clx(
            "flex overflow-hidden rounded-lg border bg-gray-50",
            {
              "w-16": type === "preview",
              "h-24 w-24": type === "full",
            }
          )}
        >
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.variant?.product?.images}
            size="square"
          />
        </LocalizedClientLink>
      </Table.Cell>

      <Table.Cell className="text-left">
        <LocalizedClientLink href={`/products/${item.product_handle}`}>
          <Text
            className="txt-medium-plus font-medium text-ui-fg-base hover:underline"
            data-testid="product-title"
          >
            {item.product_title}
          </Text>
        </LocalizedClientLink>

        <div className="mt-1 text-sm text-ui-fg-subtle">
          <LineItemOptions
            variant={item.variant}
            data-testid="product-variant"
          />
        </div>
      </Table.Cell>

      {type === "full" && (
        <Table.Cell>
          <div className="flex w-32 items-center gap-2">
            <CartItemSelect
              value={item.quantity}
              disabled={updating}
              onChange={(event) =>
                changeQuantity(Number(event.target.value))
              }
              className="h-10 w-16 rounded-md border px-2"
              data-testid="product-select-button"
          >
            {Array.from(
              {
                length: Math.min(maxQuantity, 10),
              },
              (_, index) => (
              <option value={index + 1} key={index + 1}>
                {index + 1}
              </option>
            )
          )}
        </CartItemSelect>

        {updating && <Spinner />}

        <DeleteButton
          id={item.id}
          data-testid="product-delete-button"
        />
      </div>

          <ErrorMessage
            error={error}
            data-testid="product-error-message"
          />
        </Table.Cell>
      )}

      {type === "full" && (
        <Table.Cell className="hidden small:table-cell">
          <LineItemUnitPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </Table.Cell>
      )}

      <Table.Cell className="!pr-0 text-right">
        <span
          className={clx({
            "flex h-full flex-col items-end justify-center":
              type === "preview",
          })}
        >
          {type === "preview" && (
            <span className="flex gap-x-1">
              <Text className="text-ui-fg-muted">
                {item.quantity} ×
              </Text>

              <LineItemUnitPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </span>
          )}

          <span className="font-semibold text-ui-fg-base">
            <LineItemPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
            />
          </span>
        </span>
      </Table.Cell>
    </Table.Row>
  )
}

export default Item