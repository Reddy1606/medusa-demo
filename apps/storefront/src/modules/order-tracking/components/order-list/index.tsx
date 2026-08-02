import { convertToLocale } from "@lib/util/money"
import type { GuestOrderTrackingOrder } from "@lib/types/guest-order-tracking"
import { Button, Container, Heading, Text } from "@modules/common/components/ui"

import StatusBadge from "../status-badge"

type OrderListProps = {
  orders: GuestOrderTrackingOrder[]
  onSelect: (trackingId: string) => void
}

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "long",
})

export default function OrderList({ orders, onSelect }: OrderListProps) {
  return (
    <section className="flex flex-col gap-4" aria-live="polite">
      <Heading level="h2">Đơn hàng của bạn</Heading>

      <div className="grid gap-4">
        {orders.map((order) => (
          <Container
            key={order.tracking_id}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(order.tracking_id)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                onSelect(order.tracking_id)
              }
            }}
            className="cursor-pointer border border-ui-border-base p-5 shadow-none transition-colors hover:bg-ui-bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ui-fg-interactive"
          >
            <div className="flex flex-col gap-4 small:flex-row small:items-start small:justify-between">
              <div>
                <Text className="txt-medium-plus font-semibold text-ui-fg-base">
                  Mã đơn #{order.display_id}
                </Text>
                <Text className="mt-1 text-sm text-ui-fg-subtle">
                  Ngày đặt: {dateFormatter.format(new Date(order.created_at))}
                </Text>
              </div>

              <div className="small:text-right">
                <Text className="text-sm text-ui-fg-subtle">Tổng tiền</Text>
                <Text className="font-semibold text-ui-fg-base">
                  {convertToLocale({
                    amount: order.total,
                    currency_code: order.currency_code,
                    locale: "vi-VN",
                  })}
                </Text>
              </div>
            </div>

            <dl className="mt-5 grid gap-4 border-t border-ui-border-base pt-5 small:grid-cols-2">
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
                  <StatusBadge
                    type="fulfillment"
                    state={order.fulfillment_state}
                  />
                </dd>
              </div>
            </dl>

            <div className="mt-5 flex justify-end border-t border-ui-border-base pt-5">
              <Button
                type="button"
                variant="secondary"
                onClick={(event) => {
                  event.stopPropagation()
                  onSelect(order.tracking_id)
                }}
              >
                Xem chi tiết
              </Button>
            </div>
          </Container>
        ))}
      </div>
    </section>
  )
}
