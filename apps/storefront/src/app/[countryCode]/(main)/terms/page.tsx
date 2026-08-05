import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Điều khoản sử dụng",
  description: "Điều khoản áp dụng khi sử dụng dịch vụ của Công ty Cổ phần Medusa",
};

export default function TermsPage() {
  return (
    <main className="content-container py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900">
          Điều khoản sử dụng
        </h1>

        <p className="mt-4 text-lg text-gray-600">
          Các điều khoản áp dụng đối với mọi khách hàng khi sử dụng dịch vụ của
          Công ty Cổ phần Medusa.
        </p>

        {/* Phạm vi áp dụng */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900">
            1. Phạm vi áp dụng
          </h2>

          <div className="mt-6 space-y-5 text-gray-600 leading-8">
            <p>
              Điều khoản này áp dụng cho tất cả khách hàng sử dụng dịch vụ mua
              hộ, đấu giá hộ, vận chuyển quốc tế, khai báo hải quan và lưu kho
              của Công ty Cổ phần Medusa.
            </p>

            <p>
              Khi sử dụng dịch vụ của chúng tôi, khách hàng được xem là đã đọc,
              hiểu và đồng ý với toàn bộ các điều khoản được quy định dưới đây.
            </p>
          </div>
        </section>

        {/* Quy trình */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900">
            2. Quy trình cung cấp dịch vụ
          </h2>

          <div className="mt-6 space-y-5 text-gray-600 leading-8">
            <p>Đơn hàng sẽ được xử lý theo quy trình:</p>

            <div className="rounded-lg bg-gray-50 border border-gray-200 p-5">
              <p className="font-medium text-gray-800">
                Tiếp nhận yêu cầu →
                Báo giá trọn gói →
                Xác nhận & Thanh toán →
                Thực hiện dịch vụ →
                Giao hàng
              </p>
            </div>

            <p>
              Medusa cam kết gửi báo giá trong vòng{" "}
              <strong>01 giờ làm việc</strong> kể từ khi nhận đủ thông tin đơn
              hàng.
            </p>
          </div>
        </section>

        {/* Thanh toán */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900">
            3. Giá dịch vụ & Thanh toán
          </h2>

          <div className="mt-6 space-y-5 text-gray-600 leading-8">
            <p>
              Medusa không thu bất kỳ khoản phí phát sinh nào ngoài báo giá đã
              được xác nhận với khách hàng.
            </p>

            <p>
              Thanh toán được thực hiện thông qua hình thức chuyển khoản ngân
              hàng.
            </p>

            <p>
              Mức giá báo cho khách hàng là{" "}
              <strong>giá trọn gói bằng VNĐ</strong>, bao gồm:
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li>Giá sản phẩm.</li>
              <li>Phí dịch vụ.</li>
              <li>Phí vận chuyển quốc tế.</li>
              <li>Phí thông quan (nếu có).</li>
            </ul>
          </div>
        </section>

        {/* Hàng hóa */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900">
            4. Hàng hóa cấm & Hàng hóa đặc biệt
          </h2>

          <div className="mt-6 space-y-5 text-gray-600 leading-8">
            <p>
              Medusa không vận chuyển các mặt hàng bị cấm theo quy định của
              pháp luật Việt Nam và quốc tế, bao gồm:
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li>Vũ khí, chất nổ.</li>
              <li>Chất cấm.</li>
              <li>Văn hóa phẩm đồi trụy.</li>
              <li>Hàng giả, hàng vi phạm bản quyền.</li>
              <li>Xì gà.</li>
            </ul>

            <p>
              Đối với Laptop, iPad, MacBook và Apple Watch, khách hàng nên liên
              hệ trước với Medusa để được tư vấn khi đặt số lượng lớn.
            </p>

            <p>
              Điện thoại di động được giới hạn tối đa{" "}
              <strong>10 chiếc/tuần/khách hàng</strong> và mỗi thiết bị phải
              được đóng trong hộp riêng.
            </p>

            <p>
              Đối với tuyến Mỹ và Thụy Sĩ, iPad hoặc Laptop đã qua sử dụng phải
              còn hộp riêng của từng sản phẩm mới được nhận vận chuyển.
            </p>

            <p>
              Khách hàng có trách nhiệm khai báo đúng giá trị hàng hóa và cung
              cấp hóa đơn mua hàng khi được yêu cầu.
            </p>

            <p>
              Các mặt hàng mỹ phẩm, thực phẩm chức năng, pin Lithium, hàng lạnh
              hoặc các mặt hàng đặc biệt khác cần liên hệ Medusa để được tư
              vấn trước khi gửi.
            </p>

            <p>
              Với hàng dễ vỡ hoặc dễ móp méo, khách hàng nên trao đổi trước với
              người bán về cách đóng gói. Medusa có cung cấp dịch vụ gia cố như
              đóng thùng carton mới, bọc xốp hoặc đóng kiện gỗ theo bảng phí
              hiện hành.
            </p>
          </div>
        </section>

        {/* Khiếu nại */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900">
            5. Khiếu nại & Bồi thường
          </h2>

          <div className="mt-6 space-y-5 text-gray-600 leading-8">
            <p>
              Medusa tiếp nhận và xử lý khiếu nại trong vòng{" "}
              <strong>03 – 05 ngày làm việc</strong>.
            </p>

            <p>
              Mức bồi thường tối đa bằng giá trị khai báo của hàng hóa và không
              vượt quá giới hạn bảo hiểm của đơn vị vận chuyển.
            </p>

            <p>
              Khiếu nại phải được gửi trong vòng{" "}
              <strong>48 giờ</strong> kể từ thời điểm khách hàng nhận hàng.
            </p>
          </div>
        </section>

        {/* Pháp luật */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900">
            6. Luật áp dụng
          </h2>

          <div className="mt-6 text-gray-600 leading-8">
            <p>
              Các điều khoản này được điều chỉnh theo pháp luật Việt Nam. Mọi
              tranh chấp phát sinh sẽ được giải quyết tại Tòa án nhân dân có
              thẩm quyền tại Thành phố Hồ Chí Minh.
            </p>
          </div>
        </section>

        {/* Liên hệ */}
        <section className="mt-12 rounded-xl border border-gray-200 bg-gray-50 p-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Thông tin liên hệ
          </h2>

          <div className="mt-4 space-y-2 text-gray-600 leading-8">
            <p>
              Nếu có bất kỳ thắc mắc nào về các điều khoản sử dụng dịch vụ,
              vui lòng liên hệ:
            </p>

            <p>
              <strong>Hotline:</strong> +84 961 538 114
            </p>

            <p>
              <strong>Email:</strong> global.trans@tiximax.net
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}