import { getOrdersListWorkflow } from "@medusajs/core-flows";
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

import { type InternalOrder, toTrackingDTO } from "./order-mapper";
import type { GuestOrderTrackingRequest } from "./validators";
import { normalizeEmail, normalizeVietnamesePhone } from "./utils";

const RESULT_LIMIT = 10;
const QUERY_PAGE_SIZE = 50;

function hasMatchingPhone(order: InternalOrder, phone: string) {
  return [order.shipping_address?.phone, order.billing_address?.phone].some(
    (candidate) => normalizeVietnamesePhone(candidate) === phone,
  );
}

export async function POST(
  req: MedusaRequest<GuestOrderTrackingRequest>,
  res: MedusaResponse,
) {
  const { email, phone } = req.validatedBody;
  const matches: InternalOrder[] = [];
  let skip = 0;
  let hasMore = true;

  res.setHeader("Cache-Control", "no-store");

  while (matches.length < RESULT_LIMIT && hasMore) {
    const { result } = await getOrdersListWorkflow(req.scope).run({
      input: {
        fields: [
          "id",
          "display_id",
          "created_at",
          "status",
          "email",
          "total",
          "currency_code",
          "shipping_address.phone",
          "billing_address.phone",
          "payment_collections.payments.provider_id",
          "fulfillments.id",
        ],
        variables: {
          q: email,
          is_draft_order: false,
          skip,
          take: QUERY_PAGE_SIZE,
          order: { created_at: "DESC" },
        },
      },
    });

    const rows = (
      Array.isArray(result) ? result : result.rows
    ) as InternalOrder[];

    for (const order of rows) {
      if (
        normalizeEmail(order.email) === email &&
        hasMatchingPhone(order, phone)
      ) {
        matches.push(order);

        if (matches.length === RESULT_LIMIT) {
          break;
        }
      }
    }

    skip += rows.length;
    hasMore = rows.length === QUERY_PAGE_SIZE;
  }

  res.status(200).json({ orders: matches.map(toTrackingDTO) });
}
