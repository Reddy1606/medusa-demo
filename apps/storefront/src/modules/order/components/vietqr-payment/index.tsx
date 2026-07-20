import { isManual } from "@lib/constants"
import { getVietQRConfig } from "@lib/config/vietqr"
import { createVietQRUrl } from "@lib/util/create-vietqr-url"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@modules/common/components/ui"

type VietQRPaymentProps = {
  order: HttpTypes.StoreOrder
}

const VietQRUnavailable = () => {
  return (
    <section className="rounded-lg border border-ui-border-base p-6">
      <Heading level="h2" className="text-2xl-regular">
        Chuyển khoản VietQR
      </Heading>
      <Text className="mt-2 text-ui-fg-subtle">
        Thông tin chuyển khoản hiện chưa khả dụng. Vui lòng liên hệ cửa hàng để
        được hỗ trợ.
      </Text>
    </section>
  )
}

const VietQRPayment = ({ order }: VietQRPaymentProps) => {
  const payment = order.payment_collections?.[0]?.payments?.[0]

  if (
    !isManual(payment?.provider_id) ||
    order.currency_code.toLowerCase() !== "vnd"
  ) {
    return null
  }

  const config = getVietQRConfig()
  const displayId = String(order.display_id ?? "").trim()
  const hasValidDisplayId =
    typeof order.display_id === "number" &&
    Number.isInteger(order.display_id) &&
    order.display_id > 0
  const normalizedAmount = Math.round(order.total)

  if (
    !config ||
    !hasValidDisplayId ||
    !displayId ||
    !Number.isFinite(order.total) ||
    normalizedAmount <= 0
  ) {
    return <VietQRUnavailable />
  }

  const transferReference = `DH${displayId}`
  let qrUrl: string

  try {
    qrUrl = createVietQRUrl({
      bankId: config.bankId,
      accountNumber: config.accountNumber,
      accountName: config.accountName,
      amount: order.total,
      transferContent: transferReference,
      template: config.template,
    })
  } catch {
    return <VietQRUnavailable />
  }

  const formattedAmount = convertToLocale({
    amount: order.total,
    currency_code: order.currency_code,
    locale: "vi-VN",
  })

  return (
    <section className="rounded-lg border border-ui-border-base p-6">
      <Heading level="h2" className="text-2xl-regular">
        Chuyển khoản VietQR
      </Heading>
      <Text className="mt-2 font-semibold text-ui-fg-interactive">
        Đang chờ chuyển khoản
      </Text>
      <Text className="mt-2 text-ui-fg-subtle">
        Quét mã QR hoặc sử dụng thông tin bên dưới để thanh toán đơn hàng.
      </Text>

      <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-start">
        {/* Load the generated third-party QR directly without changing global image configuration. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrUrl}
          alt={`Mã VietQR thanh toán đơn hàng ${displayId}`}
          className="h-auto w-full max-w-xs rounded-lg border border-ui-border-base"
        />

        <dl className="grid flex-1 grid-cols-[max-content_1fr] gap-x-4 gap-y-3 text-base">
          <dt className="text-ui-fg-subtle">Ngân hàng</dt>
          <dd className="font-medium text-ui-fg-base">{config.bankId}</dd>

          <dt className="text-ui-fg-subtle">Số tài khoản</dt>
          <dd className="font-medium text-ui-fg-base">
            {config.accountNumber}
          </dd>

          <dt className="text-ui-fg-subtle">Chủ tài khoản</dt>
          <dd className="font-medium text-ui-fg-base">{config.accountName}</dd>

          <dt className="text-ui-fg-subtle">Số tiền</dt>
          <dd className="font-medium text-ui-fg-base">{formattedAmount}</dd>

          <dt className="text-ui-fg-subtle">Nội dung</dt>
          <dd className="font-medium text-ui-fg-base">{transferReference}</dd>
        </dl>
      </div>

      <Text className="mt-6 text-ui-fg-subtle">
        Thanh toán chỉ được xác nhận sau khi cửa hàng nhận được tiền.
      </Text>
    </section>
  )
}

export default VietQRPayment
