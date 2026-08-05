import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Thông tin liên hệ của Medusa",
};

export default function ContactPage() {
  return (
    <main className="content-container py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900">
          Liên hệ
        </h1>

        <p className="mt-4 text-lg text-gray-600">
          Thông tin liên hệ của Medusa.
        </p>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900">
            Thông tin
          </h2>

          <div className="mt-6 space-y-5 text-gray-600 leading-8">
            <p>
              <strong>Mã số thuế:</strong> 0402170386
            </p>

            <p>
              <strong>Hotline:</strong> +84 961 538 114
            </p>

            <p>
              <strong>Email:</strong> global.trans@tiximax.net
            </p>

            <p>
              <strong>Trụ sở chính:</strong> 338 Đường Nguyễn Hữu Thọ, Cẩm Lệ,
              Đà Nẵng
            </p>

            <p>
              <strong>Văn phòng:</strong> 65 Đường số 9, Hiệp Bình Phước,
              Thủ Đức, TP.HCM 100000
            </p>

            <p>
              <strong>Mạng lưới:</strong> Việt Nam · Nhật Bản · Indonesia ·
              Hoa Kỳ · Thụy Sĩ · Philippines
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}