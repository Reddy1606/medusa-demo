import { convertToLocale } from "@lib/util/money"
import type { GuestOrderTrackingDetail } from "@lib/types/guest-order-tracking"
import { Button, Heading, Text } from "@modules/common/components/ui"
import VietQRPaymentPanel from "@modules/order/components/vietqr-payment/panel"
import Thumbnail from "@modules/products/components/thumbnail"

import StatusBadge from "../status-badge"

type OrderDetailProps = {
  order: GuestOrderTrackingDetail
  onBack: () => void
}

const dateFormatter = new Intl.DateTimeFormat("vi-VN", { dateStyle: "long" })

export default function OrderDetail({ order, onBack }: OrderDetailProps) {
  return (
    <section className="flex flex-col gap-8">
      <div>
        <Button
          type="button"
          variant="secondary"
          onClick={onBack}
          className="rounded-full border-black/15 bg-white px-5 hover:border-black"
        >
          Quay lại danh sách
        </Button>
      </div>

      <div className="tixi-card p-6 small:p-8">
        <div className="flex flex-col gap-4 small:flex-row small:justify-between">
          <div>
            <Heading level="h2">Mã đơn #{order.display_id}</Heading>
            <Text className="mt-2 text-ui-fg-subtle">
              Ngày đặt: {dateFormatter.format(new Date(order.created_at))}
            </Text>
          </div>
          <div className="small:text-right">
            <Text className="text-sm text-ui-fg-subtle">Tổng tiền</Text>
            <Text className="font-semibold">
              {convertToLocale({
                amount: order.total,
                currency_code: order.currency_code,
                locale: "vi-VN",
              })}
            </Text>
          </div>
        </div>

        <dl className="mt-6 grid gap-4 border-t border-ui-border-base pt-6 small:grid-cols-2">
          <div>
            <dt className="mb-2 text-sm text-ui-fg-subtle">
              Trạng thái thanh toán
            </dt>
            <dd>
              <StatusBadge type="payment" state={order.payment_state} />
            </dd>
          </div>
          <div>
            <dt className="mb-2 text-sm text-ui-fg-subtle">
              Trạng thái giao hàng
            </dt>
            <dd>
              <StatusBadge type="fulfillment" state={order.fulfillment_state} />
            </dd>
          </div>
        </dl>
      </div>

      <section>
        <Heading level="h2">Danh sách sản phẩm</Heading>
        <div className="tixi-card mt-4 divide-y divide-ui-border-base overflow-hidden">
          {order.items.map((item, index) => (
            <div
              key={`${item.title}-${item.variant_title ?? "default"}-${index}`}
              className="flex items-center gap-4 p-4"
            >
              <div className="w-20 shrink-0">
                <Thumbnail thumbnail={item.thumbnail} size="square" />
              </div>
              <div className="min-w-0 flex-1">
                <Text className="font-semibold text-ui-fg-base">
                  {item.title}
                </Text>
                {item.variant_title && (
                  <Text className="text-sm text-ui-fg-subtle">
                    {item.variant_title}
                  </Text>
                )}
                <Text className="mt-1 text-sm text-ui-fg-subtle">
                  Số lượng: {item.quantity}
                </Text>
              </div>
              <Text className="shrink-0 font-medium">
                {convertToLocale({
                  amount: item.total,
                  currency_code: order.currency_code,
                  locale: "vi-VN",
                })}
              </Text>
            </div>
          ))}
        </div>
      </section>

      {order.tracking.length > 0 && (
        <section>
          <Heading level="h2">Thông tin vận chuyển</Heading>
          <div className="tixi-card mt-4 space-y-3 p-6">
            {order.tracking.map((tracking, index) => (
              <div key={`${tracking.number ?? "tracking"}-${index}`}>
                <Text>
                  Mã vận đơn: {tracking.number ?? "Chưa có thông tin"}
                </Text>
                {tracking.url && (
                  <a
                    href={tracking.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-ui-fg-interactive underline"
                  >
                    Theo dõi đơn hàng
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {order.can_continue_payment &&
        order.currency_code.toLowerCase() === "vnd" && (
          <VietQRPaymentPanel
            displayId={order.display_id}
            amount={order.total}
            currencyCode={order.currency_code}
          />
        )}
    </section>
  )
}
