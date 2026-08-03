import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"
import BrandLogo from "@modules/layout/components/brand-logo"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="tixi-page relative w-full small:min-h-screen">
      <div className="h-20 border-b border-black/5 bg-white shadow-sm">
        <nav className="flex h-full items-center content-container justify-between">
          <LocalizedClientLink
            href="/cart"
            className="text-small-semi text-ui-fg-base flex items-center gap-x-2 uppercase flex-1 basis-0"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="mt-px hidden small:block txt-compact-plus text-ui-fg-subtle hover:text-ui-fg-base ">
              Quay lại giỏ hàng
            </span>
            <span className="mt-px block small:hidden txt-compact-plus text-ui-fg-subtle hover:text-ui-fg-base">
              Quay lại
            </span>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/"
            className="text-xl font-bold tracking-[0.12em] text-black"
            data-testid="store-link"
          >
            <BrandLogo />
          </LocalizedClientLink>
          <div className="flex-1 basis-0" />
        </nav>
      </div>
      <div className="relative" data-testid="checkout-container">
        {children}
      </div>
      <div className="flex w-full items-center justify-center py-6 text-xs text-black/40">
        © {new Date().getFullYear()} TIXIMAX
      </div>
    </div>
  )
}
