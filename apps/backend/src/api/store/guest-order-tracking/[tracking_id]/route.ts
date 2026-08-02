import { getOrderDetailWorkflow } from "@medusajs/core-flows";
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

import { type InternalOrder, toDetailDTO } from "../order-mapper";
import { verifyTrackingId } from "../utils";

const notFound = (res: MedusaResponse) =>
  res.status(404).json({ message: "Order not found" });

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  res.setHeader("Cache-Control", "no-store");

  const trackingId = req.params.tracking_id;
  const orderId = verifyTrackingId(trackingId);

  if (!orderId) {
    return notFound(res);
  }

  try {
    const { result } = await getOrderDetailWorkflow(req.scope).run({
      input: {
        order_id: orderId,
        fields: [
          "id",
          "display_id",
          "created_at",
          "status",
          "total",
          "currency_code",
          "items.title",
          "items.variant_title",
          "items.thumbnail",
          "items.quantity",
          "items.unit_price",
          "items.total",
          "payment_collections.payments.provider_id",
          "fulfillments.id",
          "fulfillments.labels.tracking_number",
          "fulfillments.labels.tracking_url",
        ],
        filters: { is_draft_order: false },
      },
    });

    if (!result) {
      return notFound(res);
    }

    return res.status(200).json({
      order: toDetailDTO(result as InternalOrder, trackingId),
    });
  } catch {
    return notFound(res);
  }
}
