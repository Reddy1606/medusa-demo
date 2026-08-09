"use client"

import { useEffect, useState } from "react"

export default function BrandImage({
  src,
  name,
  alt,
  kind = "logo",
}: {
  src: string | null
  name: string
  alt: string
  kind?: "logo" | "banner"
}) {
  const [failed, setFailed] = useState(false)
  const isBanner = kind === "banner"

  useEffect(() => {
    setFailed(false)
  }, [src])

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
        {!isBanner && name.trim().slice(0, 1).toUpperCase()}
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
