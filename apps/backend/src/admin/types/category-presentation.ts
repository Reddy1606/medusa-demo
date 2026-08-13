export const CATEGORY_PRESENTATION_KEY = "category_presentation";
export const MAX_HOMEPAGE_RANK = 10_000;

export type CategoryPresentation = {
  show_on_homepage: boolean;
  homepage_rank: number | null;
  homepage_title: string | null;
  homepage_description: string | null;
  banner_url: string | null;
  banner_file_id: string | null;
};

export const DEFAULT_CATEGORY_PRESENTATION: CategoryPresentation = {
  show_on_homepage: false,
  homepage_rank: null,
  homepage_title: null,
  homepage_description: null,
  banner_url: null,
  banner_file_id: null,
};

const nullableString = (value: unknown, maxLength: number) =>
  typeof value === "string" && value.length <= maxLength ? value : null;

export const parseCategoryPresentation = (
  metadata: Record<string, unknown> | null | undefined,
): CategoryPresentation => {
  const candidate = metadata?.[CATEGORY_PRESENTATION_KEY];
  const value =
    candidate && typeof candidate === "object" && !Array.isArray(candidate)
      ? (candidate as Record<string, unknown>)
      : {};
  const rank = value.homepage_rank;

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
    banner_url: nullableString(value.banner_url, 2048),
    banner_file_id: nullableString(value.banner_file_id, 255),
  };
};

export const mergeCategoryPresentationMetadata = (
  metadata: Record<string, unknown> | null | undefined,
  update: Partial<CategoryPresentation>,
) => ({
  ...(metadata ?? {}),
  [CATEGORY_PRESENTATION_KEY]: {
    ...parseCategoryPresentation(metadata),
    ...update,
  },
});

export const isValidAssetLocation = (value: string) => {
  if (value.startsWith("/")) {
    return !value.startsWith("//");
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};
