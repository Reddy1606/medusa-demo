import { useEffect, useState } from "react";
import { Text } from "@medusajs/ui";

type BrandLogoProps = {
  name: string;
  url?: string | null;
  size?: "small" | "large";
};

export const BrandLogo = ({ name, url, size = "small" }: BrandLogoProps) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [url]);

  const dimensions = size === "large" ? "h-20 w-20" : "h-10 w-10";

  if (!url || failed) {
    return (
      <div
        className={`${dimensions} bg-ui-bg-subtle flex shrink-0 items-center justify-center rounded-md border`}
        aria-label={`${name} has no logo`}
      >
        <Text size={size === "large" ? "large" : "small"} weight="plus">
          {name.slice(0, 1).toUpperCase() || "B"}
        </Text>
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={`${name} logo`}
      className={`${dimensions} bg-ui-bg-base shrink-0 rounded-md border object-contain`}
      onError={() => setFailed(true)}
    />
  );
};
