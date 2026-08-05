import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Về chúng tôi",
  description:
    "Medusa - Cầu nối giao thương toàn cầu dành cho khách hàng và doanh nghiệp Việt Nam.",
};

const commitments = [
  {
    title: "Minh bạch & Chính trực",
    description:
      "Xây dựng uy tín bằng sự minh bạch và thực hiện đúng mọi cam kết với khách hàng.",
  },
  {
    title: "Phục vụ từ trái tim",
    description:
      "Lắng nghe bằng sự thấu hiểu và phục vụ tận tâm để khách hàng luôn an tâm.",
  },
  {
    title: "Phát triển con người",
    description:
      "Tạo điều kiện để mỗi thành viên không ngừng học hỏi, trưởng thành và phát triển.",
  },
  {
    title: "Đúng thời gian & Lịch trình",
    description:
      "Kiểm soát thời gian trên toàn bộ hành trình để giảm thiểu tối đa sự chậm trễ.",
  },
];

const coreValues = [
  {
    title: "Tử tế làm nền tảng",
    description:
      "Xây dựng niềm tin bằng sự chính trực, minh bạch và trách nhiệm trong mọi cam kết.",
  },
  {
    title: "Phát triển con người",
    description:
      "Mỗi thử thách là cơ hội để nâng cao năng lực, kỹ năng và tinh thần phối hợp.",
  },
  {
    title: "Tôn trọng & Trao quyền",
    description:
      "Tạo môi trường chủ động, nơi mỗi cá nhân đều có thể đóng góp và giải quyết vấn đề.",
  },
  {
    title: "Dẫn dắt bằng trái tim",
    description:
      "Đặt con người, khách hàng và đội ngũ vào trung tâm của mọi quyết định.",
  },
  {
    title: "Cân bằng con người và lợi nhuận",
    description:
      "Tăng trưởng phải đi cùng trách nhiệm, niềm tin và giá trị bền vững.",
  },
  {
    title: "Văn hóa học hỏi",
    description:
      "Không ngừng học tập, thích nghi và đổi mới trong thị trường logistics toàn cầu.",
  },
];

const milestones = [
  {
    year: "2022",
    title: "Thành lập tại Việt Nam",
    description:
      "Medusa triển khai dịch vụ mua hộ, vận chuyển và logistics xuyên biên giới.",
  },
  {
    year: "2023",
    title: "Thành lập kho tại Indonesia",
    description:
      "Medusa xây dựng kho tại Jakarta để tiếp nhận, gom hàng và tối ưu vận chuyển.",
  },
  {
    year: "2024",
    title: "Mở tuyến Indonesia – Việt Nam",
    description:
      "Tuyến vận chuyển mới giúp hoạt động thương mại nhanh hơn, minh bạch hơn và tiết kiệm hơn.",
  },
  {
    year: "2025",
    title: "Mở rộng các tuyến quốc tế",
    description:
      "Medusa mở rộng các tuyến Indonesia – Philippines và Indonesia – Nhật Bản.",
  },
  {
    year: "2026",
    title: "Thành lập tại Philippines",
    description:
      "Medusa mở văn phòng tại Philippines, tăng cường kết nối logistics tại Đông Nam Á.",
  },
];

const markets = [
  "Việt Nam",
  "Indonesia",
  "Philippines",
  "Nhật Bản",
  "Thụy Sĩ",
];

const statistics = [
  { value: "5", label: "Kho hàng thuộc sở hữu công ty" },
  { value: "4", label: "Năm kinh nghiệm" },
  { value: "2.500", label: "Khách hàng" },
  { value: "4", label: "Thị trường quốc tế" },
];

