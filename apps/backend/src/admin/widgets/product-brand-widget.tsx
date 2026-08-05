import { defineWidgetConfig } from "@medusajs/admin-sdk";
import {
  Button,
  Container,
  Drawer,
  Heading,
  Input,
  StatusBadge,
  Text,
  toast,
  usePrompt,
} from "@medusajs/ui";
import { useEffect, useMemo, useState } from "react";
import { BrandLogo } from "../components/brands/brand-logo";
import { AdminApiError, useBrands } from "../hooks/api/brands";
import {
  useProductBrand,
  useSetProductBrand,
} from "../hooks/api/product-brand";
import type { AdminBrand } from "../types/brand";

const PAGE_SIZE = 20;

type ProductBrandWidgetProps = {
  data: { id: string };
};

const getAssignmentErrorMessage = (error: unknown) => {
  if (!(error instanceof AdminApiError)) {
    return "Something went wrong. Please try again.";
  }

  if (error.status === 400) {
    return "Invalid Brand assignment.";
  }

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
};

const BrandSelector = ({
  productId,
  currentBrandId,
  onClose,
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

const ProductBrandWidget = ({ data: product }: ProductBrandWidgetProps) => {
  const prompt = usePrompt();
  const [selectorOpen, setSelectorOpen] = useState(false);
  const { data, isLoading, isError, refetch } = useProductBrand(product.id);
  const setProductBrand = useSetProductBrand(product.id);
  const brand = data?.brand ?? null;

  const removeBrand = async () => {
    const confirmed = await prompt({
      title: "Remove Brand",
      description: "Remove this Brand from the Product?",
      confirmText: "Remove",
      cancelText: "Cancel",
      variant: "danger",
    });

    if (!confirmed) {
      return;
    }

    try {
      await setProductBrand.mutateAsync({ brand_id: null });
      toast.success("Brand removed from Product");
    } catch (error) {
      toast.error(getAssignmentErrorMessage(error));
    }
  };

  return (
    <>
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between gap-x-4 px-6 py-4">
          <Heading level="h2">Brand</Heading>
          {!isLoading && !isError && (
            <Button
              type="button"
              size="small"
              variant="secondary"
              onClick={() => setSelectorOpen(true)}
            >
              {brand ? "Change Brand" : "Assign Brand"}
            </Button>
          )}
        </div>

        <div className="px-6 py-4">
          {isLoading ? (
            <Text className="text-ui-fg-subtle">Loading Brand...</Text>
          ) : isError ? (
            <div className="flex items-center justify-between gap-x-3">
              <Text className="text-ui-fg-error">
                Brand could not be loaded.
              </Text>
              <Button
                size="small"
                variant="secondary"
                onClick={() => refetch()}
              >
                Retry
              </Button>
            </div>
          ) : !brand ? (
            <Text className="text-ui-fg-subtle">No Brand assigned</Text>
          ) : (
            <div className="flex items-center gap-x-3">
              <BrandLogo name={brand.name} url={brand.logo_url} />
              <div className="min-w-0 flex-1">
                <Text weight="plus" className="truncate">
                  {brand.name}
                </Text>
                <Text size="small" className="text-ui-fg-subtle truncate">
                  {brand.handle}
                </Text>
              </div>
              <StatusBadge color={brand.is_active ? "green" : "grey"}>
                {brand.is_active ? "Active" : "Inactive"}
              </StatusBadge>
              <Button
                type="button"
                size="small"
                variant="danger"
                onClick={removeBrand}
                isLoading={setProductBrand.isPending}
                disabled={setProductBrand.isPending}
              >
                Remove Brand
              </Button>
            </div>
          )}
        </div>
      </Container>

      {selectorOpen && (
        <BrandSelector
          productId={product.id}
          currentBrandId={brand?.id}
          onClose={() => setSelectorOpen(false)}
        />
      )}
    </>
  );
};

export const config = defineWidgetConfig({
  zone: "product.details.side.after",
});

export default ProductBrandWidget;
