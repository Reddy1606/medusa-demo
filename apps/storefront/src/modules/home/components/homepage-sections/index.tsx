import {
  ArrowRight,
  CheckCircle,
  CreditCard,
  GlobeEurope,
  HandTruck,
  LockClosedSolid,
  ShoppingBag,
} from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const services = [
  {
    title: "Mua hàng quốc tế",
    description:
      "Tiếp cận sản phẩm chọn lọc từ nhiều thị trường trên thế giới trong một trải nghiệm liền mạch.",
    icon: GlobeEurope,
  },
  {
    title: "Thanh toán VietQR",
    description:
      "Hoàn tất thanh toán nhanh chóng qua mã VietQR ngay trong quy trình đặt hàng bảo mật.",
    icon: CreditCard,
  },
  {
    title: "Giao hàng minh bạch",
    description:
      "Thông tin chi phí và tiến trình vận chuyển được trình bày rõ ràng từ lúc đặt đến lúc nhận.",
    icon: HandTruck,
  },
  {
    title: "Tra cứu không cần tài khoản",
    description:
      "Dùng email và mã đơn để kiểm tra hành trình hàng hóa bất cứ khi nào bạn cần.",
    icon: LockClosedSolid,
  },
]

export function ServicesSection() {
  return (
    <section
      id="dich-vu"
      className="scroll-mt-24 bg-white px-6 py-20 small:py-28"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b57b00]">
            Dịch vụ trọn vẹn
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-black small:text-5xl">
            Mọi thứ bạn cần cho một đơn hàng quốc tế
          </h2>
        </div>
        <div className="mt-12 grid gap-5 xsmall:grid-cols-2 small:grid-cols-4">
          {services.map(({ title, description, icon: Icon }, index) => (
            <article
              key={title}
              className="group rounded-3xl border border-black/10 bg-white p-6 shadow-[0_8px_30px_rgba(17,17,17,0.05)] transition duration-300 hover:-translate-y-2 hover:border-[#e5b321]/60 hover:shadow-[0_18px_45px_rgba(17,17,17,0.11)]"
            >
              <div className="flex items-start justify-between">
                <div className="rounded-2xl bg-[#fff2bd] p-3 text-black">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-semibold text-black/30">
                  0{index + 1}
                </span>
              </div>
              <h3 className="mt-8 text-lg font-semibold text-black">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-black/60">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

const steps = [
  {
    title: "Chọn sản phẩm",
    text: "Khám phá và chọn món hàng phù hợp.",
    icon: ShoppingBag,
  },
  {
    title: "Đặt hàng",
    text: "Xác nhận thông tin nhận hàng và chi phí.",
    icon: CheckCircle,
  },
  {
    title: "Thanh toán VietQR",
    text: "Quét mã và thanh toán an toàn, nhanh chóng.",
    icon: CreditCard,
  },
  {
    title: "Theo dõi giao hàng",
    text: "Chủ động kiểm tra trạng thái trên từng chặng.",
    icon: HandTruck,
  },
]

export function ProcessSection() {
  return (
    <section
      id="huong-dan"
      className="scroll-mt-24 bg-[#fbf6e9] px-6 py-20 small:py-28"
    >
      <div className="mx-auto max-w-[1280px] rounded-[32px] bg-white p-6 shadow-[0_12px_50px_rgba(17,17,17,0.06)] xsmall:p-10 small:p-14">
        <div className="flex flex-col justify-between gap-6 small:flex-row small:items-end">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b57b00]">
              Quy trình đơn giản
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-black small:text-5xl">
              Từ giỏ hàng quốc tế đến cửa nhà bạn
            </h2>
          </div>
          <LocalizedClientLink
            href="/order-tracking"
            className="inline-flex items-center gap-2 font-semibold text-black underline decoration-[#e8b51e] decoration-2 underline-offset-8 transition hover:text-[#9a6800]"
          >
            Tra cứu đơn hàng <ArrowRight className="h-4 w-4" />
          </LocalizedClientLink>
        </div>
        <ol className="mt-14 grid gap-8 small:grid-cols-4">
          {steps.map(({ title, text, icon: Icon }, index) => (
            <li className="relative flex gap-5 small:block" key={title}>
              {index < steps.length - 1 && (
                <div className="absolute left-6 top-14 h-[calc(100%+16px)] border-l border-dashed border-[#d9a716] small:left-14 small:top-6 small:h-0 small:w-[calc(100%-32px)] small:border-l-0 small:border-t" />
              )}
              <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f4bf28] text-black shadow-md">
                <Icon className="h-5 w-5" />
              </div>
              <div className="small:mt-6">
                <div className="text-xs font-semibold text-[#a87200]">
                  BƯỚC {index + 1}
                </div>
                <h3 className="mt-2 text-lg font-semibold text-black">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-black/55">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function FinalCta() {
  return (
    <section className="bg-[#fbf6e9] px-4 pb-20 small:px-6 small:pb-28">
      <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[32px] bg-[#111111] px-6 py-16 text-center text-white shadow-2xl small:px-16 small:py-24">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full border-[48px] border-[#f4bf28]/10" />
        <div className="absolute -bottom-32 -right-20 h-72 w-72 rounded-full bg-[#f4bf28]/10 blur-2xl" />
        <div className="relative mx-auto max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f4bf28]">
            Sẵn sàng kết nối thế giới?
          </span>
          <h2 className="mt-5 text-3xl font-semibold tracking-[-0.03em] small:text-5xl">
            Bắt đầu đơn hàng của bạn ngay hôm nay
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-7 text-white/60">
            Một trải nghiệm mua sắm quốc tế rõ ràng, thuận tiện và luôn trong
            tầm theo dõi.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 xsmall:flex-row">
            <LocalizedClientLink
              href="/store"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#f4bf28] px-7 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-[#ffd75a] hover:shadow-lg"
            >
              Mua sắm ngay
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/order-tracking"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 px-7 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/10"
            >
              Tra cứu đơn hàng
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </section>
  )
}
