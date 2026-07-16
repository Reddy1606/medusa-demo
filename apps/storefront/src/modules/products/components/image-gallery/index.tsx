"use client"

import { ChevronLeftMini, ChevronRightMini } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Container } from "@modules/common/components/ui"
import PlaceholderImage from "@modules/common/icons/placeholder-image"
import clsx from "clsx"
import Image from "next/image"
import { KeyboardEvent, useEffect, useState } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const hasMultipleImages = images.length > 1
  const activeImage = images[activeIndex]

  useEffect(() => {
    setActiveIndex((currentIndex) =>
      Math.min(currentIndex, Math.max(images.length - 1, 0))
    )
  }, [images])

  const showPrevious = () => {
    setActiveIndex((currentIndex) => Math.max(currentIndex - 1, 0))
  }

  const showNext = () => {
    setActiveIndex((currentIndex) =>
      Math.min(currentIndex + 1, images.length - 1)
    )
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft" && activeIndex > 0) {
      event.preventDefault()
      showPrevious()
    }

    if (event.key === "ArrowRight" && activeIndex < images.length - 1) {
      event.preventDefault()
      showNext()
    }
  }

  return (
    <div
      className="mx-auto w-full max-w-[680px] px-0 small:px-8"
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Product image gallery"
    >
      <Container className="relative aspect-square w-full overflow-hidden rounded-large border border-ui-border-base bg-ui-bg-subtle !p-0 shadow-elevation-card-rest">
        {activeImage?.url ? (
          <Image
            key={activeImage.id || activeImage.url}
            src={activeImage.url}
            priority
            className="object-contain object-center p-6 xsmall:p-8"
            alt={`Product image ${activeIndex + 1} of ${images.length}`}
            fill
            quality={90}
            sizes="(max-width: 512px) 100vw, (max-width: 1024px) 60vw, 680px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-ui-fg-muted">
            <PlaceholderImage size={32} />
          </div>
        )}

        {hasMultipleImages && (
          <>
            <button
              type="button"
              onClick={showPrevious}
              disabled={activeIndex === 0}
              aria-label="Show previous product image"
              className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-circle border border-ui-border-base bg-ui-bg-base/90 text-ui-fg-base shadow-elevation-card-rest backdrop-blur-sm transition hover:bg-ui-bg-base hover:shadow-elevation-card-hover disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ChevronLeftMini />
            </button>
            <button
              type="button"
              onClick={showNext}
              disabled={activeIndex === images.length - 1}
              aria-label="Show next product image"
              className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-circle border border-ui-border-base bg-ui-bg-base/90 text-ui-fg-base shadow-elevation-card-rest backdrop-blur-sm transition hover:bg-ui-bg-base hover:shadow-elevation-card-hover disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ChevronRightMini />
            </button>
          </>
        )}
      </Container>

      {hasMultipleImages && (
        <div
          className="no-scrollbar mt-3 flex max-w-full gap-2 overflow-x-auto pb-1"
          aria-label="Choose a product image"
        >
          {images.map((image, index) => {
            const isActive = index === activeIndex

            return (
              <button
                key={image.id || `${image.url}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={clsx(
                  "relative h-16 w-16 flex-none overflow-hidden rounded-rounded border-2 bg-ui-bg-subtle transition-colors xsmall:h-[72px] xsmall:w-[72px]",
                  {
                    "border-ui-border-interactive": isActive,
                    "border-transparent hover:border-ui-border-strong":
                      !isActive,
                  }
                )}
                aria-label={`Show product image ${index + 1}`}
                aria-pressed={isActive}
              >
                {image.url ? (
                  <Image
                    src={image.url}
                    alt=""
                    fill
                    className="object-contain object-center p-1"
                    sizes="72px"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-ui-fg-muted">
                    <PlaceholderImage size={16} />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ImageGallery
