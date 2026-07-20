import "server-only"

const supportedTemplates = ["compact", "compact2", "qr_only"] as const

type VietQRTemplate = (typeof supportedTemplates)[number]

export type VietQRConfig = {
  bankId: string
  accountNumber: string
  accountName: string
  template: VietQRTemplate
}

export const getVietQRConfig = (): VietQRConfig | null => {
  const bankId = process.env.VIETQR_BANK_ID?.trim().toUpperCase()
  const accountNumber = process.env.VIETQR_ACCOUNT_NO?.trim()
  const accountName = process.env.VIETQR_ACCOUNT_NAME?.trim()
  const template = (
    process.env.VIETQR_TEMPLATE === undefined
      ? "compact2"
      : process.env.VIETQR_TEMPLATE.trim().toLowerCase()
  ) as VietQRTemplate

  if (
    !bankId ||
    !/^[A-Z0-9]+$/.test(bankId) ||
    !accountNumber ||
    !/^\d+$/.test(accountNumber) ||
    !accountName ||
    !supportedTemplates.includes(template)
  ) {
    return null
  }

  return {
    bankId,
    accountNumber,
    accountName,
    template,
  }
}
