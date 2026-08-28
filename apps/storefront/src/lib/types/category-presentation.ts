export const CATEGORY_PRESENTATION_KEY = "category_presentation"
export const MAX_HOMEPAGE_RANK = 10_000

export type CategoryPresentation = {
  show_on_homepage: boolean
  homepage_rank: number | null
  homepage_title: string | null
  homepage_description: string | null
  banner_url: string | null
  banner_file_id: string | null
}

const nullableString = (value: unknown, maxLength: number) =>
  typeof value === "string" && value.length <= maxLength ? value : null

const validAssetLocation = (value: unknown) => {
  if (typeof value !== "string" || value.length > 2048) {
    return null
  }

  if (value.startsWith("/")) {
    return value.startsWith("//") ? null : value
  }

  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:" ? value : null
  } catch {
    return null
  }
}

export const parseCategoryPresentation = (
  metadata: Record<string, unknown> | null | undefined
): CategoryPresentation | null => {
  const candidate = metadata?.[CATEGORY_PRESENTATION_KEY]

  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    return null
  }

  const value = candidate as Record<string, unknown>
  const rank = value.homepage_rank

  return {
    show_on_homepage:
      typeof value.show_on_homepage === "boolean"
        ? value.show_on_homepage
        : false,
    homepage_rank:
      typeof rank === "number" &&
      Number.isInteger(rank) &&
      rank >= 0 &&
      rank <= MAX_HOMEPAGE_RANK
        ? rank
        : null,
    homepage_title: nullableString(value.homepage_title, 255),
    homepage_description: nullableString(value.homepage_description, 5000),
    banner_url: validAssetLocation(value.banner_url),
    banner_file_id: nullableString(value.banner_file_id, 255),
  }
}
