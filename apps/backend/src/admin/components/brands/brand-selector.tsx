import { Button, Drawer, Input, StatusBadge, Text, toast } from "@medusajs/ui";
import { useEffect, useMemo, useState } from "react";
import { AdminApiError, useBrands } from "../../hooks/api/brands";
import { useSetProductBrand } from "../../hooks/api/product-brand";
import type { AdminBrand } from "../../types/brand";
import { BrandLogo } from "./brand-logo";

const PAGE_SIZE = 20;

export const getAssignmentErrorMessage = (error: unknown) => {
  if (!(error instanceof AdminApiError))
    return "Something went wrong. Please try again.";
  if (error.status === 400) return "Invalid Brand assignment.";
  if (error.status === 404) {
    return error.message.toLowerCase().includes("product")
      ? "Product not found."
      : "Brand not found.";
  }
  if (error.status === 409) {
    return error.message.toLowerCase().includes("inactive")
      ? "Inactive Brands cannot be assigned."
      : "Brand cannot be assigned.";
  }
  return "Something went wrong. Please try again.";
};

type BrandSelectorProps = {
  productId: string;
  currentBrandId?: string;
  onClose: () => void;
  onAssigned?: () => void;
};

export const BrandSelector = ({
  productId,
  currentBrandId,
  onClose,
  onAssigned,
}: BrandSelectorProps) => {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const setProductBrand = useSetProductBrand(productId);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPageIndex(0);
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  const params = useMemo(
    () => ({
      q: search || undefined,
      is_active: true,
      limit: PAGE_SIZE,
      offset: pageIndex * PAGE_SIZE,
      order: "name" as const,
    }),
    [pageIndex, search],
  );
  const { data, isLoading, isError } = useBrands(params);
  const brands = data?.brands ?? [];
  const count = data?.count ?? 0;
  const pageCount = Math.max(1, Math.ceil(count / PAGE_SIZE));

  const assignBrand = async (brand: AdminBrand) => {
    try {
      await setProductBrand.mutateAsync({ brand_id: brand.id });
      toast.success(
        currentBrandId ? "Product Brand changed" : "Brand assigned to Product",
      );
      onAssigned?.();
      onClose();
    } catch (error) {
      toast.error(getAssignmentErrorMessage(error));
    }
  };

  return (
    <Drawer open onOpenChange={(open) => !open && onClose()}>
      <Drawer.Content className="flex flex-col">
        <Drawer.Header>
          <Drawer.Title>
            {currentBrandId ? "Change Brand" : "Assign Brand"}
          </Drawer.Title>
          <Drawer.Description>
            Select an active Brand for this Product.
          </Drawer.Description>
        </Drawer.Header>
        <Drawer.Body className="flex flex-1 flex-col gap-y-4 overflow-hidden">
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by name or handle"
            aria-label="Search active Brands"
            disabled={setProductBrand.isPending}
          />
          <div className="flex-1 space-y-2 overflow-y-auto">
            {isLoading ? (
              <Text className="text-ui-fg-subtle py-8 text-center">
                Loading Brands...
              </Text>
            ) : isError ? (
              <Text className="text-ui-fg-error py-8 text-center">
                Brands could not be loaded.
              </Text>
            ) : brands.length === 0 ? (
              <Text className="text-ui-fg-subtle py-8 text-center">
                No active Brands found.
              </Text>
            ) : (
              brands.map((brand) => {
                const isCurrent = brand.id === currentBrandId;
                return (
                  <button
                    key={brand.id}
                    type="button"
                    className="bg-ui-bg-base hover:bg-ui-bg-base-hover border-ui-border-base flex w-full items-center gap-x-3 rounded-lg border p-3 text-left disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => assignBrand(brand)}
                    disabled={setProductBrand.isPending || isCurrent}
                  >
                    <BrandLogo name={brand.name} url={brand.logo_url} />
                    <div className="min-w-0 flex-1">
                      <Text weight="plus" className="truncate">
                        {brand.name}
                      </Text>
                      <Text size="small" className="text-ui-fg-subtle truncate">
                        {brand.handle}
                      </Text>
                    </div>
                    {isCurrent && (
                      <StatusBadge color="blue">Current</StatusBadge>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </Drawer.Body>
        <Drawer.Footer>
          <div className="flex w-full items-center justify-between gap-x-2">
            <div className="flex items-center gap-x-2">
              <Button
                type="button"
                size="small"
                variant="secondary"
                onClick={() => setPageIndex((page) => Math.max(0, page - 1))}
                disabled={pageIndex === 0 || setProductBrand.isPending}
              >
                Previous
              </Button>
              <Button
                type="button"
                size="small"
                variant="secondary"
                onClick={() =>
                  setPageIndex((page) => Math.min(pageCount - 1, page + 1))
                }
                disabled={
                  pageIndex + 1 >= pageCount || setProductBrand.isPending
                }
              >
                Next
              </Button>
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={setProductBrand.isPending}
            >
              Close
            </Button>
          </div>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  );
};
