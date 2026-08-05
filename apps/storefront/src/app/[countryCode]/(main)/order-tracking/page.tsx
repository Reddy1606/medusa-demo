import type { Metadata } from "next"

import OrderTrackingTemplate from "@modules/order-tracking/templates/order-tracking-template"

export const metadata: Metadata = {
  title: "Tra cứu đơn hàng",
  description: "Tra cứu trạng thái đơn hàng bằng email và số điện thoại.",
}

export default function OrderTrackingPage() {
  return <OrderTrackingTemplate />
}
