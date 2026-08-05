import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính sách hủy đơn & hoàn tiền",
  description: "Quy định về việc hủy đơn hàng và hoàn tiền tại Medusa",
};

export default function RefundPolicyPage() {
  return (
    <main className="content-container py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900">
          Chính sách hủy đơn & hoàn tiền
        </h1>

        <p className="mt-4 text-lg text-gray-600">
          Quy định và quy trình xử lý việc hủy đơn mua hộ cũng như hoàn trả tiền
          đặt cọc cho khách hàng.
        </p>

        {/* Điều kiện hủy đơn */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900">
            1. Điều kiện hủy đơn hàng
          </h2>

          <div className="mt-6 space-y-6 text-gray-600 leading-8">
            <div>
              <h3 className="font-semibold text-gray-900">
                Trước khi Medusa mua hàng
              </h3>

              <p>
                Khách hàng có thể yêu cầu hủy đơn và sẽ được hoàn lại{" "}
                <strong>100% tiền đặt cọc</strong>.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Sau khi Medusa đã mua hàng
              </h3>

              <p>
                Khách hàng không thể hủy đơn, trừ trường hợp người bán ở nước
                ngoài đồng ý nhận lại hàng và hoàn tiền. Mọi chi phí phát sinh
                từ việc trả hàng sẽ do khách hàng chịu.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Đơn hàng đấu giá Yahoo Auction
              </h3>

              <p>
                Đơn hàng không thể hủy sau khi đã đấu giá thành công.
              </p>
            </div>
          </div>
        </section>

        {/* Chính sách hoàn tiền */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900">
            2. Chính sách hoàn tiền
          </h2>

          <div className="mt-6 space-y-5 text-gray-600 leading-8">
            <p>
              Medusa <strong>100% giá trị đơn hàng</strong> trong
              các trường hợp sau:
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li>
                Hàng hóa bị thất lạc trong quá trình vận chuyển quốc tế thuộc
                trách nhiệm của Medusa.
              </li>

              <li>
                Các trường hợp được quy định trong chính sách bảo hiểm hàng hóa.
              </li>
            </ul>

            <p>
              <strong>Thời gian xử lý hoàn tiền:</strong> Trong vòng{" "}
              <strong>03 – 05 ngày làm việc</strong> kể từ khi kết thúc quá
              trình xác minh sự cố.
            </p>
          </div>
        </section>

        {/* Quy trình hoàn tiền */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900">
            3. Quy trình hoàn tiền
          </h2>

          <ol className="mt-6 list-decimal pl-6 space-y-3 text-gray-600 leading-8">
            <li>
              Khách hàng cung cấp thông tin tài khoản ngân hàng thông qua kênh
              hỗ trợ chính thức của Medusa
            </li>

            <li>
              Medusa kiểm tra lịch sử giao dịch và xác minh thông tin đơn hàng.
            </li>

            <li>
              Sau khi xác minh hoàn tất, Medusa sẽ thực hiện chuyển khoản hoàn
              tiền vào tài khoản của khách hàng.
            </li>
          </ol>
        </section>
      </div>
    </main>
  );
}