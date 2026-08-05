import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { sdk } from "../../lib/sdk";
import type {
  AdminBrandListParams,
  AdminBrandListResponse,
  AdminBrandResponse,
  AdminCreateBrandRequest,
  AdminDeleteBrandResponse,
  AdminUpdateBrandRequest,
} from "../../types/brand";

export class AdminApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
  }
}

const getErrorMessage = (error: unknown) => {
  if (!error || typeof error !== "object") {
    return "Something went wrong. Please try again.";
  }

  const candidate = error as {
    message?: string;
    status?: number;
    statusCode?: number;
    response?: {
      status?: number;
      data?: { message?: string };
    };
  };
  const status =
    candidate.status ?? candidate.statusCode ?? candidate.response?.status;
  const message = candidate.response?.data?.message ?? candidate.message;

  if (status && status >= 500) {
    return "The server could not complete the request. Please try again.";
  }

  return message || "Something went wrong. Please try again.";
};

export const toAdminApiError = (error: unknown) => {
  if (error instanceof AdminApiError) {
    return error;
  }

  const candidate = error as {
    status?: number;
    statusCode?: number;
    response?: { status?: number };
  };
  const status =
    candidate?.status ?? candidate?.statusCode ?? candidate?.response?.status;

  return new AdminApiError(getErrorMessage(error), status);
};

export const brandQueryKeys = {
  all: ["brands"] as const,
  lists: () => [...brandQueryKeys.all, "list"] as const,
  list: (params: AdminBrandListParams) =>
    [...brandQueryKeys.lists(), params] as const,
  details: () => [...brandQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...brandQueryKeys.details(), id] as const,
};

const invalidateBrands = async (queryClient: QueryClient, id?: string) => {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: brandQueryKeys.lists() }),
    ...(id
      ? [
          queryClient.invalidateQueries({
            queryKey: brandQueryKeys.detail(id),
          }),
        ]
      : []),
  ]);
};

const buildListPath = (params: AdminBrandListParams) => {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      search.set(key, String(value));
    }
  });

  const query = search.toString();
  return `/admin/brands${query ? `?${query}` : ""}`;
};

export const useBrands = (params: AdminBrandListParams) =>
  useQuery({
    queryKey: brandQueryKeys.list(params),
    queryFn: async () => {
      try {
        return await sdk.client.fetch<AdminBrandListResponse>(
          buildListPath(params),
        );
      } catch (error) {
        throw toAdminApiError(error);
      }
    },
  });

export const useBrand = (
  id: string,
  options?: Omit<UseQueryOptions<AdminBrandResponse>, "queryKey" | "queryFn">,
) =>
  useQuery({
    queryKey: brandQueryKeys.detail(id),
    queryFn: async () => {
      try {
        return await sdk.client.fetch<AdminBrandResponse>(
          `/admin/brands/${id}`,
        );
      } catch (error) {
        throw toAdminApiError(error);
      }
    },
    enabled: Boolean(id),
    ...options,
  });

export const useCreateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AdminCreateBrandRequest) => {
      try {
        return await sdk.client.fetch<AdminBrandResponse>("/admin/brands", {
          method: "POST",
          body: payload,
        });
      } catch (error) {
        throw toAdminApiError(error);
      }
    },
    onSuccess: async () => invalidateBrands(queryClient),
  });
};

export const useUpdateBrand = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AdminUpdateBrandRequest) => {
      try {
        return await sdk.client.fetch<AdminBrandResponse>(
          `/admin/brands/${id}`,
          {
            method: "PATCH",
            body: payload,
          },
        );
      } catch (error) {
        throw toAdminApiError(error);
      }
    },
    onSuccess: async () => invalidateBrands(queryClient, id),
  });
};

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        return await sdk.client.fetch<AdminDeleteBrandResponse>(
          `/admin/brands/${id}`,
          { method: "DELETE" },
        );
      } catch (error) {
        throw toAdminApiError(error);
      }
    },
    onSuccess: async (_, id) => {
      queryClient.removeQueries({ queryKey: brandQueryKeys.detail(id) });
      await invalidateBrands(queryClient);
    },
  });
};
