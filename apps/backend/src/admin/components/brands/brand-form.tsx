import { FormEvent, useState } from "react";
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
} from "@medusajs/ui";
import { BrandMediaUpload } from "./brand-media-upload";

export type BrandFormValues = {
  name: string;
  handle: string;
  description: string;
  logo_url: string;
  logo_file_id: string | null;
  banner_url: string;
  banner_file_id: string | null;
  is_active: boolean;
};

type BrandFormProps = {
  title: string;
  description: string;
  initialValues?: Partial<BrandFormValues>;
  submitLabel: string;
  isSubmitting: boolean;
  handleRequired?: boolean;
  onSubmit: (values: BrandFormValues) => Promise<void>;
  onCancel: () => void;
};

type BrandFormErrors = Partial<Record<keyof BrandFormValues, string>>;

const emptyValues: BrandFormValues = {
  name: "",
  handle: "",
  description: "",
  logo_url: "",
  logo_file_id: null,
  banner_url: "",
  banner_file_id: null,
  is_active: true,
};

const isValidAssetLocation = (value: string) => {
  if (!value) {
    return true;
  }

  if (value.startsWith("/")) {
    return !value.startsWith("//");
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export const BrandForm = ({
  title,
  description,
  initialValues,
  submitLabel,
  isSubmitting,
  handleRequired = false,
  onSubmit,
  onCancel,
}: BrandFormProps) => {
  const [values, setValues] = useState<BrandFormValues>({
    ...emptyValues,
    ...initialValues,
  });
  const [errors, setErrors] = useState<BrandFormErrors>({});
  const [logoUploading, setLogoUploading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const isUploading = logoUploading || bannerUploading;
  const isDisabled = isSubmitting || isUploading;

  const setField = <K extends keyof BrandFormValues>(
    field: K,
    value: BrandFormValues[K],
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = () => {
    const nextErrors: BrandFormErrors = {};
    const name = values.name.trim();
    const handle = values.handle.trim();

    if (!name) {
      nextErrors.name = "Name is required.";
    } else if (name.length > 255) {
      nextErrors.name = "Name must be 255 characters or fewer.";
    }

    if (handleRequired && !handle) {
      nextErrors.handle = "Handle is required when editing a Brand.";
    } else if (handle.length > 255) {
      nextErrors.handle = "Handle must be 255 characters or fewer.";
    }

    if (values.description.length > 10_000) {
      nextErrors.description =
        "Description must be 10,000 characters or fewer.";
    }

    if (!isValidAssetLocation(values.logo_url.trim())) {
      nextErrors.logo_url = "Enter an HTTP(S) URL or an absolute local path.";
    }

    if (!isValidAssetLocation(values.banner_url.trim())) {
      nextErrors.banner_url = "Enter an HTTP(S) URL or an absolute local path.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isUploading || !validate()) {
      return;
    }

    await onSubmit({
      ...values,
      name: values.name.trim(),
      handle: values.handle.trim(),
      description: values.description.trim(),
      logo_url: values.logo_url.trim(),
      banner_url: values.banner_url.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-3">
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <Heading level="h1">{title}</Heading>
            <Text size="small" className="text-ui-fg-subtle">
              {description}
            </Text>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 px-6 py-6 md:grid-cols-2">
          <div className="flex flex-col gap-y-2 md:col-span-2">
            <Label htmlFor="brand-name">Name</Label>
            <Input
              id="brand-name"
              value={values.name}
              onChange={(event) => setField("name", event.target.value)}
              aria-invalid={Boolean(errors.name)}
              autoComplete="off"
              disabled={isDisabled}
            />
            {errors.name && <Hint variant="error">{errors.name}</Hint>}
          </div>

          <div className="flex flex-col gap-y-2 md:col-span-2">
            <Label htmlFor="brand-handle">Handle</Label>
            <Input
              id="brand-handle"
              value={values.handle}
              onChange={(event) => setField("handle", event.target.value)}
              aria-invalid={Boolean(errors.handle)}
              autoComplete="off"
              disabled={isDisabled}
            />
            {errors.handle ? (
              <Hint variant="error">{errors.handle}</Hint>
            ) : !handleRequired ? (
              <Hint>
                Leave blank to generate the handle from the Brand name.
              </Hint>
            ) : null}
          </div>

          <div className="flex flex-col gap-y-2 md:col-span-2">
            <Label htmlFor="brand-description">Description</Label>
            <Textarea
              id="brand-description"
              value={values.description}
              onChange={(event) => setField("description", event.target.value)}
              aria-invalid={Boolean(errors.description)}
              rows={5}
              disabled={isDisabled}
            />
            {errors.description && (
              <Hint variant="error">{errors.description}</Hint>
            )}
          </div>

          <BrandMediaUpload
            kind="logo"
            url={values.logo_url}
            fileId={values.logo_file_id}
            disabled={isSubmitting}
            onUploadingChange={setLogoUploading}
            onChange={({ url, fileId }) =>
              setValues((current) => ({
                ...current,
                logo_url: url,
                logo_file_id: fileId,
              }))
            }
          />

          <BrandMediaUpload
            kind="banner"
            url={values.banner_url}
            fileId={values.banner_file_id}
            disabled={isSubmitting}
            onUploadingChange={setBannerUploading}
            onChange={({ url, fileId }) =>
              setValues((current) => ({
                ...current,
                banner_url: url,
                banner_file_id: fileId,
              }))
            }
          />

          <div className="flex items-center justify-between gap-x-4 md:col-span-2">
            <div>
              <Label htmlFor="brand-active">Active</Label>
              <Text size="small" className="text-ui-fg-subtle">
                Inactive Brands remain available for management.
              </Text>
            </div>
            <Switch
              id="brand-active"
              checked={values.is_active}
              onCheckedChange={(checked) => setField("is_active", checked)}
              disabled={isDisabled}
            />
          </div>
        </div>
      </Container>

      <div className="flex items-center justify-end gap-x-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isDisabled}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting} disabled={isDisabled}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
