import { Text, clx } from "@modules/common/components/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  equalHeight = false,
  region: _region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  equalHeight?: boolean
  region: HttpTypes.StoreRegion
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
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div data-testid="product-wrapper">
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="full"
          isFeatured={isFeatured}
        />
        <div
          className={clx(
            "mt-4 flex flex-col gap-2 px-1 pb-1",
            equalHeight
              ? "min-h-[6.5rem]"
              : "xsmall:flex-row xsmall:justify-between",
          )}
        >
          <Text
            className={clx(
              "font-medium text-black transition group-hover:text-[#9a6800]",
              equalHeight && "min-h-[4.5rem] line-clamp-3",
            )}
            data-testid="product-title"
          >
            {product.title}
          </Text>
          <div
            className={clx(
              "flex shrink-0 items-center gap-x-2 font-semibold text-black",
              equalHeight && "min-h-6",
            )}
          >
            {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
