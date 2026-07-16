import { Text } from "@modules/common/components/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region: _region,
  listingCard = false,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
  listingCard?: boolean
}) {
  // const pricedProduct = await listProducts({
  //   regionId: region.id,
  //   queryParams: { id: [product.id!] },
  // }).then(({ response }) => response.products[0])

  // if (!pricedProduct) {
  //   return null
  // }

  const { cheapestPrice } = getProductPrice({
    product,
  })

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className={listingCard ? "group block h-full" : "group"}
    >
      <div
        data-testid="product-wrapper"
        className={
          listingCard
            ? "flex h-full flex-col rounded-large border border-transparent p-1.5 transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-ui-border-base hover:shadow-elevation-card-hover"
            : undefined
        }
      >
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="full"
          isFeatured={isFeatured}
          className={
            listingCard
              ? "!aspect-[4/5] !rounded-rounded !shadow-none"
              : undefined
          }
        />
        <div
          className={
            listingCard
              ? "mt-3.5 flex flex-1 flex-col px-1 pb-1"
              : "flex txt-compact-medium mt-4 justify-between"
          }
        >
          <Text
            className={
              listingCard
                ? "line-clamp-2 min-h-[40px] text-small-regular text-ui-fg-base"
                : "text-ui-fg-subtle"
            }
            data-testid="product-title"
          >
            {product.title}
          </Text>
          <div
            className={
              listingCard
                ? "mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-base-semi"
                : "flex items-center gap-x-2"
            }
          >
            {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
