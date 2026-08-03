"use client"

import PlaceholderImage from "@modules/common/icons/placeholder-image"
import Image from "next/image"
import { useEffect, useState } from "react"

type ProductImageProps = {
  image?: string
  size?: "small" | "medium" | "large" | "full" | "square"
}

export default function ProductImage({ image, size }: ProductImageProps) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setHasError(false)
  }, [image])

  if (!image || hasError) {
    return (
      <div
        className="absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#fffaf0] via-[#f7f0df] to-[#eadcb8] px-4 text-center text-black/40"
        role="img"
        aria-label="Chưa có hình ảnh sản phẩm"
      >
        <span className="rounded-2xl border border-[#d7aa2f]/30 bg-white/70 p-3 text-[#9a6800] shadow-sm">
          <PlaceholderImage size={size === "small" ? 20 : 28} />
        </span>
        <span className="text-xs font-medium">Chưa có hình ảnh</span>
      </div>
    )
  }

  return (
    <Image
      src={image}
      alt="Hình ảnh sản phẩm"
      onError={() => setHasError(true)}
      className="absolute inset-0 object-cover object-center"
      draggable={false}
      quality={50}
      sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
      fill
    />
  )
}
