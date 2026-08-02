import type { OrderDTO } from "@medusajs/framework/types";

import { createTrackingId } from "./utils";

export type PaymentState =
  | "awaiting_transfer"
  | "awaiting_store_confirmation"
  | "paid"
  | "partially_paid"
  | "refunded"
  | "partially_refunded"
  | "canceled";

export type FulfillmentState =
  "processing" | "preparing_shipment" | "shipped" | "delivered" | "canceled";

export type InternalOrder = OrderDTO & {
  payment_status?: string;
  fulfillment_status?: string;
  payment_collections?: Array<{
    payments?: Array<{ provider_id?: string }>;
  }>;
  fulfillments?: Array<{
    labels?: Array<{
      tracking_number?: string | null;
      tracking_url?: string | null;
    }>;
  }>;
};

export type GuestOrderTrackingDTO = {
  tracking_id: string;
  display_id: number;
  created_at: string;
  total: number;
  currency_code: string;
  payment_state: PaymentState;
  fulfillment_state: FulfillmentState;
  can_continue_payment: boolean;
};

export type GuestOrderDetailDTO = GuestOrderTrackingDTO & {
  items: Array<{
    title: string;
    variant_title: string | null;
    thumbnail: string | null;
    quantity: number;
    unit_price: number;
    total: number;
  }>;
  tracking: Array<{
    number: string | null;
    url: string | null;
  }>;
};

function isManualPayment(order: InternalOrder) {
  return order.payment_collections?.some((collection) =>
    collection.payments?.some((payment) =>
      payment.provider_id?.startsWith("pp_system_default"),
    ),
  );
}

function getPaymentState(order: InternalOrder): PaymentState {
  if (order.status === "canceled" || order.payment_status === "canceled") {
    return "canceled";
  }

  switch (order.payment_status) {
    case "captured":
      return "paid";
    case "partially_captured":
      return "partially_paid";
    case "refunded":
      return "refunded";
    case "partially_refunded":
      return "partially_refunded";
    case "authorized":
    case "partially_authorized":
      return isManualPayment(order)
        ? "awaiting_store_confirmation"
        : "awaiting_transfer";
    default:
      return "awaiting_transfer";
  }
}

function getFulfillmentState(order: InternalOrder): FulfillmentState {
  if (order.status === "canceled" || order.fulfillment_status === "canceled") {
    return "canceled";
  }

  switch (order.fulfillment_status) {
    case "delivered":
    case "partially_delivered":
      return "delivered";
    case "shipped":
    case "partially_shipped":
      return "shipped";
    case "fulfilled":
    case "partially_fulfilled":
      return "preparing_shipment";
    default:
      return "processing";
  }
}

function sanitizeTrackingUrl(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

export function toTrackingDTO(order: InternalOrder): GuestOrderTrackingDTO {
  const paymentState = getPaymentState(order);
  const manualPayment = isManualPayment(order) === true;

  return {
    tracking_id: createTrackingId(order.id),
    display_id: order.display_id,
    created_at: new Date(order.created_at).toISOString(),
    total: Number(order.total),
    currency_code: order.currency_code,
    payment_state: paymentState,
    fulfillment_state: getFulfillmentState(order),
    can_continue_payment:
      manualPayment &&
      order.currency_code.toLowerCase() === "vnd" &&
      (paymentState === "awaiting_transfer" ||
        paymentState === "awaiting_store_confirmation"),
  };
}

export function toDetailDTO(
  order: InternalOrder,
  trackingId: string,
): GuestOrderDetailDTO {
  return {
    ...toTrackingDTO(order),
    tracking_id: trackingId,
    items: (order.items ?? []).map((item) => ({
      title: item.title,
      variant_title: item.variant_title ?? null,
      thumbnail: item.thumbnail ?? null,
      quantity: Number(item.quantity),
      unit_price: Number(item.unit_price),
      total: Number(item.total),
    })),
    tracking: (order.fulfillments ?? []).flatMap((fulfillment) =>
      (fulfillment.labels ?? []).map((label) => ({
        number: label.tracking_number ?? null,
        url: sanitizeTrackingUrl(label.tracking_url),
      })),
    ),
  };
}
