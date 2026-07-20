type CreateVietQRUrlParams = {
  bankId: string
  accountNumber: string
  accountName: string
  amount: number
  transferContent: string
  template?: string
}

export const createVietQRUrl = ({
  bankId,
  accountNumber,
  accountName,
  amount,
  transferContent,
  template = "compact2",
}: CreateVietQRUrlParams): string => {
  if (!bankId.trim()) {
    throw new Error("bankId must not be empty")
  }

  if (!accountNumber.trim()) {
    throw new Error("accountNumber must not be empty")
  }

  if (!accountName.trim()) {
    throw new Error("accountName must not be empty")
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("amount must be finite and greater than 0")
  }

  if (!transferContent.trim()) {
    throw new Error("transferContent must not be empty")
  }

  const normalizedAmount = Math.round(amount)

  if (normalizedAmount <= 0) {
    throw new Error("amount must round to an integer greater than 0")
  }

  const query = new URLSearchParams({
    amount: normalizedAmount.toString(),
    addInfo: transferContent,
    accountName,
  })

  return `https://img.vietqr.io/image/${encodeURIComponent(
    bankId,
  )}-${encodeURIComponent(accountNumber)}-${encodeURIComponent(
    template,
  )}.png?${query.toString()}`
}
