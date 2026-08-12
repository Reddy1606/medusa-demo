import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import {
  FinalCta,
  ProcessSection,
  ServicesSection,
} from "@modules/home/components/homepage-sections"
import { getRegion } from "@lib/data/regions"
import FeaturedBrands from "@modules/home/components/featured-brands"
import CountryDiscovery from "@modules/home/components/country-discovery"
import CategoryShowcases from "@modules/home/components/category-showcases"

export const metadata: Metadata = {
  title: "TIXIMAX | Mua sắm quốc tế dễ dàng hơn",
  description:
    "Mua sắm hàng quốc tế, thanh toán VietQR và theo dõi giao hàng về Việt Nam minh bạch cùng TIXIMAX.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero />
      <ServicesSection />
      <CountryDiscovery />
      <FeaturedBrands />
      <CategoryShowcases region={region} />
      <ul className="flex flex-col bg-[#f5c745]">
        <FeaturedProducts collections={collections} region={region} />
      </ul>
      <ProcessSection />
      <FinalCta />
    </>
  )
}
