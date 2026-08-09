import { Metadata } from "next"
import BrandListTemplate from "@modules/brands/templates/brand-list-template"

export const metadata: Metadata = {
  title: "Thương hiệu | TIXIMAX",
  description: "Khám phá các thương hiệu và sản phẩm đang có mặt tại TIXIMAX.",
}

export default async function BrandsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const { q, page } = await searchParams
  return (
    <BrandListTemplate
      q={q?.trim() || undefined}
      page={Math.max(1, Number(page) || 1)}
    />
  )
}
