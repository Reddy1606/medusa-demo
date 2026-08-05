import fs from "fs"
import Image from "next/image"
import path from "path"

export default function BrandLogo({ footer = false }: { footer?: boolean }) {
  const logoPath = path.join(
    process.cwd(),
    "public",
    "images",
    "brand",
    "tiximax-logo.png"
  )

  if (fs.existsSync(logoPath)) {
    return (
      <span
        className={
          footer
            ? "inline-flex rounded-xl bg-black px-3 py-2"
            : "inline-flex h-10 w-36 items-center"
        }
      >
        <Image
          src="/images/brand/tiximax-logo.png"
          alt="TIXIMAX"
          width={144}
          height={40}
          className="h-10 w-36 object-contain"
          priority={!footer}
        />
      </span>
    )
  }

  return <span>TIXIMAX</span>
}
