import { Button, toast, usePrompt } from "@medusajs/ui";
import { AdminApiError, useDeleteBrand } from "../../hooks/api/brands";

type DeleteBrandDialogProps = {
  brandId: string;
  brandName: string;
  onDeleted: () => void;
  size?: "small" | "base" | "large" | "xlarge";
  variant?: "danger" | "secondary";
};

export const DeleteBrandDialog = ({
  brandId,
  brandName,
  onDeleted,
  size = "small",
  variant = "danger",
}: DeleteBrandDialogProps) => {
  const prompt = usePrompt();
  const deleteBrand = useDeleteBrand();

  const handleDelete = async () => {
    const confirmed = await prompt({
      title: "Delete Brand",
      description: `Are you sure you want to delete ${brandName}? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    });

    if (!confirmed) {
      return;
    }

    try {
      await deleteBrand.mutateAsync(brandId);
      toast.success("Brand deleted");
      onDeleted();
    } catch (error) {
      if (error instanceof AdminApiError && error.status === 409) {
        toast.error(
          "This Brand cannot be deleted because it is assigned to one or more Products.",
        );
        return;
      }

      toast.error(
        error instanceof Error
          ? error.message
          : "The Brand could not be deleted.",
      );
    }
  };

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      isLoading={deleteBrand.isPending}
      onClick={handleDelete}
    >
      Delete
    </Button>
  );
};
