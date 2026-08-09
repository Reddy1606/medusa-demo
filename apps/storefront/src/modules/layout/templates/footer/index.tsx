import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import BrandLogo from "@modules/layout/components/brand-logo"

export default async function Footer() {
  const [{ collections }, categories] = await Promise.all([
    listCollections({ fields: "id,title,handle" }),
    listCategories(),
  ])

  return (
    <footer className="bg-[#111111] px-6 text-white">
      <div className="mx-auto max-w-[1280px] py-16 small:py-20">
        <div className="grid gap-12 border-b border-white/15 pb-14 xsmall:grid-cols-2 small:grid-cols-4">
          <div className="xsmall:col-span-2">
            <LocalizedClientLink
              href="/"
              className="text-2xl font-bold tracking-[0.14em] text-[#f4bf28]"
            >
              <BrandLogo footer />
            </LocalizedClientLink>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/55">
              Giúp việc mua sắm quốc tế và theo dõi vận chuyển về Việt Nam trở
              nên rõ ràng, thuận tiện hơn.
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Khám phá</h2>
            <ul className="mt-5 space-y-3 text-sm text-white/55">
              <li>
                <LocalizedClientLink
                  className="transition hover:text-[#f4bf28]"
                  href="/brands"
                >
                  Thương hiệu
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  className="transition hover:text-[#f4bf28]"
                  href="/store"
                >
                  Tất cả sản phẩm
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  className="transition hover:text-[#f4bf28]"
                  href="/#dich-vu"
                >
                  Dịch vụ
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  className="transition hover:text-[#f4bf28]"
                  href="/#huong-dan"
                >
                  Hướng dẫn đặt hàng
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  className="transition hover:text-[#f4bf28]"
                  href="/order-tracking"
                >
                  Tra cứu đơn hàng
                </LocalizedClientLink>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Tài khoản</h2>
            <ul className="mt-5 space-y-3 text-sm text-white/55">
              <li>
                <LocalizedClientLink
                  className="transition hover:text-[#f4bf28]"
                  href="/account"
                >
                  Đăng nhập / Đăng ký
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  className="transition hover:text-[#f4bf28]"
                  href="/account/orders"
                >
                  Đơn hàng của tôi
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  className="transition hover:text-[#f4bf28]"
                  href="/cart"
                >
                  Giỏ hàng
                </LocalizedClientLink>
              </li>
            </ul>
          </div>
        </div>
        {(categories.length > 0 || collections.length > 0) && (
          <div className="flex flex-wrap gap-x-6 gap-y-3 border-b border-white/15 py-6 text-xs text-white/45">
            {categories
              .slice(0, 4)
              .filter((item) => !item.parent_category)
              .map((item) => (
                <LocalizedClientLink
                  key={item.id}
                  href={`/categories/${item.handle}`}
                  className="transition hover:text-white"
                >
                  {item.name}
                </LocalizedClientLink>
              ))}
            {collections.slice(0, 4).map((item) => (
              <LocalizedClientLink
                key={item.id}
                href={`/collections/${item.handle}`}
                className="transition hover:text-white"
              >
                {item.title}
              </LocalizedClientLink>
            ))}
          </div>
        )}
        <div className="flex flex-col gap-2 pt-7 text-xs text-white/40 xsmall:flex-row xsmall:items-center xsmall:justify-between">
          <span>© {new Date().getFullYear()} TIXIMAX</span>
          <span>Mua sắm quốc tế · Thanh toán VietQR · Theo dõi minh bạch</span>
        </div>
      </div>
    </footer>
  )
}
