'use client';

import { useState, FormEvent } from 'react';
import { CheckCircle, Loader2, Phone, MessageCircle } from 'lucide-react';
import { cn } from '../utils';

interface Props {
  inquiryType: 'general' | 'listing' | 'consult';
  listingId?: string;
  buttonText?: string;
  className?: string;
  buttonStyle?: 'solid' | 'outline';
  defaultTab?: 'consult' | 'entrust';
  settings?: any;
  isDark?: boolean;
}

const WhatsAppIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.455h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const TelegramIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15.74-.79 4.46-1.11 6.17-.14.72-.41.96-.66.98-.56.05-1-.37-1.54-.72-.85-.56-1.33-.9-2.15-1.44-1-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.35-.49.97-.74 3.79-1.65 6.32-2.73 7.59-3.25 3.61-1.48 4.36-1.74 4.85-1.75.11 0 .35.03.5.16.13.11.17.26.18.38.01.07.01.21 0 .33z"/>
  </svg>
);

export default function ContactForm({ inquiryType, listingId, buttonText, className, buttonStyle = 'solid', defaultTab = 'consult', settings, isDark }: Props) {
  const [activeTab, setActiveTab] = useState<'consult' | 'entrust'>(inquiryType === 'listing' ? 'consult' : defaultTab);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  // General/Consult form fields
  const [formData, setFormData] = useState({ name: '', phone: '', message: '', deal_interest: '' });

  const labelClass = isDark ? "text-xs font-semibold text-slate-300 text-right block mb-1" : "text-sm font-medium text-[var(--color-dark)] block mb-1.5";
  const inputClass = isDark 
    ? "w-full px-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 text-sm" 
    : "w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all text-sm";
  const selectClass = isDark 
    ? "w-full px-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 text-sm appearance-none" 
    : "w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all text-sm appearance-none";

  // Entrust (Submit Property) form fields
  const [entrustData, setEntrustData] = useState({
    name: '',
    phone: '',
    propertyType: 'villa',
    dealType: 'sell',
    region: '',
    size: '',
    price: '',
    description: ''
  });
  
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const isEntrust = activeTab === 'entrust';
    const nameVal = isEntrust ? entrustData.name : formData.name;
    const phoneVal = isEntrust ? entrustData.phone : formData.phone;

    // Validation
    if (!nameVal.trim() || !phoneVal.trim()) {
      setErrorMsg('لطفا نام و شماره تماس خود را وارد کنید.');
      setStatus('error');
      return;
    }
    
    if (!/^09\d{9}$/.test(phoneVal.trim()) && !/^۰۹\d{9}$/.test(phoneVal.trim())) {
      setErrorMsg('شماره موبایل نامعتبر است (مثال: ۰۹۱۲۳۴۵۶۷۸۹).');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    let finalMessage = '';
    if (isEntrust) {
      const typeTranslations: Record<string, string> = { villa: 'ویلا', land: 'زمین', garden: 'باغ', apartment: 'آپارتمان', other: 'سایر' };
      const dealTranslations: Record<string, string> = { sell: 'فروش', annual_rent: 'اجاره سالیانه', daily_rent: 'اجاره روزانه', other: 'سایر' };
      
      finalMessage = `--- ثبت ملک جدید ---
نوع ملک: ${typeTranslations[entrustData.propertyType] || entrustData.propertyType}
نوع معامله: ${dealTranslations[entrustData.dealType] || entrustData.dealType}
آدرس/منطقه: ${entrustData.region || 'نامشخص'}
متراژ: ${entrustData.size ? `${entrustData.size} متر` : 'نامشخص'}
قیمت پیشنهادی: ${entrustData.price ? `${entrustData.price} تومان` : 'توافقی'}
توضیحات: ${entrustData.description || 'ندارد'}`;
    } else {
      finalMessage = formData.message || 'درخواست مشاوره ملکی';
    }

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nameVal,
          phone: phoneVal,
          message: finalMessage,
          inquiryType: isEntrust ? 'consult' : inquiryType,
          listingId,
          deal_interest: isEntrust ? 'ثبت ملک' : formData.deal_interest || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'خطا در ثبت درخواست. لطفا دوباره تلاش کنید.');
      }
      setStatus('success');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'خطا در ارتباط با سرور');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className={cn("p-6 text-center space-y-3 bg-green-50 rounded-2xl border border-green-100", className)}>
        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
          <CheckCircle size={28} />
        </div>
        <h4 className="font-bold text-green-800 text-lg">درخواست شما ثبت شد</h4>
        <p className="text-green-700 text-sm">همکاران ما به زودی با شما تماس خواهند گرفت.</p>
      </div>
    );
  }

  const showTabs = inquiryType !== 'listing';
  const defaultBtnText = activeTab === 'entrust' ? 'ثبت و سپردن ملک' : (buttonText || 'ثبت درخواست');

  return (
    <div className={cn("w-full", className)}>
      {showTabs && (
        <div className={isDark ? "flex bg-slate-800/80 p-1 rounded-xl mb-4 border border-slate-700" : "flex bg-[var(--color-bg)] p-1 rounded-xl mb-6 border border-[var(--color-border)]"}>
          <button
            type="button"
            onClick={() => { setActiveTab('consult'); setErrorMsg(''); }}
            className={cn(
              "flex-1 text-center py-2 rounded-lg text-xs font-bold transition-all",
              activeTab === 'consult' 
                ? (isDark ? "bg-emerald-600 text-white shadow-sm" : "bg-white text-[var(--color-primary-hover)] shadow-sm")
                : (isDark ? "text-slate-400 hover:text-white" : "text-[var(--color-gray)] hover:text-[var(--color-dark)]")
            )}
          >
            درخواست مشاوره
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('entrust'); setErrorMsg(''); }}
            className={cn(
              "flex-1 text-center py-2 rounded-lg text-xs font-bold transition-all",
              activeTab === 'entrust' 
                ? (isDark ? "bg-emerald-600 text-white shadow-sm" : "bg-white text-[var(--color-primary-hover)] shadow-sm")
                : (isDark ? "text-slate-400 hover:text-white" : "text-[var(--color-gray)] hover:text-[var(--color-dark)]")
            )}
          >
            سپردن و ثبت ملک
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {status === 'error' && (
          <div className="text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 font-medium">
            {errorMsg}
          </div>
        )}

        {activeTab === 'consult' ? (
          <>
            <div>
              <label className={labelClass}>نام و نام خانوادگی</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData(f => ({...f, name: e.target.value}))}
                className={inputClass}
                placeholder="نام خود را وارد کنید..."
              />
            </div>
            <div>
              <label className={labelClass}>شماره موبایل</label>
              <input 
                type="tel" 
                dir="ltr"
                value={formData.phone}
                onChange={e => setFormData(f => ({...f, phone: e.target.value}))}
                className={cn(inputClass, "text-right")}
                placeholder="0912..."
              />
            </div>
            {inquiryType !== 'listing' && (
              <div>
                <label className={labelClass}>هدف از مشاوره</label>
                <select
                  value={formData.deal_interest}
                  onChange={e => setFormData(f => ({...f, deal_interest: e.target.value}))}
                  className={selectClass}
                >
                  <option value="" className={isDark ? "text-slate-900 bg-white" : ""}>انتخاب کنید...</option>
                  <option value="خرید" className={isDark ? "text-slate-900 bg-white" : ""}>خرید ملک</option>
                  <option value="فروش" className={isDark ? "text-slate-900 bg-white" : ""}>فروش و سپردن ملک</option>
                  <option value="سرمایه‌گذاری" className={isDark ? "text-slate-900 bg-white" : ""}>سرمایه‌گذاری در کردان</option>
                  <option value="سایر" className={isDark ? "text-slate-900 bg-white" : ""}>سایر موارد</option>
                </select>
              </div>
            )}
            <div>
              <label className={labelClass}>
                {inquiryType === 'listing' ? 'توضیحات یا سوال شما (اختیاری)' : 'پیام شما (اختیاری)'}
              </label>
              <textarea 
                rows={2}
                value={formData.message}
                onChange={e => setFormData(f => ({...f, message: e.target.value}))}
                className={cn(inputClass, "resize-none")}
                placeholder="توضیحات بیشتر..."
              />
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--color-dark)]">نام و نام خانوادگی مالِک</label>
                <input 
                  type="text" 
                  value={entrustData.name}
                  onChange={e => setEntrustData(f => ({...f, name: e.target.value}))}
                  className="w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all text-sm"
                  placeholder="نام خود را وارد کنید..."
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--color-dark)]">شماره موبایل مالک</label>
                <input 
                  type="tel" 
                  dir="ltr"
                  value={entrustData.phone}
                  onChange={e => setEntrustData(f => ({...f, phone: e.target.value}))}
                  className="w-full text-right px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all text-sm"
                  placeholder="0912..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--color-dark)]">نوع ملک</label>
                <select
                  value={entrustData.propertyType}
                  onChange={e => setEntrustData(f => ({...f, propertyType: e.target.value}))}
                  className="w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all text-sm"
                >
                  <option value="villa">ویلا</option>
                  <option value="land">زمین</option>
                  <option value="garden">باغ / باغچه</option>
                  <option value="apartment">آپارتمان</option>
                  <option value="other">سایر</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--color-dark)]">نوع معامله</label>
                <select
                  value={entrustData.dealType}
                  onChange={e => setEntrustData(f => ({...f, dealType: e.target.value}))}
                  className="w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all text-sm"
                >
                  <option value="sell">خرید و فروش</option>
                  <option value="annual_rent">اجاره سالیانه</option>
                  <option value="daily_rent">اجاره روزانه (ویلای روزانه)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[var(--color-dark)]">منطقه / آدرس ملک</label>
              <input 
                type="text" 
                value={entrustData.region}
                onChange={e => setEntrustData(f => ({...f, region: e.target.value}))}
                className="w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all text-sm"
                placeholder="مثال: کردان شمالی، سهیلیه، تهراندشت..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--color-dark)]">متراژ زمین یا بنا (متر مربع)</label>
                <input 
                  type="number" 
                  value={entrustData.size}
                  onChange={e => setEntrustData(f => ({...f, size: e.target.value}))}
                  className="w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all text-sm"
                  placeholder="مثال: ۵۰۰"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--color-dark)]">قیمت کل پیشنهادی (تومان)</label>
                <input 
                  type="text" 
                  value={entrustData.price}
                  onChange={e => setEntrustData(f => ({...f, price: e.target.value}))}
                  className="w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all text-sm"
                  placeholder="مثال: ۱۰ میلیارد یا توافقی"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[var(--color-dark)]">توضیحات و امکانات بیشتر (اختیاری)</label>
              <textarea 
                rows={2}
                value={entrustData.description}
                onChange={e => setEntrustData(f => ({...f, description: e.target.value}))}
                className="w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all text-sm resize-none"
                placeholder="سن بنا، سند تک‌برگ، استخر و..."
              />
            </div>
          </>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-2 w-full">
          <button 
            type="submit" 
            disabled={status === 'loading'}
            className={cn(
              "flex-1 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 w-full",
              buttonStyle === 'solid' 
                ? "bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white shadow-md hover:shadow-lg"
                : "bg-white border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
            )}
          >
            {status === 'loading' ? <Loader2 className="animate-spin" size={20} /> : defaultBtnText}
          </button>

          {showTabs && (
            <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
              <a 
                href={`tel:${(settings?.site_phone || '02100000000').replace(/\D/g, '')}`} 
                className="flex-1 sm:flex-none flex flex-col items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2.5 rounded-xl transition-all border border-gray-200 min-w-[130px]"
                title="تماس مستقیم"
              >
                <Phone size={16} className="text-[var(--color-primary)] mb-0.5" />
                <span className="font-bold font-mono text-[11px] tracking-tight">{settings?.site_phone || '۰۲۱-۰۰۰۰۰۰۰۰'}</span>
                <span className="text-[8px] text-gray-400 font-bold">تلفن تماس</span>
              </a>
              {settings?.site_whatsapp && (
                <a 
                  href={settings.site_whatsapp} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="bg-green-50 hover:bg-green-100 border border-green-200 text-green-600 px-3 py-2.5 rounded-xl transition-all flex flex-col items-center justify-center min-w-[64px]"
                  title="گفتگو در واتس‌اپ"
                >
                  <WhatsAppIcon className="w-5 h-5 text-green-600 mb-0.5" />
                  <span className="text-[9px] font-bold">واتس‌اپ</span>
                </a>
              )}
              {settings?.site_telegram && (
                <a 
                  href={settings.site_telegram} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-500 px-3 py-2.5 rounded-xl transition-all flex flex-col items-center justify-center min-w-[64px]"
                  title="پیام در تلگرام"
                >
                  <TelegramIcon className="w-4.5 h-4.5 text-blue-500 mb-0.5" />
                  <span className="text-[9px] font-bold">تلگرام</span>
                </a>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
