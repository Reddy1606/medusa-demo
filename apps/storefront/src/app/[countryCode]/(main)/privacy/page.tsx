import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính sách bảo mật",
  description:
    "Chính sách thu thập, sử dụng, lưu trữ và bảo vệ thông tin cá nhân tại Medusa.",
};

export default function PrivacyPage() {
  return (
    <main className="content-container py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900">
          Chính sách bảo mật
        </h1>

        <p className="mt-4 text-lg leading-8 text-gray-600">
          Trong quá trình cung cấp dịch vụ, Medusa đặc biệt coi trọng việc bảo
          vệ dữ liệu cá nhân và thông tin giao dịch của khách hàng. Chính sách
          này giúp khách hàng hiểu rõ cách chúng tôi thu thập, sử dụng, lưu trữ
          và bảo vệ thông tin cá nhân khi sử dụng dịch vụ của Medusa.
        </p>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900">
            1. Mục đích và phạm vi thu thập thông tin cá nhân
          </h2>

          <div className="mt-6 space-y-5 leading-8 text-gray-600">
            <p>
              Trong quá trình sử dụng dịch vụ trên website hoặc ứng dụng của
              Medusa, chúng tôi có thể thu thập các thông tin sau:
            </p>

            <ul className="list-disc space-y-2 pl-6">
              <li>Họ và tên của khách hàng.</li>
              <li>Tên đăng nhập, nếu có.</li>
              <li>Mật khẩu đăng nhập do khách hàng tự tạo.</li>
              <li>Số điện thoại liên hệ.</li>
              <li>Địa chỉ email.</li>
              <li>
                Thông tin giao nhận như địa chỉ nhận hàng, tên người nhận và số
                điện thoại người nhận.
              </li>
            </ul>

            <p>
              <strong>Thời điểm thu thập:</strong> Khi khách hàng đăng ký sử
              dụng hệ thống dịch vụ, đặt hàng hoặc sử dụng các tính năng trên
              website và ứng dụng của Medusa.
            </p>

            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-5">
              <p className="text-sm leading-7 text-gray-700">
                <strong>Lưu ý:</strong> Trong quá trình giao dịch và thanh toán,
                Medusa chỉ lưu giữ thông tin chi tiết của các đơn hàng đã thanh
                toán, không lưu số tài khoản ngân hàng hoặc số thẻ ngân hàng của
                khách hàng.
              </p>
            </div>

            <p>
              Khách hàng có trách nhiệm tự bảo mật tên đăng nhập, mật khẩu và
              hộp thư điện tử cá nhân. Khi phát hiện hành vi sử dụng trái phép,
              truy cập không được ủy quyền hoặc sự cố bảo mật từ bên thứ ba,
              khách hàng cần thông báo kịp thời cho Medusa để phối hợp xử lý.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900">
            2. Phạm vi sử dụng thông tin
          </h2>

          <div className="mt-6 space-y-5 leading-8 text-gray-600">
            <p>
              Medusa cam kết không sử dụng thông tin cá nhân của khách hàng
              ngoài các mục đích đã nêu. Thông tin thu thập được sử dụng để:
            </p>

            <ul className="list-disc space-y-2 pl-6">
              <li>
                Cung cấp các sản phẩm và dịch vụ mà khách hàng đăng ký sử dụng.
              </li>
              <li>
                Gửi thông báo liên quan đến hoạt động, chương trình khuyến mãi
                và ưu đãi đặc biệt nếu khách hàng đồng ý nhận thông tin.
              </li>
              <li>
                Liên hệ, hỗ trợ và giải quyết các vấn đề phát sinh trong quá
                trình sử dụng dịch vụ.
              </li>
              <li>
                Ngăn chặn và phát hiện hành vi gian lận, can thiệp tài khoản
                hoặc vi phạm an ninh hệ thống.
              </li>
            </ul>

            <p>
              Trong một số trường hợp đặc biệt, khi có yêu cầu hợp pháp từ cơ
              quan nhà nước có thẩm quyền như cơ quan công an hoặc tòa án,
              Medusa có trách nhiệm phối hợp và cung cấp thông tin theo quy
              định pháp luật.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900">
            3. Thời gian lưu trữ thông tin
          </h2>

          <div className="mt-6 space-y-5 leading-8 text-gray-600">
            <p>
              Medusa lưu trữ thông tin cá nhân của khách hàng trong hệ thống
              nội bộ trong thời gian khách hàng sử dụng dịch vụ hoặc cho đến
              khi mục đích thu thập thông tin đã được hoàn thành.
            </p>

            <p>
              Sau khi kết thúc việc cung cấp dịch vụ, thông tin có thể tiếp tục
              được lưu giữ trong một khoảng thời gian nhằm phục vụ việc đối
              soát, giải quyết khiếu nại và tra cứu lịch sử giao dịch.
            </p>

            <p>
              Khách hàng có quyền yêu cầu xóa hoặc ngừng lưu trữ thông tin cá
              nhân theo quy định nếu không còn sử dụng dịch vụ.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900">
            4. Đơn vị thu thập và quản lý thông tin
          </h2>

          <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-6 leading-8 text-gray-600">
            <p>
              <strong>Đơn vị quản lý:</strong> Medusa
            </p>

            <p>
              <strong>Lĩnh vực hoạt động:</strong> Logistics quốc tế và thương
              mại điện tử xuyên biên giới
            </p>

            <p>
              <strong>Địa chỉ:</strong> 65 Đường số 9, Hiệp Bình Phước, Thủ
              Đức, TP.HCM 100000
            </p>

            <p>
              <strong>Hotline hỗ trợ:</strong> +84 961 538 114
            </p>

            <p>
              <strong>Email hỗ trợ:</strong> global.trans@tiximax.net
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900">
            5. Phương thức truy cập và chỉnh sửa dữ liệu cá nhân
          </h2>

          <div className="mt-6 space-y-5 leading-8 text-gray-600">
            <p>
              Khách hàng có quyền truy cập, chỉnh sửa hoặc yêu cầu xóa dữ liệu
              cá nhân bằng các cách sau:
            </p>

            <ul className="list-disc space-y-2 pl-6">
              <li>
                Truy cập tài khoản cá nhân trên website Medusa và trực tiếp
                chỉnh sửa thông tin.
              </li>
              <li>
                Liên hệ hotline hoặc email hỗ trợ được cung cấp tại mục 4 để gửi
                yêu cầu.
              </li>
            </ul>

            <p>
              Medusa sẽ xử lý yêu cầu trong thời gian hợp lý và thông báo kết
              quả cho khách hàng.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900">
            6. Cam kết bảo mật thông tin
          </h2>

          <div className="mt-6 space-y-5 leading-8 text-gray-600">
            <p>Medusa cam kết:</p>

            <ul className="list-disc space-y-2 pl-6">
              <li>
                Bảo vệ thông tin cá nhân của khách hàng theo chính sách này và
                pháp luật Việt Nam về bảo vệ dữ liệu cá nhân.
              </li>
              <li>
                Không bán hoặc trao đổi thông tin cá nhân của khách hàng với
                bên thứ ba vì mục đích thương mại.
              </li>
              <li>
                Khuyến nghị khách hàng sử dụng mật khẩu mạnh, không đăng nhập
                trên thiết bị công cộng và thường xuyên cập nhật phần mềm bảo
                mật.
              </li>
            </ul>

            <p>
              Medusa không chịu trách nhiệm nếu thông tin cá nhân bị tiết lộ do
              lỗi từ phía khách hàng, chẳng hạn như cung cấp mật khẩu cho người
              khác hoặc sử dụng thiết bị không an toàn.
            </p>

            <p>
              Chính sách này chỉ áp dụng đối với thông tin được cung cấp trên
              website hoặc ứng dụng chính thức của Medusa. Thông tin đăng ký
              trên các nền tảng khác không thuộc phạm vi áp dụng của chính sách
              này.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900">
            7. Cơ chế tiếp nhận và giải quyết khiếu nại
          </h2>

          <div className="mt-6 space-y-5 leading-8 text-gray-600">
            <p>
              Khi phát hiện hoặc nghi ngờ thông tin cá nhân bị sử dụng sai mục
              đích hoặc bị xâm phạm, khách hàng vui lòng liên hệ với Medusa
              theo thông tin được cung cấp tại mục 4.
            </p>

            <p>
              Medusa sẽ tiếp nhận, xác minh và phản hồi trong thời gian tối đa
              từ <strong>24 đến 72 giờ</strong>, hoặc theo chính sách đang có
              hiệu lực tại thời điểm xử lý.
            </p>

            <p>
              Khi cần thiết, Medusa sẽ phối hợp với các cơ quan nhà nước có
              thẩm quyền để giải quyết vụ việc.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900">
            8. Hiệu lực và sửa đổi chính sách bảo mật
          </h2>

          <div className="mt-6 space-y-5 leading-8 text-gray-600">
            <p>
              Chính sách này có hiệu lực kể từ ngày được công bố trên website.
            </p>

            <p>
              Medusa có quyền cập nhật, sửa đổi hoặc thay đổi chính sách nhằm
              phù hợp với hoạt động thực tế hoặc yêu cầu pháp luật.
            </p>

            <p>
              Khi có thay đổi quan trọng, Medusa sẽ thông báo rõ ràng trên
              website. Việc khách hàng tiếp tục sử dụng dịch vụ sau thời điểm
              cập nhật được xem là đã đồng ý với nội dung của chính sách bảo mật
              mới.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}