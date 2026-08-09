import { listBrands } from "@lib/data/brands"
import BrandCard from "../components/brand-card"

const PAGE_SIZE = 20

export default async function BrandListTemplate({
  q,
  page,
}: {
  q?: string
  page: number
}) {
  const { brands, count } = await listBrands({
    q,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  })
  const pageCount = Math.ceil(count / PAGE_SIZE)

  return (
    <main className="bg-[#fbf6e9] px-6 py-16 small:py-24">
      <div className="mx-auto max-w-[1280px]">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a87200]">
          Bộ sưu tập chọn lọc
        </span>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-black small:text-6xl">
          Thương hiệu
        </h1>
        <p className="mt-5 max-w-2xl leading-7 text-black/60">
          Khám phá các thương hiệu đang có mặt tại TIXIMAX và tìm sản phẩm phù
          hợp với bạn.
        </p>

        <form className="mt-10 flex max-w-xl gap-3" action="" method="get">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Tìm theo tên thương hiệu"
            aria-label="Tìm thương hiệu"
            className="min-h-12 flex-1 rounded-full border border-black/15 bg-white px-5 text-sm outline-none transition focus:border-[#b57b00] focus:ring-2 focus:ring-[#f4bf28]/30"
          />
          <button className="min-h-12 rounded-full bg-[#f4bf28] px-6 text-sm font-semibold text-black transition hover:bg-[#ffd253]">
            Tìm kiếm
          </button>
        </form>

        {brands.length ? (
          <div className="mt-12 grid gap-5 xsmall:grid-cols-2 medium:grid-cols-3 large:grid-cols-4">
            {brands.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-3xl border border-black/10 bg-white px-6 py-16 text-center">
            <h2 className="text-xl font-semibold text-black">
              Không tìm thấy thương hiệu
            </h2>
            <p className="mt-2 text-sm text-black/55">
              Hãy thử một tên hoặc từ khóa khác.
            </p>
          </div>
        )}

        {pageCount > 1 && (
          <div className="mt-12 flex justify-center gap-3">
            {Array.from({ length: pageCount }, (_, index) => index + 1).map(
              (pageNumber) => (
                <a
                  key={pageNumber}
                  href={`?${new URLSearchParams({
                    ...(q ? { q } : {}),
                    page: String(pageNumber),
                  })}`}
                  aria-current={pageNumber === page ? "page" : undefined}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                    pageNumber === page
                      ? "bg-black text-white"
                      : "bg-white text-black hover:bg-[#f4bf28]"
                  }`}
                >
                  {pageNumber}
                </a>
              ),
            )}
          </div>
        )}
      </div>
    </main>
  )
}