export default function AboutPage() {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="content-container py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-600">
              Medusa
            </p>

            <h1 className="mt-4 text-4xl font-bold text-gray-900 md:text-6xl">
              Về chúng tôi
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600 md:text-xl">
              Medusa là cầu nối giao thương toàn cầu, giúp khách hàng
              và doanh nghiệp Việt Nam tiếp cận thế giới.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="content-container py-16 md:py-24">
        <div className="mx-auto max-w-4xl space-y-6 text-gray-600 leading-8">
          <p>
            Chúng tôi đang góp phần định hình tương lai của ngành logistics,
            kết nối dòng chảy thương mại toàn cầu bằng các giải pháp đột phá và
            bền vững. Medusa liên tục đổi mới công nghệ và tinh gọn quy trình
            để giúp khách hàng tiếp cận thị trường toàn cầu một cách đơn giản,
            minh bạch và hiệu quả.
          </p>

          <p>
            Lấy khách hàng làm trung tâm và sự tử tế làm nền tảng, Medusa cam
            kết tuân thủ các tiêu chuẩn vận hành nghiêm ngặt. Với sự tận tâm và
            hiểu biết sâu sắc về thị trường, đội ngũ chuyên gia của chúng tôi
            luôn nỗ lực tối ưu từng chặng trong hành trình vận chuyển, mang đến
            sự an tâm trọn vẹn cho khách hàng.
          </p>
        </div>
      </section>

      {/* CEO Quote */}
      <section className="bg-gray-950 py-16 text-white md:py-24">
        <div className="content-container">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">
              CEO Nguyễn Ngọc Hoàng Anh
            </p>

            <blockquote className="mt-6 text-2xl font-medium leading-10 md:text-3xl md:leading-[1.5]">
              “Chúng tôi tin rằng logistics không chỉ là vận chuyển hàng hóa,
              mà còn là kết nối con người, cơ hội và giá trị. Medusa mong muốn
              trở thành cầu nối giao thương toàn cầu. Khi khách hàng phát triển,
              Medusa cũng phát triển và cùng nhau tạo ra nhiều giá trị hơn cho
              xã hội.”
            </blockquote>
          </div>
        </div>
      </section>

      {/* Commitments */}
      <section className="content-container py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
              Cross-border, zero worry
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
              Cam kết của Medusa
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {commitments.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-gray-200 p-7"
              >
                <h3 className="text-xl font-semibold text-gray-900">
                  {item.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-orange-50 py-16 md:py-24">
        <div className="content-container">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Tầm nhìn và sứ mệnh
            </h2>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <article className="rounded-2xl bg-white p-7">
                <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">
                  Tầm nhìn
                </p>
                <p className="mt-4 leading-7 text-gray-600">
                  Trở thành thương hiệu logistics xuyên biên giới hàng đầu, kết
                  nối Việt Nam với thế giới bằng công nghệ, dịch vụ và hệ sinh
                  thái vận hành toàn diện.
                </p>
              </article>

              <article className="rounded-2xl bg-white p-7">
                <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">
                  Sứ mệnh
                </p>
                <p className="mt-4 leading-7 text-gray-600">
                  Giúp cá nhân và doanh nghiệp tiếp cận thị trường toàn cầu dễ
                  dàng hơn thông qua các giải pháp logistics, thanh toán và
                  hoàn tất đơn hàng xuyên biên giới.
                </p>
              </article>

              <article className="rounded-2xl bg-white p-7">
                <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">
                  Triết lý kinh doanh
                </p>
                <p className="mt-4 leading-7 text-gray-600">
                  Lấy khách hàng làm trung tâm, sự tử tế làm nền tảng và công
                  nghệ làm động lực tăng trưởng. Thành công được đo bằng giá trị
                  tạo ra cho khách hàng, nhân viên và xã hội.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="content-container py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Giá trị cốt lõi
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {coreValues.map((value) => (
              <article
                key={value.title}
                className="rounded-2xl border border-gray-200 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {value.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* History */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="content-container">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Lịch sử hình thành và phát triển
            </h2>

            <div className="mt-12 space-y-8">
              {milestones.map((milestone) => (
                <article
                  key={milestone.year}
                  className="grid gap-4 border-l-2 border-orange-500 pl-6 md:grid-cols-[100px_1fr]"
                >
                  <p className="text-2xl font-bold text-orange-600">
                    {milestone.year}
                  </p>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {milestone.title}
                    </h3>

                    <p className="mt-2 leading-7 text-gray-600">
                      {milestone.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Network */}
      <section className="content-container py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Mạng lưới logistics
          </h2>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {markets.map((market) => (
              <div
                key={market}
                className="rounded-xl border border-gray-200 px-5 py-8 text-center"
              >
                <p className="text-sm uppercase tracking-wider text-gray-500">
                  Logistics Network
                </p>
                <p className="mt-3 text-lg font-semibold text-gray-900">
                  {market}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="bg-gray-950 py-16 text-white md:py-20">
        <div className="content-container">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">
            Cross-border, zero worry
          </p>

          <div className="mx-auto mt-10 grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {statistics.map((statistic) => (
              <div key={statistic.label} className="text-center">
                <p className="text-4xl font-bold md:text-5xl">
                  {statistic.value}
                </p>
                <p className="mt-3 text-gray-300">{statistic.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI */}
      <section className="content-container py-16 md:py-24">
        <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-gray-50 p-8 md:p-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">
            Powered by AI
          </p>

          <h2 className="mt-3 text-3xl font-bold text-gray-900">
            Chiến lược AI Automation nâng tầm trải nghiệm khách hàng
          </h2>

          <p className="mt-6 leading-8 text-gray-600">
            Medusa ứng dụng AI Automation để tối ưu hoạt động tư vấn, báo giá,
            theo dõi đơn hàng, chăm sóc khách hàng và xử lý dữ liệu. Mục tiêu là
            giảm thời gian chờ, tăng độ chính xác và mang đến trải nghiệm
            logistics minh bạch hơn cho khách hàng.
          </p>
        </div>
      </section>
    </main>
  );
}