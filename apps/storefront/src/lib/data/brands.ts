"use server"

import { sdk } from "@lib/config"
import type {
  StoreBrand,
  StoreBrandListResponse,
  StoreBrandProductsResponse,
} from "@lib/types/brand"
import { getAuthHeaders, getCacheOptions } from "./cookies"

const BRAND_LIST_REVALIDATE_SECONDS = 60
const BRAND_PRODUCTS_REVALIDATE_SECONDS = 60

const safeRequest = async <T>(request: () => Promise<T>, fallback?: T) => {
  try {
    return await request()
  } catch {
    if (fallback !== undefined) return fallback
    throw new Error("Không thể tải thông tin thương hiệu lúc này.")
  }
}

export const listBrands = async ({
  q,
  limit = 20,
  offset = 0,
}: {
  q?: string
  limit?: number
  offset?: number
} = {}) => {
  const next = await getCacheOptions("brands")
  return safeRequest(() =>
    sdk.client.fetch<StoreBrandListResponse>("/store/brands", {
      method: "GET",
      query: { q, limit, offset, order: "name" },
      next: { ...next, revalidate: BRAND_LIST_REVALIDATE_SECONDS },
      cache: "force-cache",
    }),
  )
}

export const retrieveBrandByHandle = async (
  handle: string,
): Promise<StoreBrand | null> => {
  const next = await getCacheOptions(`brand-${handle}`)
  const response = await safeRequest(
    () =>
      sdk.client.fetch<{ brand: StoreBrand }>(`/store/brands/${handle}`, {
        method: "GET",
        next,
        cache: "force-cache",
      }),
    { brand: null as StoreBrand | null },
  )
  return response.brand
}

export const retrieveProductBrand = async (
  productId: string,
): Promise<StoreBrand | null> => {
  const next = await getCacheOptions(`product-brand-${productId}`)
  const response = await safeRequest(
    () =>
      sdk.client.fetch<{ brand: StoreBrand | null }>(
        `/store/products/${productId}/brand`,
        {
          method: "GET",
          next: { ...next, revalidate: BRAND_PRODUCTS_REVALIDATE_SECONDS },
          cache: "force-cache",
        },
      ),
    { brand: null },
  )
  return response.brand
}

export const listBrandProducts = async ({
  handle,
  regionId,
  page = 1,
  limit = 12,
  optionValueIds,
}: {
  handle: string
  regionId: string
  page?: number
  limit?: number
  optionValueIds?: string[]
}) => {
  const offset = (Math.max(page, 1) - 1) * limit
  const headers = await getAuthHeaders()
  const next = await getCacheOptions(`brand-products-${handle}-${regionId}`)

  return safeRequest(() =>
    sdk.client.fetch<StoreBrandProductsResponse>(
      `/store/brands/${handle}/products`,
      {
        method: "GET",
        query: {
          region_id: regionId,
          limit,
          offset,
          order: "-created_at",
          fields:
            "*variants.calculated_price,+variants.inventory_quantity,*variants.images,*variants.options,+metadata,+tags,+origin_country",
          ...(optionValueIds?.length
            ? { option_value_id: optionValueIds }
            : {}),
        },
        headers,
        next: { ...next, revalidate: BRAND_PRODUCTS_REVALIDATE_SECONDS },
        cache: "force-cache",
      },
    ),
  )
}
