import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import MapWrapper from '@/components/MapWrapper';

export const metadata: Metadata = {
  title: 'نقشه تعاملی مناطق کردان | راهنمای کامل محله‌های کردان کرج',
  description: 'نقشه کامل و تعاملی مناطق مختلف کردان شامل کردان شمالی (برغان، آغشت، کوهسار) و کردان جنوبی (سهیلیه، تهراندشت، طاووسیه). همراه با آگهی‌های فروش ویلا و زمین.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://badizvilla.ir'}/map`,
  }
};

export default function MapPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            نقشه تعاملی <span className="text-transparent bg-clip-text bg-gradient-to-l from-orange-600 to-amber-500">مناطق کردان</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            با استفاده از نقشه زیر، تمام مناطق و روستاهای مهم کردان را بشناسید، موقعیت آن‌ها را ببینید و با یک کلیک آگهی‌های ویلا و زمین هر منطقه را بررسی کنید.
          </p>
        </div>

        {/* The Map Component */}
        <div className="mb-20">
          <MapWrapper />
        </div>

        {/* SEO Content Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 prose prose-slate prose-lg max-w-none text-slate-900">
            <h2 className="text-2xl font-black text-slate-900 mb-6">آشنایی با محله‌های کردان (کردان کجاست؟)</h2>
            <p className="leading-loose mb-8">
              منطقه کردان به دلیل وسعت زیاد و تنوع آب‌وهوایی، به دو بخش کلی <strong>کردان شمالی</strong> و <strong>کردان جنوبی</strong> تقسیم می‌شود. اگر قصد خرید ویلا در کردان را دارید، شناخت این مناطق به شما کمک می‌کند تا بهترین تصمیم را بر اساس نیاز و بودجه خود بگیرید.
            </p>

            <div className="grid md:grid-cols-2 gap-12 mt-12">
              {/* Northern Kordan */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🏔️</span>
                  <h3 className="text-xl font-bold m-0 text-slate-900">کردان شمالی (کوهستانی)</h3>
                </div>
                <p className="text-slate-600 leading-relaxed mb-6">
                  این مناطق در دامنه کوه‌های البرز و شمال اتوبان کرج-قزوین قرار دارند. آب‌وهوای خنک‌تر، طبیعت کوهستانی، باغ‌های گردو و رودخانه‌های خروشان از ویژگی‌های بارز این منطقه است.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">📍</span>
                    <div>
                      <strong>روستای کردان:</strong> هسته اصلی و قدیمی منطقه با دسترسی عالی.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">📍</span>
                    <div>
                      <strong>برغان:</strong> روستای توریستی با طبیعت بکر و آب‌وهوای ییلاقی.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">📍</span>
                    <div>
                      <strong>کوهسار و آغشت:</strong> مناسب برای ساخت ویلاهای لوکس کوهستانی.
                    </div>
                  </li>
                </ul>
              </div>

              {/* Southern Kordan */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🌿</span>
                  <h3 className="text-xl font-bold m-0 text-slate-900">کردان جنوبی (دشتی و شهرکی)</h3>
                </div>
                <p className="text-slate-600 leading-relaxed mb-6">
                  این مناطق در جنوب اتوبان واقع شده و از دشت‌های وسیع و هموار تشکیل شده‌اند. بخش عمده‌ای از شهرک‌های ویلایی مدرن و لوکس در این منطقه قرار دارند.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">📍</span>
                    <div>
                      <strong>سهیلیه:</strong> منطقه‌ای وسیع با شهرک‌های معروفی مانند زعفرانیه.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">📍</span>
                    <div>
                      <strong>تهراندشت:</strong> نگین سرسبز کردان جنوبی، ایده‌آل برای سرمایه‌گذاری ملکی.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">📍</span>
                    <div>
                      <strong>طاووسیه و افشاریه:</strong> شهرک‌های اصیل، با نگهبانی و امنیت بسیار بالا.
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <hr className="my-12 border-slate-200" />
            
            <h2 className="text-2xl font-black text-slate-900 mb-6">کدام منطقه برای خرید ویلا بهتر است؟</h2>
            <p className="leading-loose mb-6">
              انتخاب بین کردان شمالی و جنوبی کاملاً به <strong>هدف شما</strong> بستگی دارد. اگر به دنبال آرامش مطلق، آب‌وهوای خنک تابستانی و کوچه باغ‌های قدیمی هستید، <strong>کردان شمالی</strong> و روستاهایی مثل برغان انتخاب فوق‌العاده‌ای هستند. 
            </p>
            <p className="leading-loose">
              اما اگر به دنبال ویلاهای مدرن در شهرک‌های دارای نگهبانی ۲۴ ساعته، امنیت بالا برای استفاده‌های مکرر آخر هفته و همچنین نقدشوندگی سریع‌تر سرمایه خود هستید، مناطق <strong>کردان جنوبی</strong> مانند سهیلیه و تهراندشت گزینه‌های منطقی‌تری به شمار می‌روند.
            </p>

            <div className="mt-12 text-center">
              <Link href="/search-results" className="inline-flex items-center justify-center bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/30">
                مشاهده تمام آگهی‌های ویلا در کردان
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
