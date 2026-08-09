"use client"

export default function BrandsError({ reset }: { reset: () => void }) {
  return (
    <main className="bg-[#fbf6e9] px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold text-black">
        Không thể tải thương hiệu
      </h1>
      <p className="mt-3 text-black/55">Vui lòng thử lại sau ít phút.</p>
      <button
        onClick={reset}
        className="mt-7 rounded-full bg-[#f4bf28] px-6 py-3 font-semibold text-black"
      >
        Thử lại
      </button>
    </main>
  )
}
