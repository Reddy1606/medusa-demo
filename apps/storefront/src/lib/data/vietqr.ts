"use server"

import { getVietQRConfig } from "@lib/config/vietqr"
import { createVietQRUrl } from "@lib/util/create-vietqr-url"
import { convertToLocale } from "@lib/util/money"

type VietQRPresentation =
  | {
      available: true
      qrUrl: string
      bankId: string
      accountNumber: string
      accountName: string
      formattedAmount: string
      transferReference: string
    }
  | { available: false }

export async function getVietQRPresentation(input: {
  displayId: number
  amount: number
  currencyCode: string
}): Promise<VietQRPresentation> {
  const config = getVietQRConfig()
  const validDisplayId =
    Number.isInteger(input.displayId) && input.displayId > 0
  const normalizedAmount = Math.round(input.amount)

  if (
    !config ||
    !validDisplayId ||
    input.currencyCode.toLowerCase() !== "vnd" ||
    !Number.isFinite(input.amount) ||
    normalizedAmount <= 0
  ) {
    return { available: false }
  }

  const transferReference = `DH${input.displayId}`

  try {
    return {
      available: true,
      qrUrl: createVietQRUrl({
        bankId: config.bankId,
        accountNumber: config.accountNumber,
        accountName: config.accountName,
        amount: input.amount,
        transferContent: transferReference,
        template: config.template,
      }),
      bankId: config.bankId,
      accountNumber: config.accountNumber,
      accountName: config.accountName,
      formattedAmount: convertToLocale({
        amount: input.amount,
        currency_code: input.currencyCode,
        locale: "vi-VN",
      }),
      transferReference,
    }
  } catch {
    return { available: false }
  }
}
