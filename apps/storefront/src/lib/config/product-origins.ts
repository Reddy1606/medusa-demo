export type ProductOrigin = {
  code: string
  label: string
  flag: string
}

export const PRODUCT_ORIGINS: ProductOrigin[] = [
  { code: "jp", label: "Nhật Bản", flag: "🇯🇵" },
  { code: "us", label: "Mỹ", flag: "🇺🇸" },
  { code: "kr", label: "Hàn Quốc", flag: "🇰🇷" },
  { code: "de", label: "Đức", flag: "🇩🇪" },
  { code: "fr", label: "Pháp", flag: "🇫🇷" },
]

export const normalizeProductOrigin = (value?: string) => {
  const normalized = value?.trim().toLowerCase()
  return PRODUCT_ORIGINS.some((origin) => origin.code === normalized)
    ? normalized
    : undefined
}
