import { HttpTypes } from "@medusajs/types"

export type StoreBrand = {
  id: string
  name: string
  handle: string
  description: string | null
  logo_url: string | null
  banner_url: string | null
}

export type StoreBrandListResponse = {
  brands: StoreBrand[]
  count: number
  limit: number
  offset: number
}

export type StoreBrandProductsResponse = {
  products: HttpTypes.StoreProduct[]
  count: number
  limit: number
  offset: number
}
