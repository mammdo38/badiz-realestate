import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../../utils/api';

export interface SeoPanelProps {
  title: string;
  focusKeyword: string;
  content: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  coverImage?: string;
  onFocusKeywordChange: (kw: string) => void;
  onMetaTitleChange: (v: string) => void;
  onMetaDescriptionChange: (v: string) => void;
}

/** تبدیل اعداد انگلیسی به فارسی */
const toFa = (n: number): string => n.toLocaleString('fa-IR');

/** ساخت slug نمایشی از عنوان (ساده، برای پیش‌نمایش) */
const buildSlug = (title: string): string =>
  (title || '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\u0600-\u06FF-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);

/** استخراج متن ساده از HTML */
const stripHtml = (html: string): string => {
  if (typeof window === 'undefined') {
    return html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ');
  }
  const tmp = document.createElement('div');
  tmp.innerHTML = html || '';
  return tmp.textContent || tmp.innerText || '';
};

/** شمارش کلمات در متن */
const countWords = (text: string): number => {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
};

type Status = 'good' | 'ok' | 'bad';

interface CheckItem {
  label: string;
  note?: string;
  status: Status;
}

export const SeoPanel: React.FC<SeoPanelProps> = ({
  title,
  focusKeyword,
  content,
  excerpt,
  metaTitle,
  metaDescription,
  coverImage,
  onFocusKeywordChange,
  onMetaTitleChange,
  onMetaDescriptionChange,
}) => {
  const [slugEditing, setSlugEditing] = useState(false);
  const [customSlug, setCustomSlug] = useState('');
  const [suggestedPosts, setSuggestedPosts] = useState<any[]>([]);

  // بارگذاری مقالات پیشنهادی برای لینک‌سازی داخلی (یک‌بار)
  useEffect(() => {
    api
      .get('/posts?limit=5')
      .then((res) => setSuggestedPosts(res.data || []))
      .catch(() => {});
  }, []);

  // محاسبات مشتق‌شده از محتوا
  const analysis = useMemo(() => {
    const kw = focusKeyword.trim();
    const plainContent = stripHtml(content);
    const contentWords = countWords(plainContent);

    // تراکم کلمه کلیدی
    let density = 0;
    let kwCount = 0;
    if (kw && contentWords > 0) {
      const matches = plainContent.match(new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'));
      kwCount = matches ? matches.length : 0;
      // تعداد کلمات کلیدی (اگر چندکلمه‌ای باشد با تعداد کلماتش ضرب می‌شود)
      const kwWords = kw.split(/\s+/).length;
      density = (kwCount * kwWords / contentWords) * 100;
    }

    // اولین پاراگراف
    let firstParagraph = '';
    const pMatch = content.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    if (pMatch) firstParagraph = stripHtml(pMatch[1]);

    // تیترهای H2
    const h2Matches: string[] = [];
    const h2Regex = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
    let m;
    while ((m = h2Regex.exec(content)) !== null) {
      h2Matches.push(stripHtml(m[1]));
    }

    // تصاویر و alt
    const imgTags: { alt: string }[] = [];
    const imgRegex = /<img[^>]*>/gi;
    while ((m = imgRegex.exec(content)) !== null) {
      const altMatch = m[0].match(/alt=["']([^"']*)["']/i);
      imgTags.push({ alt: altMatch ? altMatch[1].trim() : '' });
    }

    // لینک‌های داخلی
    const linkRegex = /<a[^>]*href=["']([^"']+)["']/gi;
    let hasInternalLink = false;
    while ((m = linkRegex.exec(content)) !== null) {
      const href = m[1];
      if (href.includes('badizvilla.ir') || href.startsWith('/') || href.startsWith('#')) {
        hasInternalLink = true;
        break;
      }
    }

    // لیست‌ها
    const hasList = /<(ul|ol)[\s>]/i.test(content);

    // طول پاراگراف‌ها
    const paragraphTexts: string[] = [];
    const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    while ((m = pRegex.exec(content)) !== null) {
      paragraphTexts.push(stripHtml(m[1]));
    }
    const longParagraphs = paragraphTexts.filter((p) => countWords(p) > 150).length;

    // جملات طولانی
    const sentences = plainContent.split(/[.!?؟\n]+/).map((s) => s.trim()).filter((s) => s.length > 0);
    const longSentences = sentences.filter((s) => countWords(s) > 25).length;
    const longSentencePct = sentences.length > 0 ? (longSentences / sentences.length) * 100 : 0;

    const kwLower = kw.toLowerCase();
    const includes = (txt: string) => kw !== '' && txt.toLowerCase().includes(kwLower);

    const items: CheckItem[] = [
      // === کلمه کلیدی ===
      {
        label: 'کلمه کلیدی در عنوان مقاله',
        status: includes(title) ? 'good' : 'bad',
        note: includes(title) ? undefined : 'کلمه کلیدی در عنوان وجود ندارد',
      },
      {
        label: 'کلمه کلیدی در عنوان سئو (meta title)',
        status: metaTitle
          ? includes(metaTitle)
            ? 'good'
            : 'ok'
          : 'bad',
        note: includes(metaTitle)
          ? undefined
          : metaTitle
          ? 'استفاده از کلمه کلیدی در عنوان سئو توصیه می‌شود'
          : 'عنوان سئو خالی است',
      },
      {
        label: 'کلمه کلیدی در توضیحات متا',
        status: includes(metaDescription) ? 'good' : 'bad',
        note: includes(metaDescription) ? undefined : 'کلمه کلیدی در توضیحات متا یافت نشد',
      },
      {
        label: 'کلمه کلیدی در اولین پاراگراف',
        status: includes(firstParagraph) ? 'good' : 'bad',
        note: includes(firstParagraph) ? undefined : 'کلمه کلیدی در اولین پاراگراف نیست',
      },
      {
        label: 'تراکم کلمه کلیدی (۰.۵٪ - ۲.۵٪)',
        status: density === 0 ? 'bad' : density >= 0.5 && density <= 2.5 ? 'good' : density <= 4 ? 'ok' : 'bad',
        note: `تراکم: ${density.toFixed(1)}٪ — ${toFa(kwCount)} بار در متن`,
      },

      // === محتوا ===
      {
        label: 'طول محتوا (حداقل ۳۰۰ کلمه)',
        status: contentWords > 600 ? 'good' : contentWords >= 300 ? 'ok' : 'bad',
        note: `محتوای شما ${toFa(contentWords)} کلمه دارد`,
      },
      {
        label: 'تیترهای H2 و H3',
        status: h2Matches.length > 0 ? 'good' : 'bad',
        note: h2Matches.length > 0 ? undefined : 'حداقل یک تیتر H2 اضافه کنید',
      },
      {
        label: 'کلمه کلیدی در یک H2',
        status: h2Matches.some((h) => includes(h)) ? 'good' : 'ok',
        note: h2Matches.some((h) => includes(h)) ? undefined : 'استفاده از کلمه کلیدی در تیترها توصیه می‌شود',
      },
      {
        label: 'تصاویر دارای alt text',
        status: imgTags.length === 0
          ? 'bad'
          : imgTags.every((i) => i.alt)
          ? 'good'
          : 'ok',
        note: imgTags.length === 0
          ? 'تصویری وجود ندارد'
          : imgTags.every((i) => i.alt)
          ? undefined
          : `${toFa(imgTags.filter((i) => !i.alt).length)} تصویر بدون alt text`,
      },
      {
        label: 'لینک داخلی',
        status: hasInternalLink ? 'good' : 'ok',
        note: hasInternalLink ? undefined : 'اضافه کردن لینک به صفحات دیگر سایت توصیه می‌شود',
      },

      // === خوانایی ===
      {
        label: 'خلاصه مقاله (excerpt)',
        status: excerpt.trim().length > 50 ? 'good' : 'bad',
        note: excerpt.trim().length > 50 ? undefined : 'خلاصه مقاله خالی یا خیلی کوتاه است',
      },
      {
        label: 'طول پاراگراف‌ها',
        status: longParagraphs === 0 ? 'good' : 'ok',
        note: longParagraphs === 0 ? undefined : `${toFa(longParagraphs)} پاراگراف خیلی طولانی هستند (بیش از ۱۵۰ کلمه)`,
      },
      {
        label: 'جملات خیلی طولانی',
        status: longSentencePct < 25 ? 'good' : 'ok',
        note: longSentencePct < 25 ? undefined : `${longSentencePct.toFixed(0)}٪ جملات طولانی هستند`,
      },
      {
        label: 'استفاده از لیست (ul/ol)',
        status: hasList ? 'good' : 'ok',
        note: hasList ? undefined : 'استفاده از لیست‌ها خوانایی را افزایش می‌دهد',
      },
      {
        label: 'تصویر کاور',
        status: coverImage ? 'good' : 'bad',
        note: coverImage ? undefined : 'تصویر کاور تنظیم نشده است',
      },
    ];

    const goodCount = items.filter((i) => i.status === 'good').length;
    const score = Math.round((goodCount / items.length) * 100);

    return {
      items,
      score,
      density,
      kwCount,
      contentWords,
      slug: buildSlug(title),
    };
  }, [title, focusKeyword, content, excerpt, metaTitle, metaDescription, coverImage]);

  // slug نمایشی (اولویت با slug سفارشی)
  const displaySlug = (slugEditing ? customSlug : analysis.slug) || buildSlug(title);
  const slugValid = /^[a-z0-9\u0600-\u06FF-]+$/.test(displaySlug);
  const slugStatus: Status = !slugValid
    ? 'bad'
    : displaySlug.length >= 10 && displaySlug.length <= 60
    ? 'good'
    : 'ok';

  // رنگ نوار امتیاز
  const scoreColor =
    analysis.score > 70 ? '#22C55E' : analysis.score >= 40 ? '#EAB308' : '#EF4444';

  // تنظیمات رنگ برای SERP و شمارنده‌ها
  const metaTitleLen = metaTitle.length;
  const metaDescLen = metaDescription.length;
  const titleCounterColor = metaTitleLen === 0 ? '#EF4444' : metaTitleLen < 40 ? '#EAB308' : metaTitleLen <= 60 ? '#22C55E' : '#EF4444';
  const descCounterColor = metaDescLen === 0 ? '#EF4444' : metaDescLen < 120 ? '#EAB308' : metaDescLen <= 160 ? '#22C55E' : '#EF4444';

  // رنگ تراکم کلمه کلیدی
  const densityColor =
    analysis.density === 0
      ? '#EF4444'
      : analysis.density >= 0.5 && analysis.density <= 2.5
      ? '#22C55E'
      : '#EAB308';

  const dotClass = (s: Status) =>
    s === 'good' ? 'good' : s === 'ok' ? 'ok' : 'bad';

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/blog-post?slug=${slug}`;
    navigator.clipboard.writeText(url).catch(() => {});
  };

  return (
    <div className="seo-panel">
      {/* SECTION A: کلمه کلیدی تمرکز */}
      <div className="seo-section">
        <div className="seo-section-title">🎯 کلمه کلیدی تمرکز</div>
        <input
          type="text"
          value={focusKeyword}
          onChange={(e) => onFocusKeywordChange(e.target.value)}
          placeholder="مثلاً: خرید ویلا کردان"
          style={{
            width: '100%',
            border: '1px solid #E5E5EA',
            borderRadius: 8,
            padding: '0.55rem 0.7rem',
            fontSize: '0.85rem',
            fontFamily: 'inherit',
          }}
        />
        <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: densityColor, fontWeight: 600 }}>
          تراکم کلمه کلیدی: {analysis.density.toFixed(1)}٪ — {toFa(analysis.kwCount)} بار در متن
        </div>
      </div>

      {/* SECTION B: پیش‌نمایش گوگل */}
      <div className="seo-section">
        <div className="seo-section-title">🔍 پیش‌نمایش گوگل (SERP)</div>
        <div className="serp-preview">
          <div className="serp-url">badizvilla.ir › blog › {displaySlug || 'slug'}</div>
          <div className="serp-title">
            {(metaTitle || title || 'عنوان مقاله').slice(0, 60)}
            {(metaTitle || title).length > 60 && (
              <span className="serp-title-truncated">
                {(metaTitle || title).slice(60)}…
              </span>
            )}
          </div>
          <div className="serp-desc">
            {(metaDescription || excerpt || 'توضیحات متا…').slice(0, 160)}
            {(metaDescription || excerpt).length > 160 ? '…' : ''}
          </div>
        </div>
        <div className="row-flex" style={{ marginTop: '0.6rem', justifyContent: 'space-between' }}>
          <span className="serp-counter" style={{ color: titleCounterColor }}>
            عنوان سئو: {toFa(metaTitleLen)}/۶۰ کاراکتر
          </span>
        </div>
        <input
          type="text"
          value={metaTitle}
          onChange={(e) => onMetaTitleChange(e.target.value)}
          placeholder="عنوان سئو (تا ۶۰ کاراکتر)"
          maxLength={70}
          style={{
            width: '100%',
            border: '1px solid #E5E5EA',
            borderRadius: 8,
            padding: '0.5rem 0.7rem',
            fontSize: '0.85rem',
            fontFamily: 'inherit',
            marginTop: '0.3rem',
          }}
        />
        <div className="row-flex" style={{ marginTop: '0.5rem', justifyContent: 'space-between' }}>
          <span className="serp-counter" style={{ color: descCounterColor }}>
            توضیحات متا: {toFa(metaDescLen)}/۱۶۰ کاراکتر
          </span>
        </div>
        <textarea
          value={metaDescription}
          onChange={(e) => onMetaDescriptionChange(e.target.value)}
          placeholder="توضیحات متا (تا ۱۶۰ کاراکتر)"
          maxLength={170}
          rows={2}
          style={{
            width: '100%',
            border: '1px solid #E5E5EA',
            borderRadius: 8,
            padding: '0.5rem 0.7rem',
            fontSize: '0.85rem',
            fontFamily: 'inherit',
            marginTop: '0.3rem',
            resize: 'vertical',
          }}
        />
      </div>

      {/* SECTION C: تحلیل سئو */}
      <div className="seo-section">
        <div className="seo-section-title">📊 تحلیل سئو</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0A0A0A' }}>
            امتیاز سئو: {toFa(analysis.score)} از ۱۰۰
          </span>
        </div>
        <div className="seo-score-bar-bg">
          <div
            className="seo-score-bar-fill"
            style={{ width: `${analysis.score}%`, background: scoreColor }}
          />
        </div>
        <div style={{ marginTop: '0.8rem' }}>
          {analysis.items.map((item, idx) => (
            <div className="seo-check-item" key={idx}>
              <span className={`seo-check-dot ${dotClass(item.status)}`} />
              <div>
                <div className="seo-check-label">{item.label}</div>
                {item.note && <div className="seo-check-note">{item.note}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION D: slug */}
      <div className="seo-section">
        <div className="seo-section-title">🔗 آدرس مقاله (Slug)</div>
        {slugEditing ? (
          <div className="row-flex">
            <input
              type="text"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value.toLowerCase())}
              placeholder="my-article-slug"
              style={{
                flex: 1,
                border: '1px solid #E5E5EA',
                borderRadius: 8,
                padding: '0.5rem 0.7rem',
                fontSize: '0.82rem',
                margin: 0,
                fontFamily: 'inherit',
              }}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setSlugEditing(false)}
              style={{
                background: '#E8611A', color: '#fff', border: 'none', borderRadius: 6,
                padding: '0.4rem 0.7rem', fontSize: '0.78rem', cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              تأیید
            </button>
          </div>
        ) : (
          <div style={{ fontSize: '0.8rem', color: '#48484A', direction: 'ltr', textAlign: 'left' }}>
            badizvilla.ir/blog/{displaySlug || 'slug'}
          </div>
        )}
        <div style={{ marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className={`seo-check-dot ${dotClass(slugStatus)}`} />
          {!slugEditing && (
            <button
              type="button"
              onClick={() => {
                setCustomSlug(displaySlug);
                setSlugEditing(true);
              }}
              style={{
                background: 'none', border: 'none', color: '#E8611A',
                fontSize: '0.78rem', cursor: 'pointer', padding: 0,
              }}
            >
              ویرایش
            </button>
          )}
        </div>
      </div>

      {/* SECTION E: لینک‌های مرتبط پیشنهادی */}
      <div className="seo-section">
        <div className="seo-section-title">📎 لینک‌های مرتبط پیشنهادی</div>
        <p style={{ fontSize: '0.78rem', color: '#8E8E93', marginBottom: '0.6rem' }}>
          برای بهبود لینک‌سازی داخلی، این مقالات را لینک‌دهید:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {suggestedPosts.length === 0 && (
            <span style={{ fontSize: '0.78rem', color: '#8E8E93' }}>مقاله‌ای یافت نشد.</span>
          )}
          {suggestedPosts.map((p) => (
            <div
              key={p.id}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: '0.5rem', padding: '0.4rem 0.6rem',
                background: '#FAFAFA', borderRadius: 8,
              }}
            >
              <span style={{ fontSize: '0.78rem', color: '#48484A', flex: 1 }}>
                {p.title}
              </span>
              <button
                type="button"
                onClick={() => copyLink(p.slug)}
                style={{
                  background: 'none', border: '1px solid #E5E5EA', borderRadius: 6,
                  padding: '0.2rem 0.5rem', fontSize: '0.72rem', color: '#E8611A',
                  cursor: 'pointer', whiteSpace: 'nowrap',
                }}
              >
                کپی لینک
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeoPanel;
