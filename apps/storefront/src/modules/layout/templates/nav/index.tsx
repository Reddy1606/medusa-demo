import { Suspense } from "react"
import { getLocale } from "@lib/data/locale-actions"
import { listLocales } from "@lib/data/locales"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import BrandLogo from "@modules/layout/components/brand-logo"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((items: StoreRegion[]) => items),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky inset-x-0 top-0 z-50 bg-white/95 shadow-[0_2px_18px_rgba(17,17,17,0.06)] backdrop-blur">
      <header className="h-20 border-b border-black/5">
        <nav
          className="mx-auto flex h-full w-full max-w-[1280px] items-center justify-between px-6 text-sm text-black/65"
          aria-label="Điều hướng chính"
        >
          <div className="flex h-full items-center small:hidden">
            <SideMenu
              regions={regions}
              locales={locales}
              currentLocale={currentLocale}
            />
          </div>
          <LocalizedClientLink
            href="/"
            className="shrink-0 text-xl font-bold tracking-[0.12em] text-black transition hover:text-[#9a6800]"
            data-testid="nav-store-link"
          >
            <BrandLogo />
          </LocalizedClientLink>
          <div className="hidden items-center gap-7 small:flex">
            <LocalizedClientLink
              className="font-medium text-black transition hover:text-[#a36f00]"
              href="/"
            >
              Trang chủ
            </LocalizedClientLink>
            <LocalizedClientLink
              className="font-medium transition hover:text-black"
              href="/store"
            >
              Sản phẩm
            </LocalizedClientLink>
            <LocalizedClientLink
              className="font-medium transition hover:text-black"
              href="/#dich-vu"
            >
              Dịch vụ
            </LocalizedClientLink>
            <LocalizedClientLink
              className="font-medium transition hover:text-black"
              href="/#huong-dan"
            >
              Hướng dẫn
            </LocalizedClientLink>
          </div>
          <div className="flex h-full items-center justify-end gap-4">
            <div className="hidden h-full items-center gap-5 medium:flex">
              <LocalizedClientLink
                className="rounded-full bg-[#f4bf28] px-4 py-2.5 font-semibold text-black transition hover:-translate-y-0.5 hover:bg-[#ffd253] hover:shadow-md"
                href="/order-tracking"
              >
                Tra cứu đơn hàng
              </LocalizedClientLink>
              <LocalizedClientLink
                className="font-semibold text-black transition hover:text-[#9a6800]"
                href="/account"
                data-testid="nav-account-link"
              >
                Đăng nhập
              </LocalizedClientLink>
              <LocalizedClientLink
                className="font-semibold text-black transition hover:text-[#9a6800]"
                href="/account"
              >
                Đăng ký
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="font-semibold text-black"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
