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

export const normalizeProductOrigin = (value?: string | null) => {
  const normalized = value?.trim().toLowerCase()
  if (!normalized) return undefined

  const englishRegionNames = new Intl.DisplayNames(["en"], { type: "region" })

  return PRODUCT_ORIGINS.find((origin) => {
    const englishName = englishRegionNames.of(origin.code.toUpperCase())
    return (
      origin.code === normalized ||
      origin.label.toLowerCase() === normalized ||
      englishName?.toLowerCase() === normalized
    )
  })?.code
}
