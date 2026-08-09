export default function Loading() {
  return (
    <div className="bg-[#fbf6e9] px-6 py-20">
      <div className="mx-auto max-w-[1280px] animate-pulse">
        <div className="h-12 w-64 rounded bg-black/10" />
        <div className="mt-12 grid gap-5 xsmall:grid-cols-2 medium:grid-cols-3 large:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-64 rounded-3xl bg-white" />
          ))}
        </div>
      </div>
    </div>
  )
}
