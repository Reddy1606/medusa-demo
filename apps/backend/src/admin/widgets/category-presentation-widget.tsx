import { defineWidgetConfig } from "@medusajs/admin-sdk";
import {
  Button,
  Container,
  Heading,
  Hint,
  Input,
  Label,
  Switch,
  Text,
  Textarea,
  toast,
} from "@medusajs/ui";
import { FormEvent, useEffect, useState } from "react";
import { BrandMediaUpload } from "../components/brands/brand-media-upload";
import {
  useCategoryPresentation,
  useUpdateCategoryPresentation,
} from "../hooks/api/category-presentation";
import {
  CategoryPresentation,
  DEFAULT_CATEGORY_PRESENTATION,
  MAX_HOMEPAGE_RANK,
  isValidAssetLocation,
  parseCategoryPresentation,
} from "../types/category-presentation";

type CategoryPresentationWidgetProps = {
  data: { id: string; name: string };
};

type FormValues = Omit<CategoryPresentation, "homepage_rank"> & {
  homepage_rank: string;
};

type FormErrors = Partial<
  Record<
    "homepage_rank" | "homepage_title" | "homepage_description" | "banner_url",
    string
  >
>;

const toFormValues = (value: CategoryPresentation): FormValues => ({
  ...value,
  homepage_rank: value.homepage_rank?.toString() ?? "",
});

const CategoryPresentationWidget = ({
  data: category,
}: CategoryPresentationWidgetProps) => {
  const { data, isLoading, isError, refetch } = useCategoryPresentation(
    category.id,
  );
  const updatePresentation = useUpdateCategoryPresentation(category.id);
  const [values, setValues] = useState<FormValues>(() =>
    toFormValues(DEFAULT_CATEGORY_PRESENTATION),
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (data?.product_category) {
      setValues(
        toFormValues(parseCategoryPresentation(data.product_category.metadata)),
      );
      setErrors({});
    }
  }, [data]);

  const setField = <K extends keyof FormValues>(
    field: K,
    value: FormValues[K],
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = () => {
    const nextErrors: FormErrors = {};
    const title = values.homepage_title?.trim() ?? "";
    const description = values.homepage_description?.trim() ?? "";
    const bannerUrl = values.banner_url?.trim() ?? "";
    const rank = values.homepage_rank.trim();

    if (rank) {
      const parsedRank = Number(rank);
      if (
        !Number.isInteger(parsedRank) ||
        parsedRank < 0 ||
        parsedRank > MAX_HOMEPAGE_RANK
      ) {
        nextErrors.homepage_rank = `Enter a whole number from 0 to ${MAX_HOMEPAGE_RANK}.`;
      }
    }
    if (title.length > 255) {
      nextErrors.homepage_title =
        "Homepage title must be 255 characters or fewer.";
    }
    if (description.length > 5000) {
      nextErrors.homepage_description =
        "Homepage description must be 5,000 characters or fewer.";
    }
    if (bannerUrl && !isValidAssetLocation(bannerUrl)) {
      nextErrors.banner_url =
        "Banner must use HTTP(S) or an absolute local path.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isUploading || !validate()) return;

    const title = values.homepage_title?.trim() || null;
    const description = values.homepage_description?.trim() || null;
    const bannerUrl = values.banner_url?.trim() || null;
    const presentation: CategoryPresentation = {
      show_on_homepage: values.show_on_homepage,
      homepage_rank: values.homepage_rank.trim()
        ? Number(values.homepage_rank)
        : null,
      homepage_title: title,
      homepage_description: description,
      banner_url: bannerUrl,
      banner_file_id: bannerUrl ? values.banner_file_id : null,
    };

    try {
      await updatePresentation.mutateAsync(presentation);
      toast.success("Homepage presentation saved");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Homepage presentation could not be saved.",
      );
    }
  };

  const disabled = isLoading || updatePresentation.isPending || isUploading;

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading level="h2">Homepage Presentation</Heading>
        <Text size="small" className="text-ui-fg-subtle">
          Configure how {category.name} can appear on the storefront homepage.
        </Text>
      </div>

      {isError ? (
        <div className="flex items-center justify-between gap-x-3 px-6 py-4">
          <Text className="text-ui-fg-error">
            Presentation settings could not be loaded.
          </Text>
          <Button
            type="button"
            size="small"
            variant="secondary"
            onClick={() => refetch()}
          >
            Retry
          </Button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-y-6 px-6 py-6"
        >
          <div className="flex items-center justify-between gap-x-4">
            <div>
              <Label htmlFor="category-show-on-homepage">
                Show on homepage
              </Label>
              <Text size="small" className="text-ui-fg-subtle">
                This does not change the Category&apos;s active status.
              </Text>
            </div>
            <Switch
              id="category-show-on-homepage"
              checked={values.show_on_homepage}
              onCheckedChange={(checked) =>
                setField("show_on_homepage", checked)
              }
              disabled={disabled}
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <Label htmlFor="category-homepage-rank">Homepage order</Label>
            <Input
              id="category-homepage-rank"
              type="number"
              min={0}
              max={MAX_HOMEPAGE_RANK}
              step={1}
              value={values.homepage_rank}
              onChange={(event) =>
                setField("homepage_rank", event.target.value)
              }
              aria-invalid={Boolean(errors.homepage_rank)}
              disabled={disabled}
            />
            {errors.homepage_rank ? (
              <Hint variant="error">{errors.homepage_rank}</Hint>
            ) : (
              <Hint>
                Recommended when shown; duplicate or empty orders are allowed.
              </Hint>
            )}
          </div>

          <div className="flex flex-col gap-y-2">
            <Label htmlFor="category-homepage-title">Homepage title</Label>
            <Input
              id="category-homepage-title"
              value={values.homepage_title ?? ""}
              onChange={(event) =>
                setField("homepage_title", event.target.value)
              }
              maxLength={255}
              disabled={disabled}
            />
            {errors.homepage_title && (
              <Hint variant="error">{errors.homepage_title}</Hint>
            )}
          </div>

          <div className="flex flex-col gap-y-2">
            <Label htmlFor="category-homepage-description">
              Homepage description
            </Label>
            <Textarea
              id="category-homepage-description"
              value={values.homepage_description ?? ""}
              onChange={(event) =>
                setField("homepage_description", event.target.value)
              }
              maxLength={5000}
              rows={5}
              disabled={disabled}
            />
            {errors.homepage_description && (
              <Hint variant="error">{errors.homepage_description}</Hint>
            )}
          </div>

          <BrandMediaUpload
            kind="banner"
            url={values.banner_url ?? ""}
            fileId={values.banner_file_id}
            disabled={isLoading || updatePresentation.isPending}
            onUploadingChange={setIsUploading}
            onChange={({ url, fileId }) => {
              setValues((current) => ({
                ...current,
                banner_url: url || null,
                banner_file_id: url ? fileId : null,
              }));
              setErrors((current) => ({ ...current, banner_url: undefined }));
            }}
          />
          {errors.banner_url && (
            <Hint variant="error">{errors.banner_url}</Hint>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              isLoading={updatePresentation.isPending}
              disabled={disabled}
            >
              Save changes
            </Button>
          </div>
        </form>
      )}
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "product_category.details.after",
});

export default CategoryPresentationWidget;
