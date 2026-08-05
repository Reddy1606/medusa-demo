import type {
  GuestOrderFulfillmentState,
  GuestOrderPaymentState,
} from "@lib/types/guest-order-tracking"
import { Badge } from "@modules/common/components/ui"

type StatusBadgeProps =
  | { type: "payment"; state: GuestOrderPaymentState | string }
  | { type: "fulfillment"; state: GuestOrderFulfillmentState | string }

const paymentLabels: Record<GuestOrderPaymentState, string> = {
  awaiting_transfer: "Chờ chuyển khoản",
  awaiting_store_confirmation: "Chờ cửa hàng xác nhận",
  paid: "Đã thanh toán",
  partially_paid: "Thanh toán một phần",
  refunded: "Đã hoàn tiền",
  partially_refunded: "Hoàn tiền một phần",
  canceled: "Đã hủy",
}

const fulfillmentLabels: Record<GuestOrderFulfillmentState, string> = {
  processing: "Đang xử lý",
  preparing_shipment: "Đang chuẩn bị hàng",
  shipped: "Đang giao hàng",
  delivered: "Đã giao hàng",
  canceled: "Đã hủy",
}

function formatFallback(state: string) {
  return state
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export default function StatusBadge({ type, state }: StatusBadgeProps) {
  const labels = type === "payment" ? paymentLabels : fulfillmentLabels
  const label =
    (labels as Record<string, string>)[state] ?? formatFallback(state)
  const color =
    state === "paid" || state === "delivered"
      ? "green"
      : state === "canceled" || state === "refunded"
      ? "red"
      : "orange"

  return <Badge color={color}>{label || "Chưa xác định"}</Badge>
}
