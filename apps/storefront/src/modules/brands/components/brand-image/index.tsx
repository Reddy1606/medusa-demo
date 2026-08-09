"use client"

import { useState } from "react"

export default function BrandImage({
  src,
  alt,
  kind = "logo",
}: {
  src: string | null
  alt: string
  kind?: "logo" | "banner"
}) {
  const [failed, setFailed] = useState(false)
  const isBanner = kind === "banner"

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={
          isBanner
            ? "flex h-full w-full items-center justify-center bg-gradient-to-br from-[#fff8df] via-[#f7e8af] to-[#dba82b]"
            : "flex h-full w-full items-center justify-center bg-[#fff4c9] text-xl font-bold text-[#9a6800]"
        }
      >
        {!isBanner && alt.slice(0, 1).toUpperCase()}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={
        isBanner ? "h-full w-full object-cover" : "h-full w-full object-contain"
      }
    />
  )
}
