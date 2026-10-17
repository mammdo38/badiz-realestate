import Link from 'next/link';
import { Home, Search, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[var(--color-bg)] p-4 my-10">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(15,23,42,0.06)] border border-slate-100/60 text-center relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />
        <div className="absolute -right-12 -top-12 w-32 h-32 bg-orange-50 rounded-full blur-2xl opacity-60" />
        <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-blue-50 rounded-full blur-2xl opacity-60" />

        <div className="relative z-10">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-orange-50 to-orange-100 text-[var(--color-orange)] rounded-[1.2rem] flex items-center justify-center mb-6 shadow-sm border border-orange-100/50 rotate-3">
            <Compass size={48} strokeWidth={1.5} className="-rotate-3 text-orange-500" />
          </div>
          
          <h1 className="text-6xl font-black text-slate-800 mb-2">404</h1>
          <h2 className="text-xl font-bold text-[var(--color-dark)] mb-4">مسیر رو گم کردی؟</h2>
          <p className="text-[var(--color-gray-mid)] text-sm mb-8 leading-relaxed">
            صفحه‌ای که دنبالش بودی پیدا نشد. ممکنه آدرس رو اشتباه وارد کرده باشی یا این صفحه پاک شده باشه.
          </p>
          
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-[var(--color-primary)] text-white font-medium rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/25">
              <Home size={18} />
              برگشت به صفحه اصلی
            </Link>
            <Link href="/search-results" className="flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-slate-50 text-slate-700 font-medium rounded-xl hover:bg-slate-100 border border-slate-200 transition-colors">
              <Search size={18} />
              جستجوی آگهی‌ها
            </Link>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2 text-sm text-slate-500">
            <span>نیاز به راهنمایی داری؟ تماس با ما:</span>
            <a href="tel:09121234567" className="font-bold text-orange-600 hover:text-orange-700 font-mono" dir="ltr">۰۹۱۲۱۲۳۴۵۶۷</a>
          </div>
        </div>
      </div>
    </div>
  );
}
