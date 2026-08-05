"use client"

import { useState } from "react"

import { lookupGuestOrders, retrieveGuestOrder } from "@lib/data/guest-orders"
import type {
  GuestOrderTrackingDetail,
  GuestOrderTrackingOrder,
} from "@lib/types/guest-order-tracking"
import { Button, Heading, Text } from "@modules/common/components/ui"

import OrderDetail from "../components/order-detail"
import OrderList from "../components/order-list"
import TrackingForm from "../components/tracking-form"

type ViewState =
  | "idle"
  | "loading"
  | "error"
  | "empty"
  | "results"
  | "detail-loading"
  | "detail-error"
  | "detail"

export default function OrderTrackingTemplate() {
  const [viewState, setViewState] = useState<ViewState>("idle")
  const [orders, setOrders] = useState<GuestOrderTrackingOrder[]>([])
  const [selectedOrder, setSelectedOrder] =
    useState<GuestOrderTrackingDetail | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleLookup = async (input: { email: string; phone: string }) => {
    setViewState("loading")
    setOrders([])
    setSelectedOrder(null)
    setError(null)

    const result = await lookupGuestOrders(input)

    if (!result.success) {
      setError(result.error)
      setViewState("error")
      return
    }

    setOrders(result.orders)
    setViewState(result.orders.length ? "results" : "empty")
  }

  const handleSelect = async (trackingId: string) => {
    setViewState("detail-loading")
    setError(null)

    const result = await retrieveGuestOrder(trackingId)

    if (!result.success) {
      setError(result.error)
      setViewState("detail-error")
      return
    }

    setSelectedOrder(result.order)
    setViewState("detail")
  }

  const handleBack = () => {
    setSelectedOrder(null)
    setError(null)
    setViewState("results")
  }

  const showingDetail = viewState.startsWith("detail")

  return (
    <main className="tixi-page tixi-tracking px-6 py-12 small:py-20">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
        <header className="rounded-[32px] bg-gradient-to-br from-[#fff7d6] to-[#f4bf28] px-6 py-12 text-center shadow-[0_12px_40px_rgba(98,67,0,0.10)] small:px-10">
          <Heading level="h1">Tra cứu đơn hàng</Heading>
          <Text className="mt-3 text-ui-fg-subtle">
            Nhập email và số điện thoại đã dùng khi đặt hàng.
          </Text>
        </header>

        {!showingDetail && (
          <div className="tixi-card p-6 small:p-8">
            <TrackingForm
              isLoading={viewState === "loading"}
              onSubmit={handleLookup}
            />
          </div>
        )}

        {viewState === "loading" && (
          <Text className="text-center text-ui-fg-subtle" aria-live="polite">
            Đang tra cứu đơn hàng...
          </Text>
        )}

        {viewState === "error" && error && (
          <Text
            className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
            role="alert"
          >
            {error}
          </Text>
        )}

        {viewState === "empty" && (
          <Text
            className="rounded-lg border border-ui-border-base bg-ui-bg-subtle p-6 text-center text-ui-fg-subtle"
            aria-live="polite"
          >
            Không tìm thấy đơn hàng phù hợp. Vui lòng kiểm tra lại email và số
            điện thoại.
          </Text>
        )}

        {viewState === "results" && (
          <OrderList orders={orders} onSelect={handleSelect} />
        )}

        {viewState === "detail-loading" && (
          <Text className="text-center text-ui-fg-subtle" aria-live="polite">
            Đang tải thông tin đơn hàng...
          </Text>
        )}

        {viewState === "detail-error" && (
          <div className="flex flex-col gap-4">
            <Button type="button" variant="secondary" onClick={handleBack}>
              Quay lại danh sách
            </Button>
            <Text
              className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
              role="alert"
            >
              {error}
            </Text>
          </div>
        )}

        {viewState === "detail" && selectedOrder && (
          <OrderDetail order={selectedOrder} onBack={handleBack} />
        )}
      </div>
    </main>
  )
}
