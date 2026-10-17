'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertOctagon, RotateCcw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[var(--color-bg)] p-4 my-10">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(15,23,42,0.06)] border border-slate-100/60 text-center relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-400 via-red-500 to-red-600" />
        <div className="absolute -right-12 -top-12 w-32 h-32 bg-red-50 rounded-full blur-2xl opacity-60" />
        
        <div className="relative z-10">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-red-50 to-red-100 text-red-500 rounded-[1.2rem] flex items-center justify-center mb-6 shadow-sm border border-red-100/50 -rotate-3">
            <AlertOctagon size={48} strokeWidth={1.5} className="rotate-3 text-red-500" />
          </div>
          
          <h1 className="text-3xl font-black text-slate-800 mb-3">خطای سیستمی!</h1>
          <p className="text-[var(--color-gray-mid)] text-sm mb-8 leading-relaxed">
            متاسفانه در پردازش این صفحه مشکلی به وجود اومد. ما متوجه این خطا شدیم و به زودی برطرفش می‌کنیم.
          </p>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={() => reset()}
              className="flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-slate-800 text-white font-medium rounded-xl hover:bg-slate-900 transition-colors shadow-lg shadow-slate-800/20"
            >
              <RotateCcw size={18} />
              تلاش مجدد
            </button>
            <Link href="/" className="flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-slate-50 text-slate-700 font-medium rounded-xl hover:bg-slate-100 border border-slate-200 transition-colors">
              <Home size={18} />
              برگشت به صفحه اصلی
            </Link>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2 text-sm text-slate-500">
            <span>نیاز به راهنمایی داری؟ تماس با پشتیبانی:</span>
            <a href="tel:09121234567" className="font-bold text-red-600 hover:text-red-700 font-mono" dir="ltr">۰۹۱۲۱۲۳۴۵۶۷</a>
          </div>
        </div>
      </div>
    </div>
  );
}
