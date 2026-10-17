import Link from 'next/link';
import { MapPin, Phone, Instagram, Send } from 'lucide-react';
import { regions } from '../data';
import LogoIcon from './LogoIcon';

export default function Footer({ settings }: { settings?: any }) {
  const siteName = settings?.site_name || 'بادیز املاک';
  const tagline = settings?.site_tagline || 'دپارتمان تخصصی کردان';
  return (
    <footer className="bg-[var(--color-dark)] pt-16 pb-6 text-[var(--color-gray-mid)]">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
        {/* Brand & Desc */}
        <div>
          <Link href="/" className="inline-block mb-6">
            <div className="w-28 h-28 bg-white rounded-2xl flex items-center justify-center shadow-sm">
              <LogoIcon className="h-20 w-auto text-[var(--color-dark)]" />
            </div>
          </Link>
          <p className="text-sm leading-relaxed mb-6">
            {settings?.footer_desc || 'گروه مشاورین املاک بادیز با بیش از یک دهه تجربه در منطقه کردان البرز، همراه مطمئن شما در معاملات ملکی است.'}
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-bold mb-6 flex items-center gap-2">
            <span className="w-1 h-4 bg-[var(--color-orange)] rounded-full"></span>
            دسترسی سریع
          </h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/#listings" className="hover:text-white transition">آگهی‌های منتخب</Link></li>
            <li><Link href="/magazine" className="hover:text-white transition">راهنمای خرید ملک</Link></li>
            <li><Link href="/contact" className="hover:text-white transition">تماس با ما</Link></li>
            <li><Link href="/#entrust" className="hover:text-[var(--color-orange)] transition">سپردن ملک</Link></li>
            <li><a href="/admin" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-blue)] transition font-bold">ورود به پنل ادمین</a></li>
          </ul>
        </div>

        {/* Regions */}
        <div>
          <h3 className="text-white font-bold mb-6 flex items-center gap-2">
            <span className="w-1 h-4 bg-[var(--color-green)] rounded-full"></span>
            مناطق کردان
          </h3>
          <ul className="space-y-3 text-sm">
            {Object.values(regions).map(r => (
              <li key={r.slug}>
                <Link href={`/${r.slug}`} className="hover:text-white transition flex items-center gap-2">
                  <span className="opacity-50">{r.emoji}</span> {r.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-bold mb-6 flex items-center gap-2">
            <span className="w-1 h-4 bg-[var(--color-blue)] rounded-full"></span>
            ارتباط با ما
          </h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-[var(--color-orange)] shrink-0 mt-0.5" />
              <span>{settings?.site_address || 'البرز، ساوجبلاغ، بلوار اصلی کردان، نبش خیابان شهدای کردان، پلاک ۱۰'}</span>
            </li>
            <li className="flex items-center gap-3 font-mono" dir="ltr">
              <span>{settings?.site_phone || '۰۲۱ - ۰۰۰۰۰۰۰۰'}</span>
              <Phone size={18} className="text-[var(--color-orange)]" />
            </li>
            <li className="flex gap-4 pt-2">
              {settings?.site_instagram && (
                <a href={settings.site_instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[var(--color-charcoal)] flex items-center justify-center text-white hover:bg-[var(--color-orange)] transition">
                  <Instagram size={20} />
                </a>
              )}
              {settings?.site_telegram && (
                <a href={settings.site_telegram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[var(--color-charcoal)] flex items-center justify-center text-white hover:bg-[var(--color-orange)] transition">
                  <Send size={20} />
                </a>
              )}
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-[var(--color-charcoal)] flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <p>© ۱۴۰۵ تمام حقوق برای {siteName} محفوظ است.</p>
        <p className="text-slate-400">
          طراح و توسعه‌دهنده سایت: <a href="https://t.me/M_h_p_83" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-[var(--color-orange)] transition font-medium">ارتباط در تلگرام</a>
        </p>
      </div>
    </footer>
  );
}
