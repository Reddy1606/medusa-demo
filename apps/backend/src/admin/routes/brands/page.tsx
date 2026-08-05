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
} from "@medusajs/ui";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrandLogo } from "../../components/brands/brand-logo";
import { DeleteBrandDialog } from "../../components/brands/delete-brand-dialog";
import { useBrands } from "../../hooks/api/brands";

const PAGE_SIZE = 20;

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const BrandsPage = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [pageIndex, setPageIndex] = useState(0);

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
      is_active: status === "all" ? undefined : status === "active",
      limit: PAGE_SIZE,
      offset: pageIndex * PAGE_SIZE,
      order: "-created_at" as const,
    }),
    [pageIndex, search, status],
  );
  const { data, isLoading, isError, error } = useBrands(params);
  const brands = data?.brands ?? [];
  const count = data?.count ?? 0;
  const pageCount = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const hasFilters = Boolean(search || status !== "all");

  return (
    <Container className="divide-y p-0">
      <div className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Heading level="h1">Brands</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            Create and manage the Brands in your catalog.
          </Text>
        </div>
        <Button onClick={() => navigate("/brands/create")}>Create Brand</Button>
      </div>

      <div className="flex flex-col gap-3 px-6 py-4 sm:flex-row">
        <Input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search by name or handle"
          aria-label="Search Brands"
          className="sm:max-w-sm"
        />
        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value);
            setPageIndex(0);
          }}
        >
          <Select.Trigger
            aria-label="Filter Brands by status"
            className="sm:w-40"
          >
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="all">All</Select.Item>
            <Select.Item value="active">Active</Select.Item>
            <Select.Item value="inactive">Inactive</Select.Item>
          </Select.Content>
        </Select>
      </div>

      {isLoading ? (
        <div className="px-6 py-16 text-center">
          <Text className="text-ui-fg-subtle">Loading Brands...</Text>
        </div>
      ) : isError ? (
        <div className="px-6 py-16 text-center">
          <Heading level="h2">Brands could not be loaded</Heading>
          <Text size="small" className="text-ui-fg-subtle mt-2">
            {error instanceof Error
              ? error.message
              : "Please refresh the page and try again."}
          </Text>
        </div>
      ) : brands.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <Heading level="h2">
            {hasFilters ? "No matching Brands" : "No Brands yet"}
          </Heading>
          <Text size="small" className="text-ui-fg-subtle mt-2">
            {hasFilters
              ? "Try changing your search or status filter."
              : "Create your first Brand to get started."}
          </Text>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Logo</Table.HeaderCell>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Handle</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Updated At</Table.HeaderCell>
                <Table.HeaderCell className="text-right">
                  Actions
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {brands.map((brand) => (
                <Table.Row
                  key={brand.id}
                  tabIndex={0}
                  className="cursor-pointer"
                  onClick={() => navigate(`/brands/${brand.id}`)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      navigate(`/brands/${brand.id}`);
                    }
                  }}
                >
                  <Table.Cell>
                    <BrandLogo name={brand.name} url={brand.logo_url} />
                  </Table.Cell>
                  <Table.Cell>
                    <Text weight="plus">{brand.name}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="small" className="text-ui-fg-subtle">
                      {brand.handle}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <StatusBadge color={brand.is_active ? "green" : "grey"}>
                      {brand.is_active ? "Active" : "Inactive"}
                    </StatusBadge>
                  </Table.Cell>
                  <Table.Cell>{formatDate(brand.updated_at)}</Table.Cell>
                  <Table.Cell>
                    <div
                      className="flex justify-end gap-x-2"
                      onClick={(event) => event.stopPropagation()}
                      onKeyDown={(event) => event.stopPropagation()}
                    >
                      <Button
                        size="small"
                        variant="secondary"
                        onClick={() => navigate(`/brands/${brand.id}`)}
                      >
                        Edit
                      </Button>
                      <DeleteBrandDialog
                        brandId={brand.id}
                        brandName={brand.name}
                        onDeleted={() => undefined}
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}

      {!isLoading && !isError && count > 0 && (
        <Table.Pagination
          count={count}
          pageSize={PAGE_SIZE}
          pageIndex={pageIndex}
          pageCount={pageCount}
          canPreviousPage={pageIndex > 0}
          canNextPage={pageIndex + 1 < pageCount}
          previousPage={() =>
            setPageIndex((current) => Math.max(0, current - 1))
          }
          nextPage={() =>
            setPageIndex((current) => Math.min(pageCount - 1, current + 1))
          }
        />
      )}
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Brands",
});

export default BrandsPage;
