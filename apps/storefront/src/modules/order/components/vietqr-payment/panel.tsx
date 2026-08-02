"use client"

import { useEffect, useState } from "react"

import { getVietQRPresentation } from "@lib/data/vietqr"
import { Heading, Text } from "@modules/common/components/ui"

type VietQRPaymentPanelProps = {
  displayId: number
  amount: number
  currencyCode: string
}

type Presentation = Awaited<ReturnType<typeof getVietQRPresentation>>

const VietQRUnavailable = () => (
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

export default function VietQRPaymentPanel({
  displayId,
  amount,
  currencyCode,
}: VietQRPaymentPanelProps) {
  const [presentation, setPresentation] = useState<Presentation | null>(null)

  useEffect(() => {
    let active = true

    getVietQRPresentation({ displayId, amount, currencyCode })
      .then((result) => {
        if (active) {
          setPresentation(result)
        }
      })
      .catch(() => {
        if (active) {
          setPresentation({ available: false })
        }
      })

    return () => {
      active = false
    }
  }, [amount, currencyCode, displayId])

  if (!presentation) {
    return (
      <section className="rounded-lg border border-ui-border-base p-6">
        <Text className="text-ui-fg-subtle">Đang tải thông tin VietQR...</Text>
      </section>
    )
  }

  if (!presentation.available) {
    return <VietQRUnavailable />
  }

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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={presentation.qrUrl}
          alt={`Mã VietQR thanh toán đơn hàng ${displayId}`}
          className="h-auto w-full max-w-xs rounded-lg border border-ui-border-base"
        />

        <dl className="grid flex-1 grid-cols-[max-content_1fr] gap-x-4 gap-y-3 text-base">
          <dt className="text-ui-fg-subtle">Ngân hàng</dt>
          <dd className="font-medium text-ui-fg-base">{presentation.bankId}</dd>
          <dt className="text-ui-fg-subtle">Số tài khoản</dt>
          <dd className="font-medium text-ui-fg-base">
            {presentation.accountNumber}
          </dd>
          <dt className="text-ui-fg-subtle">Chủ tài khoản</dt>
          <dd className="font-medium text-ui-fg-base">
            {presentation.accountName}
          </dd>
          <dt className="text-ui-fg-subtle">Số tiền</dt>
          <dd className="font-medium text-ui-fg-base">
            {presentation.formattedAmount}
          </dd>
          <dt className="text-ui-fg-subtle">Nội dung</dt>
          <dd className="font-medium text-ui-fg-base">
            {presentation.transferReference}
          </dd>
        </dl>
      </div>

      <Text className="mt-6 text-ui-fg-subtle">
        Thanh toán chỉ được xác nhận sau khi cửa hàng nhận được tiền.
      </Text>
    </section>
  )
}
