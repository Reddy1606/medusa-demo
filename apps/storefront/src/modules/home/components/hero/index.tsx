import {
  ArrowRight,
  CheckCircleSolid,
  GlobeEurope,
  PaperPlane,
} from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <section className="w-full overflow-hidden bg-gradient-to-br from-[#fff8dc] via-[#f9d866] to-[#eeb52d]">
      <div className="relative mx-auto grid max-w-[1280px] grid-cols-[minmax(0,1fr)] items-center px-6 py-12 small:min-h-[calc(100vh-80px)] small:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] small:gap-8 small:px-10 small:py-16 medium:px-14">
        <div className="relative z-10 min-w-0 max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-black shadow-sm backdrop-blur">
            <GlobeEurope className="h-4 w-4" /> Kết nối hàng hóa toàn cầu
          </div>
          <h1 className="text-[42px] font-semibold leading-[1.06] tracking-[-0.04em] text-[#111111] xsmall:text-5xl small:text-6xl medium:text-7xl">
            Mua sắm quốc tế
            <span className="block">dễ dàng hơn</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-black/70 small:text-lg small:leading-8">
            Chọn sản phẩm quốc tế, xem chi phí minh bạch, thanh toán an toàn và
            nhận hàng tận nơi tại Việt Nam. Theo dõi hành trình đơn hàng bất cứ
            lúc nào, không cần tài khoản.
          </p>
          <div className="mt-8 flex flex-col gap-3 xsmall:flex-row">
            <LocalizedClientLink
              href="/store"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#111111] px-6 py-3 text-sm font-semibold text-white shadow-lg transition duration-200 hover:-translate-y-0.5 hover:bg-black hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              Khám phá sản phẩm <ArrowRight className="h-4 w-4" />
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/order-tracking"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-black/20 bg-white/70 px-6 py-3 text-sm font-semibold text-black transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              Tra cứu đơn hàng
            </LocalizedClientLink>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-black/65">
            {["Chi phí rõ ràng", "Thanh toán bảo mật", "Giao hàng tận nơi"].map(
              (item) => (
                <span className="flex items-center gap-2" key={item}>
                  <CheckCircleSolid className="h-4 w-4 text-black" /> {item}
                </span>
              ),
            )}
          </div>
        </div>

        <div
          className="relative mt-12 min-h-[360px] min-w-0 small:mt-0 small:min-h-[540px]"
          aria-hidden="true"
        >
          <div className="absolute left-[10%] top-[8%] h-[78%] w-[78%] rounded-full border border-white/50 bg-white/20 shadow-inner" />
          <div className="absolute left-[20%] top-[18%] h-[58%] w-[58%] rounded-full border border-dashed border-black/25" />
          <div className="absolute right-[9%] top-[13%] rotate-12 rounded-full bg-black p-4 text-[#f8ca43] shadow-xl">
            <PaperPlane className="h-7 w-7" />
          </div>
          <div className="absolute left-[3%] top-[42%] w-44 -rotate-3 rounded-2xl border border-white/60 bg-white/90 p-4 shadow-xl backdrop-blur small:w-52">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-semibold text-black/50">TOKYO</span>
              <span className="h-2 w-2 rounded-full bg-[#f1b915]" />
            </div>
            <div className="h-16 rounded-xl bg-gradient-to-br from-[#f8d35b] to-[#efb319]" />
            <div className="mt-3 h-2 w-3/4 rounded-full bg-black/80" />
            <div className="mt-2 h-2 w-1/2 rounded-full bg-black/15" />
          </div>
          <div className="absolute bottom-[8%] right-[4%] w-52 rotate-3 rounded-3xl bg-[#111111] p-5 text-white shadow-2xl small:w-64">
            <div className="flex items-center justify-between text-xs text-white/50">
              <span>ĐƠN HÀNG</span>
              <span>#TXM2048</span>
            </div>
            <div className="mt-7 flex items-end justify-between">
              <div>
                <div className="text-xs text-white/50">Đang vận chuyển</div>
                <div className="mt-1 text-lg font-semibold">Về Việt Nam</div>
              </div>
              <div className="rounded-xl bg-[#f4bf28] p-3 text-black">
                <PaperPlane className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/20">
              <div className="h-full w-3/4 rounded-full bg-[#f4bf28]" />
            </div>
          </div>
          <div className="absolute left-[42%] top-[42%] h-24 w-28 rotate-6 rounded-xl bg-[#d99a13] shadow-[inset_-8px_-10px_0_rgba(0,0,0,0.08),0_18px_30px_rgba(0,0,0,0.18)]">
            <div className="mx-auto h-full w-7 bg-[#f8d66b]" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
