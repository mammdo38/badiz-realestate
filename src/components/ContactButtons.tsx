'use client';

import { useState } from 'react';
import { PhoneCall, Copy, Check, MessageCircle, Send } from 'lucide-react';
import { cn } from '@/utils';

interface Props {
  phone: string;
  title: string;
  label: string;
  className?: string;
  buttonSize?: 'md' | 'lg';
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

export default function ContactButtons({ phone, title, label, className, buttonSize = 'md' }: Props) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappUrl = `https://wa.me/${phone.replace(/^0/, '98')}?text=سلام، در مورد آگهی "${title}" سوال داشتم.`;
  const telegramUrl = `https://t.me/+98${phone.replace(/^0/, '')}`;

  const pyClass = buttonSize === 'lg' ? 'py-3.5' : 'py-2.5';
  const iconSize = buttonSize === 'lg' ? 22 : 20;
  const buttonWidth = buttonSize === 'lg' ? 'w-[54px]' : 'w-[42px]';

  return (
    <div className={cn("flex flex-col gap-2.5 w-full", className)}>
      {!revealed ? (
        <button 
          onClick={() => setRevealed(true)}
          className={cn("w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-sm", pyClass)}
        >
          <PhoneCall size={buttonSize === 'lg' ? 18 : 16} />
          {label}
        </button>
      ) : (
        <div className={cn("w-full flex items-center bg-[var(--color-primary)] text-white rounded-xl shadow-sm overflow-hidden", pyClass, "py-0")}>
          <a href={`tel:${phone}`} className={cn("flex-1 font-bold font-mono text-center tracking-wider text-sm flex items-center justify-center gap-2 hover:bg-white/10 transition h-full", pyClass)}>
            <PhoneCall size={buttonSize === 'lg' ? 18 : 16} />
            <span dir="ltr">{phone}</span>
          </a>
          <button 
            onClick={handleCopy}
            className="px-3 h-full border-r border-white/20 hover:bg-white/20 transition flex items-center justify-center shrink-0"
            title="کپی شماره"
          >
            {copied ? <Check size={buttonSize === 'lg' ? 20 : 18} /> : <Copy size={buttonSize === 'lg' ? 20 : 18} />}
          </button>
        </div>
      )}

      {/* WhatsApp & Telegram Grid */}
      <div className="grid grid-cols-2 gap-2">
        <a 
          href={whatsappUrl} 
          target="_blank" 
          rel="noreferrer" 
          className="bg-green-50 hover:bg-green-100 border border-green-200 text-green-600 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 py-2.5 text-xs font-bold"
        >
          <WhatsAppIcon className="w-5 h-5 text-green-600" />
          <span>واتس‌اپ</span>
        </a>
        <a 
          href={telegramUrl} 
          target="_blank" 
          rel="noreferrer" 
          className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-500 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 py-2.5 text-xs font-bold"
        >
          <TelegramIcon className="w-4.5 h-4.5 text-blue-500" />
          <span>تلگرام</span>
        </a>
      </div>
    </div>
  );
}
