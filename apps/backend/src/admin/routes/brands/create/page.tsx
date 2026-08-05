import { toast } from "@medusajs/ui";
import { useNavigate } from "react-router-dom";
import {
  BrandForm,
  type BrandFormValues,
} from "../../../components/brands/brand-form";
import { AdminApiError, useCreateBrand } from "../../../hooks/api/brands";

const CreateBrandPage = () => {
  const navigate = useNavigate();
  const createBrand = useCreateBrand();

  const handleSubmit = async (values: BrandFormValues) => {
    try {
      const { brand } = await createBrand.mutateAsync({
        name: values.name,
        ...(values.handle ? { handle: values.handle } : {}),
        description: values.description || null,
        logo_url: values.logo_url || null,
        logo_file_id: values.logo_file_id,
        banner_url: values.banner_url || null,
        banner_file_id: values.banner_file_id,
        is_active: values.is_active,
      });

      toast.success("Brand created");
      navigate(`/brands/${brand.id}`);
    } catch (error) {
      if (error instanceof AdminApiError && error.status === 409) {
        toast.error("A Brand with this handle already exists.");
        return;
      }

      toast.error(
        error instanceof Error ? error.message : "Brand creation failed.",
      );
    }
  };

  return (
    <BrandForm
      title="Create Brand"
      description="Add a Brand to your catalog."
      submitLabel="Create"
      isSubmitting={createBrand.isPending}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/brands")}
    />
  );
};

export default CreateBrandPage;
