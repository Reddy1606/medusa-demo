"use server"

import { sdk } from "@lib/config"
import type {
  GuestOrderDetailResult,
  GuestOrderLookupResult,
  GuestOrderTrackingDetailResponse,
  GuestOrderTrackingRequest,
  GuestOrderTrackingResponse,
} from "@lib/types/guest-order-tracking"

type ErrorWithStatus = {
  status?: number
}

export async function retrieveGuestOrder(
  trackingId: string
): Promise<GuestOrderDetailResult> {
  try {
    const response = await sdk.client.fetch<GuestOrderTrackingDetailResponse>(
      `/store/guest-order-tracking/${encodeURIComponent(trackingId)}`,
      {
        method: "GET",
        cache: "no-store",
      }
    )

    return { success: true, order: response.order }
  } catch {
    return {
      success: false,
      error: "Không thể tải thông tin đơn hàng. Vui lòng thử lại.",
    }
  }
}

export async function lookupGuestOrders(
  input: GuestOrderTrackingRequest
): Promise<GuestOrderLookupResult> {
  try {
    const response = await sdk.client.fetch<GuestOrderTrackingResponse>(
      "/store/guest-order-tracking",
      {
        method: "POST",
        body: input,
        cache: "no-store",
      }
    )

    return { success: true, orders: response.orders }
  } catch (error) {
    const status = (error as ErrorWithStatus).status

    if (status === 400) {
      return {
        success: false,
        error: "Email hoặc số điện thoại không hợp lệ.",
      }
    }

    return {
      success: false,
      error: "Không thể tra cứu đơn hàng lúc này. Vui lòng thử lại sau.",
    }
  }
}
