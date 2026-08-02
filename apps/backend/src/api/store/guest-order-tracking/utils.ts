import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";

const VIETNAM_COUNTRY_CODE = "84";
const TRACKING_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

export function normalizeEmail(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? null;
}

export function normalizeVietnamesePhone(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const compact = value.trim().replace(/[\s.()-]/g, "");

  if (!/^\+?\d+$/.test(compact)) {
    return null;
  }

  let nationalNumber: string;

  if (compact.startsWith(`+${VIETNAM_COUNTRY_CODE}`)) {
    nationalNumber = compact.slice(3);
  } else if (compact.startsWith(VIETNAM_COUNTRY_CODE)) {
    nationalNumber = compact.slice(2);
  } else if (compact.startsWith("0")) {
    nationalNumber = compact.slice(1);
  } else {
    return null;
  }

  if (!/^[1-9]\d{8,9}$/.test(nationalNumber)) {
    return null;
  }

  return `+${VIETNAM_COUNTRY_CODE}${nationalNumber}`;
}

function getTrackingSecret() {
  const secret =
    process.env.GUEST_ORDER_TRACKING_SECRET ??
    process.env.JWT_SECRET ??
    process.env.COOKIE_SECRET;

  if (!secret) {
    throw new Error("A guest order tracking secret must be configured");
  }

  return createHash("sha256").update(secret).digest();
}

export function createTrackingId(orderId: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getTrackingSecret(), iv);
  const payload = JSON.stringify({
    order_id: orderId,
    expires_at: Date.now() + TRACKING_TOKEN_TTL_MS,
  });
  const encrypted = Buffer.concat([
    cipher.update(payload, "utf8"),
    cipher.final(),
  ]);
  const authenticationTag = cipher.getAuthTag();

  return [iv, authenticationTag, encrypted]
    .map((part) => part.toString("base64url"))
    .join(".");
}

export function verifyTrackingId(trackingId: string) {
  const parts = trackingId.split(".");

  if (parts.length !== 3 || parts.some((part) => !part)) {
    return null;
  }

  try {
    const [iv, authenticationTag, encrypted] = parts.map((part) =>
      Buffer.from(part, "base64url"),
    );

    if (iv.length !== 12 || authenticationTag.length !== 16) {
      return null;
    }

    const decipher = createDecipheriv("aes-256-gcm", getTrackingSecret(), iv);
    decipher.setAuthTag(authenticationTag);
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]).toString("utf8");
    const payload = JSON.parse(decrypted) as {
      order_id?: unknown;
      expires_at?: unknown;
    };

    if (
      typeof payload.order_id !== "string" ||
      !/^order_[A-Za-z0-9_-]+$/.test(payload.order_id) ||
      typeof payload.expires_at !== "number" ||
      !Number.isFinite(payload.expires_at) ||
      payload.expires_at <= Date.now()
    ) {
      return null;
    }

    return payload.order_id;
  } catch {
    return null;
  }
}
