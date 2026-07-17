"use client"

import { Button, Heading } from "@modules/common/components/ui"

import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart.shipping_address?.address_1 || !cart.email) {
    return "address"
  }

  if (!cart.shipping_methods?.length) {
    return "delivery"
  }

  return "payment"
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart)

  return (
    <div className="flex flex-col gap-y-5">
      <div>
        <Heading level="h2" className="text-2xl font-semibold leading-tight">
          Order Summary
        </Heading>

        <p className="mt-1 text-sm text-ui-fg-subtle">
          Check the information before making the payment
        </p>
      </div>

      <div className="rounded-lg bg-gray-50 p-4">
        <DiscountCode cart={cart} />
      </div>

      <Divider />

      <CartTotals totals={cart} />

      <Divider />

      <LocalizedClientLink
        href={`/checkout?step=${step}`}
        data-testid="checkout-button"
        className="block"
      >
        <Button className="h-12 w-full text-base font-semibold">
          Proceed with payment
        </Button>
      </LocalizedClientLink>

      <p className="text-center text-xs text-ui-fg-subtle">
        You will be redirected to enter your address and payment details when you proceed to checkout.
      </p>
    </div>
  )
}

export default Summary