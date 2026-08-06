export type BrandMetadata = Record<string, unknown> | null;

export type AdminBrand = {
  id: string;
  name: string;
  handle: string;
  description: string | null;
  logo_url: string | null;
  logo_file_id: string | null;
  banner_url: string | null;
  banner_file_id: string | null;
  is_active: boolean;
  metadata: BrandMetadata;
  created_at: string;
  updated_at: string;
};

export type AdminBrandListResponse = {
  brands: AdminBrand[];
  count: number;
  limit: number;
  offset: number;
};

export type AdminBrandResponse = {
  brand: AdminBrand;
};

export type AdminCreateBrandRequest = {
  name: string;
  handle?: string;
  description?: string | null;
  logo_url?: string | null;
  logo_file_id?: string | null;
  banner_url?: string | null;
  banner_file_id?: string | null;
  is_active?: boolean;
  metadata?: BrandMetadata;
};

export type AdminUpdateBrandRequest = Partial<AdminCreateBrandRequest>;

export type AdminBrandListParams = {
  q?: string;
  is_active?: boolean;
  limit?: number;
  offset?: number;
  order?:
    | "created_at"
    | "-created_at"
    | "updated_at"
    | "-updated_at"
    | "name"
    | "-name"
    | "handle"
    | "-handle";
};

export type AdminDeleteBrandResponse = {
  id: string;
  object: "brand";
  deleted: boolean;
};

export type AdminProductBrandResponse = {
  brand: AdminBrand | null;
};

export type AdminSetProductBrandRequest = {
  brand_id: string | null;
};

export type AdminSetProductBrandResponse = AdminProductBrandResponse & {
  product_id: string;
};

export type AdminBrandProduct = {
  id: string;
  title: string;
  subtitle: string | null;
  handle: string;
  thumbnail: string | null;
  updated_at: string;
  brand: AdminBrand | null;
};

export type AdminBrandProductListParams = {
  q?: string;
  brand_id?: string;
  assignment?: "assigned" | "unassigned";
  limit?: number;
  offset?: number;
};

export type AdminBrandProductListResponse = {
  products: AdminBrandProduct[];
  count: number;
  limit: number;
  offset: number;
};
