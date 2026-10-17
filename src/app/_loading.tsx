export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-[60vh] bg-[var(--color-bg)]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-[var(--color-border)]"></div>
          <div className="absolute inset-0 rounded-full border-4 border-[var(--color-orange)] border-t-transparent animate-spin"></div>
        </div>
        <p className="text-[var(--color-gray-mid)] font-medium text-sm animate-pulse">در حال بارگذاری...</p>
      </div>
    </div>
  );
}
