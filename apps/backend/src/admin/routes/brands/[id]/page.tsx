import { Container, Heading, Text, toast } from "@medusajs/ui";
import { useNavigate, useParams } from "react-router-dom";
import {
  BrandForm,
  type BrandFormValues,
} from "../../../components/brands/brand-form";
import { DeleteBrandDialog } from "../../../components/brands/delete-brand-dialog";
import {
  AdminApiError,
  useBrand,
  useUpdateBrand,
} from "../../../hooks/api/brands";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const EditBrandPage = () => {
  const navigate = useNavigate();
  const { id = "" } = useParams();
  const { data, isLoading, isError, error } = useBrand(id);
  const updateBrand = useUpdateBrand(id);
  const brand = data?.brand;

  if (isLoading) {
    return (
      <Container className="py-16 text-center">
        <Text className="text-ui-fg-subtle">Loading Brand...</Text>
      </Container>
    );
  }

  if (isError || !brand) {
    const notFound = error instanceof AdminApiError && error.status === 404;

    return (
      <Container className="py-16 text-center">
        <Heading level="h1">
          {notFound ? "Brand not found" : "Brand could not be loaded"}
        </Heading>
        <Text size="small" className="text-ui-fg-subtle mt-2">
          {notFound
            ? "The Brand may have been deleted."
            : error instanceof Error
              ? error.message
              : "Please refresh the page and try again."}
        </Text>
      </Container>
    );
  }

  const handleSubmit = async (values: BrandFormValues) => {
    try {
      await updateBrand.mutateAsync({
        name: values.name,
        handle: values.handle,
        description: values.description || null,
        logo_url: values.logo_url || null,
        logo_file_id: values.logo_file_id,
        banner_url: values.banner_url || null,
        banner_file_id: values.banner_file_id,
        is_active: values.is_active,
      });

      toast.success("Brand updated");
    } catch (error) {
      if (error instanceof AdminApiError && error.status === 409) {
        toast.error("A Brand with this handle already exists.");
        return;
      }

      toast.error(
        error instanceof Error ? error.message : "Brand update failed.",
      );
    }
  };

  return (
    <div className="flex flex-col gap-y-3">
      <BrandForm
        key={brand.updated_at}
        title={`Edit ${brand.name}`}
        description="Update Brand information and visibility."
        initialValues={{
          name: brand.name,
          handle: brand.handle,
          description: brand.description ?? "",
          logo_url: brand.logo_url ?? "",
          logo_file_id: brand.logo_file_id,
          banner_url: brand.banner_url ?? "",
          banner_file_id: brand.banner_file_id,
          is_active: brand.is_active,
        }}
        submitLabel="Save"
        isSubmitting={updateBrand.isPending}
        handleRequired
        onSubmit={handleSubmit}
        onCancel={() => navigate("/brands")}
      />

      <Container className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Heading level="h2">Brand details</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            Created {formatDate(brand.created_at)} · Updated{" "}
            {formatDate(brand.updated_at)}
          </Text>
        </div>
        <DeleteBrandDialog
          brandId={brand.id}
          brandName={brand.name}
          size="base"
          onDeleted={() => navigate("/brands", { replace: true })}
        />
      </Container>
    </div>
  );
};

export default EditBrandPage;
