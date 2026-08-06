import { defineRouteConfig } from "@medusajs/admin-sdk";
import {
  Button,
  Container,
  Heading,
  Input,
  Select,
  StatusBadge,
  Table,
  Text,
  toast,
  usePrompt,
} from "@medusajs/ui";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrandLogo } from "../../components/brands/brand-logo";
import {
  BrandSelector,
  getAssignmentErrorMessage,
} from "../../components/brands/brand-selector";
import { useBrandProducts } from "../../hooks/api/brand-products";
import { useBrands } from "../../hooks/api/brands";
import { useSetProductBrand } from "../../hooks/api/product-brand";
import type { AdminBrandProduct } from "../../types/brand";

const PAGE_SIZE = 20;

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const BrandProductsPage = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [brandId, setBrandId] = useState("all");
  const [assignment, setAssignment] = useState("all");
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] =
    useState<AdminBrandProduct | null>(null);

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
      brand_id: brandId === "all" ? undefined : brandId,
      assignment:
        assignment === "all"
          ? undefined
          : (assignment as "assigned" | "unassigned"),
      limit: PAGE_SIZE,
      offset: pageIndex * PAGE_SIZE,
    }),
    [assignment, brandId, pageIndex, search],
  );
  const query = useBrandProducts(params);
  const brandQuery = useBrands({ limit: 100, offset: 0, order: "name" });
  const products = query.data?.products ?? [];
  const count = query.data?.count ?? 0;
  const pageCount = Math.max(1, Math.ceil(count / PAGE_SIZE));

  return (
    <>
      <Container className="divide-y p-0">
        <div className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Heading level="h1">Brand Products</Heading>
            <Text size="small" className="text-ui-fg-subtle">
              Manage Product and Brand relationships.
            </Text>
          </div>
          <Button
            variant="secondary"
            onClick={() => query.refetch()}
            isLoading={query.isFetching}
          >
            Refresh
          </Button>
        </div>
        <div className="flex flex-col gap-3 px-6 py-4 sm:flex-row">
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search Product"
            aria-label="Search Products"
            className="sm:max-w-sm"
          />
          <Select
            value={brandId}
            onValueChange={(value) => {
              setBrandId(value);
              setPageIndex(0);
            }}
          >
            <Select.Trigger aria-label="Filter by Brand" className="sm:w-52">
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="all">All Brands</Select.Item>
              {(brandQuery.data?.brands ?? []).map((brand) => (
                <Select.Item key={brand.id} value={brand.id}>
                  {brand.name}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
          <Select
            value={assignment}
            onValueChange={(value) => {
              setAssignment(value);
              setPageIndex(0);
            }}
          >
            <Select.Trigger
              aria-label="Filter by assignment status"
              className="sm:w-40"
            >
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="all">All</Select.Item>
              <Select.Item value="assigned">Assigned</Select.Item>
              <Select.Item value="unassigned">Unassigned</Select.Item>
            </Select.Content>
          </Select>
        </div>
        {query.isLoading ? (
          <div className="px-6 py-16 text-center">
            <Text className="text-ui-fg-subtle">Loading Products...</Text>
          </div>
        ) : query.isError ? (
          <div className="px-6 py-16 text-center">
            <Heading level="h2">Products could not be loaded</Heading>
            <Text size="small" className="text-ui-fg-subtle mt-2">
              {query.error.message}
            </Text>
          </div>
        ) : products.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Heading level="h2">No matching Products</Heading>
            <Text size="small" className="text-ui-fg-subtle mt-2">
              Try changing your search or filters.
            </Text>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Thumbnail</Table.HeaderCell>
                  <Table.HeaderCell>Product</Table.HeaderCell>
                  <Table.HeaderCell>Brand</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                  <Table.HeaderCell>Updated</Table.HeaderCell>
                  <Table.HeaderCell className="text-right">
                    Actions
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {products.map((product) => (
                  <BrandProductRow
                    key={product.id}
                    product={product}
                    navigate={navigate}
                    onSelect={() => setSelectedProduct(product)}
                    onRemoved={() => query.refetch()}
                  />
                ))}
              </Table.Body>
            </Table>
          </div>
        )}
        {!query.isLoading && !query.isError && count > 0 && (
          <Table.Pagination
            count={count}
            pageSize={PAGE_SIZE}
            pageIndex={pageIndex}
            pageCount={pageCount}
            canPreviousPage={pageIndex > 0}
            canNextPage={pageIndex + 1 < pageCount}
            previousPage={() => setPageIndex((page) => Math.max(0, page - 1))}
            nextPage={() =>
              setPageIndex((page) => Math.min(pageCount - 1, page + 1))
            }
          />
        )}
      </Container>
      {selectedProduct && (
        <BrandSelector
          productId={selectedProduct.id}
          currentBrandId={selectedProduct.brand?.id}
          onAssigned={() => query.refetch()}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
};

type RowProps = {
  product: AdminBrandProduct;
  navigate: (path: string) => void;
  onSelect: () => void;
  onRemoved: () => void;
};

const BrandProductRow = ({
  product,
  navigate,
  onSelect,
  onRemoved,
}: RowProps) => {
  const prompt = usePrompt();
  const mutation = useSetProductBrand(product.id);
  const removeBrand = async () => {
    const confirmed = await prompt({
      title: "Remove Brand",
      description: `Remove ${product.brand?.name ?? "this Brand"} from ${product.title}?`,
      confirmText: "Remove",
      cancelText: "Cancel",
      variant: "danger",
    });
    if (!confirmed) return;

    try {
      await mutation.mutateAsync({ brand_id: null });
      toast.success("Brand removed from Product");
      onRemoved();
    } catch (error) {
      toast.error(getAssignmentErrorMessage(error));
    }
  };
  return (
    <Table.Row>
      <Table.Cell>
        <div className="bg-ui-bg-subtle border-ui-border-base flex h-10 w-10 items-center justify-center overflow-hidden rounded-md border">
          {product.thumbnail ? (
            <img
              src={product.thumbnail}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <Text size="xsmall" className="text-ui-fg-muted">
              N/A
            </Text>
          )}
        </div>
      </Table.Cell>
      <Table.Cell>
        <button
          type="button"
          className="text-left"
          onClick={() => navigate(`/products/${product.id}`)}
        >
          <Text weight="plus">{product.title}</Text>
          {product.subtitle && (
            <Text size="small" className="text-ui-fg-subtle">
              {product.subtitle}
            </Text>
          )}
        </button>
      </Table.Cell>
      <Table.Cell>
        {product.brand ? (
          <button
            type="button"
            className="flex items-center gap-x-2"
            onClick={() => navigate(`/brands/${product.brand?.id}`)}
          >
            <BrandLogo name={product.brand.name} url={product.brand.logo_url} />
            <Text weight="plus">{product.brand.name}</Text>
          </button>
        ) : (
          <Text className="text-ui-fg-subtle">No Brand</Text>
        )}
      </Table.Cell>
      <Table.Cell>
        <StatusBadge color={product.brand ? "green" : "grey"}>
          {product.brand ? "Assigned" : "No Brand"}
        </StatusBadge>
      </Table.Cell>
      <Table.Cell>{formatDate(product.updated_at)}</Table.Cell>
      <Table.Cell>
        <div className="flex justify-end gap-x-2">
          <Button size="small" variant="secondary" onClick={onSelect}>
            {product.brand ? "Change Brand" : "Assign Brand"}
          </Button>
          {product.brand && (
            <Button
              size="small"
              variant="danger"
              onClick={removeBrand}
              isLoading={mutation.isPending}
              disabled={mutation.isPending}
            >
              Remove Brand
            </Button>
          )}
        </div>
      </Table.Cell>
    </Table.Row>
  );
};

export const config = defineRouteConfig({ label: "Brand Products" });
export default BrandProductsPage;
