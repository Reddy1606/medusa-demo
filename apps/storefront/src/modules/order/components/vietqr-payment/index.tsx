import { isManual } from "@lib/constants"
import { HttpTypes } from "@medusajs/types"

import VietQRPaymentPanel from "./panel"

type VietQRPaymentProps = {
  order: HttpTypes.StoreOrder
}

const VietQRPayment = ({ order }: VietQRPaymentProps) => {
  const payment = order.payment_collections?.[0]?.payments?.[0]

  if (
    !isManual(payment?.provider_id) ||
    order.currency_code.toLowerCase() !== "vnd"
  ) {
    return null
  }

  return (
    <VietQRPaymentPanel
      displayId={order.display_id ?? 0}
      amount={order.total}
      currencyCode={order.currency_code}
    />
  )
}

export default VietQRPayment
