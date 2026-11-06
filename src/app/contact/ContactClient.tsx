'use client';

import { useSearchParams } from 'next/navigation';
import { MapPin, Phone, Mail, Instagram, Send, Clock } from 'lucide-react';
import BreadcrumbBar from '@/components/BreadcrumbBar';
import ContactForm from '@/components/ContactForm';

export default function ContactClient({ settings }: { settings: any }) {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const defaultTab = tab === 'entrust' ? 'entrust' : 'consult';

  const breadcrumbs = [
    { label: 'تماس با بادیز املاک' }
  ];

  return (
    <div className="bg-[var(--color-bg)] pt-[100px] pb-24">
      <BreadcrumbBar items={breadcrumbs} />

      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="bg-white rounded-3xl shadow-sm border border-[var(--color-border)] overflow-hidden flex flex-col lg:flex-row relative">
          
          {/* Left/Contact Info */}
          <div className="w-full lg:w-2/5 md:p-12 p-8 bg-[var(--color-dark-2)] text-white relative overflow-hidden flex flex-col justify-center">
            {/* Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[length:24px_24px]"></div>
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[var(--color-orange)]/20 rounded-full blur-[60px]"></div>

            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-4">راه‌های ارتباطی</h1>
              <p className="text-[var(--color-gray-light)] mb-12 leading-relaxed text-sm">
                گروه مشاورین املاک بادیز آماده ارائه بهترین خدمات مشاوره‌ای و حقوقی ملکی در منطقه کردان البرز به شما عزیزان است.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 backdrop-blur-md">
                    <MapPin className="text-[var(--color-orange)]" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-gray-mid)] mb-1">آدرس دفتر مرکزی</p>
                    <p className="font-medium text-xs text-[var(--color-gray-light)] leading-relaxed">
                      {settings.site_address || 'البرز، ساوجبلاغ، بلوار اصلی کردان، نبش خیابان شهدای کردان، پلاک ۱۰، ساختمان بادیز'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 backdrop-blur-md">
                    <Phone className="text-[var(--color-orange)]" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-gray-mid)] mb-1">تلفن‌های تماس</p>
                    <p className="font-mono font-bold text-lg mb-1" dir="ltr">
                      {settings.site_phone || '۰۹۱۲ - ۰۰۰ ۰۰۰۰'}
                    </p>
                    {settings.site_email && (
                      <p className="text-xs text-[var(--color-gray-light)] font-mono mt-1">
                        {settings.site_email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 backdrop-blur-md">
                    <Clock className="text-[var(--color-orange)]" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-gray-mid)] mb-1">ساعات کاری</p>
                    <p className="font-bold text-sm leading-snug">همه روزه از ساعت ۸ صبح الی ۲۲ شب<br/>(حتی روزهای تعطیل)</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/10 flex gap-4">
                {settings.site_instagram && (
                  <a href={settings.site_instagram} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-[var(--color-orange)] transition-colors border border-white/10">
                    <Instagram size={20} />
                  </a>
                )}
                {settings.site_telegram && (
                  <a href={settings.site_telegram} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-[var(--color-orange)] transition-colors border border-white/10">
                    <Send size={20} />
                  </a>
                )}
                {settings.site_email && (
                  <a href={`mailto:${settings.site_email}`} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-[var(--color-orange)] transition-colors border border-white/10">
                    <Mail size={20} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right/Form */}
          <div className="w-full lg:w-3/5 md:p-12 p-8">
            <h2 className="text-2xl font-bold text-[var(--color-dark)] mb-2">ارسال پیام و ثبت درخواست</h2>
            <p className="text-[var(--color-gray)] mb-8 text-sm">از طریق فرم زیر می‌توانید درخواست مشاوره خود را ثبت کنید یا مشخصات ملک خود را برای فروش/اجاره بسپارید.</p>
            
            <ContactForm inquiryType="general" defaultTab={defaultTab} settings={settings} className="max-w-md" />
          </div>

        </div>
      </div>
    </div>
  );
}
