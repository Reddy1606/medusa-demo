export type GuestOrderPaymentState =
  | "awaiting_transfer"
  | "awaiting_store_confirmation"
  | "paid"
  | "partially_paid"
  | "refunded"
  | "partially_refunded"
  | "canceled"

export type GuestOrderFulfillmentState =
  | "processing"
  | "preparing_shipment"
  | "shipped"
  | "delivered"
  | "canceled"

export type GuestOrderTrackingRequest = {
  email: string
  phone: string
}

export type GuestOrderTrackingOrder = {
  tracking_id: string
  display_id: number
  created_at: string
  total: number
  currency_code: string
  payment_state: GuestOrderPaymentState
  fulfillment_state: GuestOrderFulfillmentState
  can_continue_payment: boolean
}

export type GuestOrderTrackingResponse = {
  orders: GuestOrderTrackingOrder[]
}

export type GuestOrderTrackingItem = {
  title: string
  variant_title: string | null
  thumbnail: string | null
  quantity: number
  unit_price: number
  total: number
}

export type GuestOrderTrackingDetail = GuestOrderTrackingOrder & {
  items: GuestOrderTrackingItem[]
  tracking: Array<{
    number: string | null
    url: string | null
  }>
}

export type GuestOrderTrackingDetailResponse = {
  order: GuestOrderTrackingDetail
}

export type GuestOrderLookupResult =
  | { success: true; orders: GuestOrderTrackingOrder[] }
  | { success: false; error: string }

export type GuestOrderDetailResult =
  | { success: true; order: GuestOrderTrackingDetail }
  | { success: false; error: string }
