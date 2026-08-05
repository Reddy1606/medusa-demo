import { ArrowDownTray, Trash } from "@medusajs/icons";
import { Button, Hint, Label, Text } from "@medusajs/ui";
import { ChangeEvent, useEffect, useId, useRef, useState } from "react";
import { sdk } from "../../lib/sdk";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

type BrandMediaKind = "logo" | "banner";

type BrandMediaUploadProps = {
  kind: BrandMediaKind;
  url: string;
  fileId: string | null;
  disabled?: boolean;
  onChange: (value: { url: string; fileId: string | null }) => void;
  onUploadingChange: (isUploading: boolean) => void;
};

const mediaConfig: Record<
  BrandMediaKind,
  { label: string; hint: string; maxBytes: number }
> = {
  logo: {
    label: "Logo",
    hint: "Square PNG, JPG, or WebP recommended. Maximum 2 MB.",
    maxBytes: 2 * 1024 * 1024,
  },
  banner: {
    label: "Banner",
    hint: "Wide PNG, JPG, or WebP recommended. Maximum 5 MB.",
    maxBytes: 5 * 1024 * 1024,
  },
};

const fileNameFromUrl = (url: string) => {
  if (!url) {
    return "";
  }

  try {
    const pathname = new URL(url, window.location.origin).pathname;
    return decodeURIComponent(pathname.split("/").pop() || "Uploaded image");
  } catch {
    return "Uploaded image";
  }
};

export const BrandMediaUpload = ({
  kind,
  url,
  fileId,
  disabled = false,
  onChange,
  onUploadingChange,
}: BrandMediaUploadProps) => {
  const config = mediaConfig[kind];
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [displayName, setDisplayName] = useState(() => fileNameFromUrl(url));
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const selectFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError("Choose a PNG, JPG, or WebP image.");
      return;
    }

    if (file.size > config.maxBytes) {
      setError(
        `${config.label} must be ${config.maxBytes / 1024 / 1024} MB or smaller.`,
      );
      return;
    }

    setError("");
    setSelectedFile(file);
    setDisplayName(file.name);
  };

  const uploadFile = async () => {
    if (!selectedFile || isUploading) {
      return;
    }

    setError("");
    setIsUploading(true);
    onUploadingChange(true);

    try {
      const { files } = await sdk.admin.upload.create({
        files: [selectedFile],
      });
      const uploadedFile = files[0];

      if (!uploadedFile) {
        throw new Error("The upload did not return a file.");
      }

      onChange({ url: uploadedFile.url, fileId: uploadedFile.id });
      setSelectedFile(null);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      onUploadingChange(false);
    }
  };

  const clearMedia = () => {
    setSelectedFile(null);
    setDisplayName("");
    setError("");
    onChange({ url: "", fileId: null });
  };

  const imageUrl = previewUrl || url;
  const hasMedia = Boolean(imageUrl || fileId);

  return (
    <div className="flex flex-col gap-y-2">
      <Label htmlFor={inputId}>{config.label}</Label>
      <div
        className={`bg-ui-bg-subtle border-ui-border-base flex items-center justify-center overflow-hidden rounded-lg border ${
          kind === "logo" ? "aspect-square max-w-48" : "aspect-[3/1] w-full"
        }`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${config.label} preview`}
            className="h-full w-full object-contain"
          />
        ) : (
          <Text size="small" className="text-ui-fg-muted">
            No {kind} selected
          </Text>
        )}
      </div>

      {(selectedFile || url) && (
        <Text size="small" className="text-ui-fg-subtle break-all">
          {displayName || fileNameFromUrl(url)}
        </Text>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          size="small"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || isUploading}
        >
          <ArrowDownTray />
          {hasMedia || selectedFile ? "Replace" : "Choose file"}
        </Button>
        {selectedFile && (
          <Button
            type="button"
            variant="primary"
            size="small"
            onClick={uploadFile}
            isLoading={isUploading}
            disabled={disabled || isUploading}
          >
            Upload
          </Button>
        )}
        {(hasMedia || selectedFile) && (
          <Button
            type="button"
            variant="transparent"
            size="small"
            onClick={clearMedia}
            disabled={disabled || isUploading}
          >
            <Trash />
            Clear
          </Button>
        )}
      </div>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        onChange={selectFile}
        disabled={disabled || isUploading}
        hidden
      />
      <Hint>{config.hint}</Hint>
      {selectedFile && !error && (
        <Hint>Preview ready. Upload the file before saving the Brand.</Hint>
      )}
      {error && <Hint variant="error">{error}</Hint>}
    </div>
  );
};
