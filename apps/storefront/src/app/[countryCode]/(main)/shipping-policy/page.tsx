import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính sách vận chuyển",
  description: "Quy định về thời gian, phương thức và trách nhiệm vận chuyển tại Medusa",
};

export default function ShippingPolicyPage() {
  return (
    <main className="content-container py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900">
          Chính sách vận chuyển
        </h1>

        <p className="mt-4 text-lg text-gray-600">
          Quy định chi tiết về thời gian vận chuyển, phương thức giao hàng và
          trách nhiệm của Medusa trong quá trình vận chuyển hàng hóa.
        </p>

        {/* Thời gian vận chuyển */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900">
            1. Thời gian vận chuyển dự kiến
          </h2>

          <div className="mt-6 space-y-4 text-gray-600 leading-8">
            <p>
              <strong>Nhật Bản → Việt Nam:</strong> 7 – 10 ngày làm việc kể từ
              ngày hàng rời kho tại Nhật Bản.
            </p>

            <p>
              <strong>Indonesia → Việt Nam:</strong> 7 – 12 ngày làm việc kể từ
              ngày hàng rời kho tại Jakarta.
            </p>

            <p>
              <strong>Hoa Kỳ / Thụy Sĩ → Việt Nam:</strong> Hàng được vận chuyển
              theo lịch cố định từ ngày <strong>20 đến 25 hằng tháng</strong>.
            </p>

            <p>
              <strong>Philippines → Việt Nam:</strong> 8 – 14 ngày làm việc kể
              từ ngày hàng rời kho tại Manila.
            </p>

            <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
              <p className="text-sm text-gray-700">
                <strong>Lưu ý:</strong> Thời gian trên có thể kéo dài trong các
                trường hợp bất khả kháng như thiên tai, dịch bệnh hoặc hàng hóa
                bị kiểm tra hải quan ngoài kế hoạch.
              </p>
            </div>
          </div>
        </section>

        {/* Đóng gói */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900">
            2. Quy cách đóng gói hàng hóa
          </h2>

          <div className="mt-6 space-y-5 text-gray-600 leading-8">
            <p>
              Tất cả hàng hóa gửi đến kho của Medusa phải được đóng gói theo
              tiêu chuẩn vận chuyển quốc tế.
            </p>

            <p>
              Đối với các mặt hàng dễ vỡ như thủy tinh, gốm sứ hoặc thiết bị
              điện tử, khách hàng cần đóng kiện gỗ hoặc bọc nhiều lớp xốp chống
              sốc trước khi hàng được nhập kho.
            </p>

            <p>
              Medusa cung cấp dịch vụ gia cố hàng hóa có tính phí như:
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li>Thùng carton mới.</li>
              <li>Xốp chống sốc.</li>
              <li>Đóng kiện gỗ.</li>
            </ul>

            <p>
              Các dịch vụ trên giúp đảm bảo hàng hóa được bảo vệ tối đa trong
              quá trình vận chuyển quốc tế.
            </p>
          </div>
        </section>

        {/* Giao hàng */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900">
            3. Giao hàng tại Việt Nam
          </h2>

          <div className="mt-6 space-y-5 text-gray-600 leading-8">
            <p>
              Sau khi hàng về kho tại Hà Nội hoặc Thành phố Hồ Chí Minh,
              Medusa sẽ liên hệ khách hàng để xác nhận địa chỉ giao hàng và
              bàn giao cho đơn vị vận chuyển nội địa như Viettel Post, GHTK,...
            </p>

            <p>
              Chi phí giao hàng nội địa sẽ do khách hàng thanh toán, trừ khi có
              chương trình khuyến mãi hoặc thỏa thuận khác bằng văn bản.
            </p>

            <p>
              Khách hàng có trách nhiệm kiểm tra tình trạng bên ngoài của kiện
              hàng trước khi ký xác nhận với đơn vị giao hàng.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}