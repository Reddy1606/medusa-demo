import { retrieveBrandByHandle } from "@lib/data/brands"
import { getRegion } from "@lib/data/regions"
import BrandDetailTemplate from "@modules/brands/templates/brand-detail-template"
import { Metadata } from "next"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const brand = await retrieveBrandByHandle(handle)
  if (!brand) return { title: "Thương hiệu | TIXIMAX" }
  return {
    title: `${brand.name} | TIXIMAX`,
    description:
      brand.description || `Khám phá sản phẩm của ${brand.name} tại TIXIMAX.`,
  }
}

export default async function BrandDetailPage({ params, searchParams }: Props) {
  const { countryCode, handle } = await params
  const { page } = await searchParams
  const [brand, region] = await Promise.all([
    retrieveBrandByHandle(handle),
    getRegion(countryCode),
  ])
  if (!brand || !region) notFound()

  return (
    <BrandDetailTemplate
      brand={brand}
      region={region}
      page={Math.max(1, Number(page) || 1)}
    />
  )
}
