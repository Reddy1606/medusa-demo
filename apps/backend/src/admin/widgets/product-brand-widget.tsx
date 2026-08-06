import { defineWidgetConfig } from "@medusajs/admin-sdk";
import {
  Button,
  Container,
  Heading,
  StatusBadge,
  Text,
  toast,
  usePrompt,
} from "@medusajs/ui";
import { useState } from "react";
import { BrandLogo } from "../components/brands/brand-logo";
import {
  BrandSelector,
  getAssignmentErrorMessage,
} from "../components/brands/brand-selector";
import {
  useProductBrand,
  useSetProductBrand,
} from "../hooks/api/product-brand";

type ProductBrandWidgetProps = {
  data: { id: string };
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
