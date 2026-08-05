import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Câu hỏi thường gặp",
  description:
    "Giải đáp các câu hỏi thường gặp về dịch vụ mua hộ và vận chuyển quốc tế tại Medusa.",
};

const faqItems = [
  {
    question: "Medusa cung cấp những dịch vụ nào?",
    answer:
      "Medusa cung cấp dịch vụ mua hộ, đấu giá hộ, vận chuyển quốc tế, khai báo hải quan, lưu kho và giao hàng nội địa tại Việt Nam.",
  },
  {
    question: "Medusa hỗ trợ vận chuyển hàng từ những quốc gia nào?",
    answer:
      "Medusa hiện hỗ trợ mua hộ và vận chuyển hàng từ Nhật Bản, Indonesia, Hoa Kỳ, Thụy Sĩ và Philippines về Việt Nam.",
  },
  {
    question: "Làm thế nào để yêu cầu báo giá?",
    answer:
      "Khách hàng gửi đường dẫn sản phẩm, số lượng, thông tin hàng hóa và yêu cầu vận chuyển qua kênh hỗ trợ chính thức của Medusa. Sau khi nhận đủ thông tin, Medusa sẽ gửi báo giá trọn gói bằng VNĐ.",
  },
  {
    question: "Báo giá của Medusa bao gồm những khoản phí nào?",
    answer:
      "Báo giá có thể bao gồm giá sản phẩm, phí dịch vụ, phí vận chuyển quốc tế và phí thông quan nếu có. Medusa không thu thêm chi phí ngoài báo giá đã được khách hàng xác nhận.",
  },
  {
    question: "Quy trình đặt hàng tại Medusa như thế nào?",
    answer:
      "Quy trình gồm: tiếp nhận yêu cầu, gửi báo giá trọn gói, khách hàng xác nhận và thanh toán, Medusa thực hiện mua hàng hoặc nhận hàng tại kho, vận chuyển quốc tế và giao hàng.",
  },
  {
    question: "Tôi thanh toán bằng hình thức nào?",
    answer:
      "Khách hàng thanh toán bằng hình thức chuyển khoản ngân hàng theo thông tin và nội dung thanh toán do Medusa cung cấp.",
  },
  {
    question: "Thời gian vận chuyển mất bao lâu?",
    answer:
      "Thời gian phụ thuộc vào tuyến vận chuyển. Tuyến Nhật Bản về Việt Nam thường mất 7–10 ngày làm việc; Indonesia 7–12 ngày; Philippines 8–14 ngày. Tuyến Hoa Kỳ và Thụy Sĩ được vận chuyển theo lịch cố định.",
  },
  {
    question: "Tôi có thể theo dõi tình trạng đơn hàng không?",
    answer:
      "Có. Khách hàng có thể theo dõi trạng thái đơn hàng thông qua hệ thống tài khoản hoặc liên hệ bộ phận hỗ trợ của Medusa để được cập nhật.",
  },
  {
    question: "Tôi có thể hủy đơn hàng không?",
    answer:
      "Khách hàng có thể hủy đơn và nhận lại 100% tiền đặt cọc nếu Medusa chưa mua hàng. Sau khi hàng đã được mua, đơn chỉ có thể hủy nếu người bán đồng ý nhận lại hàng và hoàn tiền.",
  },
  {
    question: "Đơn hàng Yahoo Auction có thể hủy không?",
    answer:
      "Không. Đơn hàng đấu giá Yahoo Auction không thể hủy sau khi đã đấu giá thành công.",
  },
  {
    question: "Medusa có nhận vận chuyển hàng dễ vỡ không?",
    answer:
      "Có, nhưng hàng dễ vỡ phải được đóng gói an toàn. Medusa cung cấp dịch vụ gia cố có tính phí như thùng carton mới, xốp chống sốc và đóng kiện gỗ.",
  },
  {
    question: "Những mặt hàng nào Medusa không nhận vận chuyển?",
    answer:
      "Medusa không nhận vận chuyển vũ khí, chất nổ, chất cấm, văn hóa phẩm đồi trụy, hàng giả, hàng vi phạm bản quyền, xì gà và các mặt hàng bị cấm theo pháp luật.",
  },
  {
    question: "Ai chịu phí vận chuyển nội địa tại Việt Nam?",
    answer:
      "Khách hàng chịu phí vận chuyển nội địa từ kho Medusa đến địa chỉ nhận hàng, trừ khi có chương trình khuyến mãi hoặc thỏa thuận khác.",
  },
  {
    question: "Tôi cần làm gì khi nhận hàng?",
    answer:
      "Khách hàng cần kiểm tra tình trạng bên ngoài của kiện hàng trước khi ký nhận. Nếu phát hiện hư hỏng hoặc dấu hiệu bất thường, cần ghi nhận với nhân viên giao hàng và liên hệ Medusa ngay.",
  },
  {
    question: "Thời hạn gửi khiếu nại là bao lâu?",
    answer:
      "Khách hàng cần gửi khiếu nại trong vòng 48 giờ kể từ thời điểm nhận hàng và cung cấp đầy đủ hình ảnh, video hoặc tài liệu liên quan.",
  },
  {
    question: "Làm thế nào để liên hệ Medusa?",
    answer:
      "Khách hàng có thể liên hệ hotline +84 961 538 114 hoặc email global.trans@tiximax.net để được hỗ trợ.",
  },
];

export default function FAQPage() {
  return (
    <main className="content-container py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900">
          Câu hỏi thường gặp
        </h1>

        <p className="mt-4 text-lg leading-8 text-gray-600">
          Giải đáp những câu hỏi phổ biến về dịch vụ mua hộ, vận chuyển quốc tế
          và giao nhận hàng hóa tại Medusa.
        </p>

        <div className="mt-12 space-y-4">
          {faqItems.map((item, index) => (
            <details
              key={item.question}
              className="group rounded-xl border border-gray-200 bg-white"
              open={index === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5">
                <h2 className="text-base font-semibold text-gray-900 md:text-lg">
                  {item.question}
                </h2>

                <span className="text-2xl font-light text-gray-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>

              <div className="border-t border-gray-200 px-6 py-5">
                <p className="leading-7 text-gray-600">{item.answer}</p>
              </div>
            </details>
          ))}
        </div>

        <section className="mt-12 rounded-xl border border-gray-200 bg-gray-50 p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Bạn vẫn cần hỗ trợ?
          </h2>

          <p className="mt-3 leading-7 text-gray-600">
            Liên hệ hotline{" "}
            <strong className="text-gray-900">+84 961 538 114</strong> hoặc
            email{" "}
            <strong className="text-gray-900">
              global.trans@tiximax.net
            </strong>{" "}
            để được tư vấn.
          </p>
        </section>
      </div>
    </main>
  );
}