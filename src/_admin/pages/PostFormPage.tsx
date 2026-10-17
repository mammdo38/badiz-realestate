'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { api } from '../utils/api';
import { Button, Input, Select, Spinner } from '../components/ui';
import { RichEditor, SeoPanel } from '../components/editor';
import toast from 'react-hot-toast';

interface PostForm {
  title: string;
  category: string;
  author: string;
  related_listing_id: string;
  excerpt: string;
  content: string;
  meta_title: string;
  meta_description: string;
  focus_keyword: string;
  is_published: boolean;
  is_featured: boolean;
}

const EMPTY: PostForm = {
  title: '',
  category: 'guide',
  author: 'تیم تحریریه',
  related_listing_id: '',
  excerpt: '',
  content: '',
  meta_title: '',
  meta_description: '',
  focus_keyword: '',
  is_published: false,
  is_featured: false,
};

export const PostFormPage = () => {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [loading, setLoading] = useState(!!id);
  const [submitting, setSubmitting] = useState(false);
  const [listings, setListings] = useState<any[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [coverFilename, setCoverFilename] = useState<string>('');
  const [focusKeyword, setFocusKeyword] = useState('');
  const [formData, setFormData] = useState<PostForm>(EMPTY);
  const [lastAutosave, setLastAutosave] = useState<Date | null>(null);
  const lastSavedContent = useRef<string>('');
  const coverDragRef = useRef<HTMLDivElement>(null);

  // بارگذاری آگهی‌ها و داده‌های مقاله (در صورت ویرایش)
  useEffect(() => {
    api.get('/listings?investment=true').then(res => setListings(res.data)).catch(() => {});

    if (id) {
      api.get(`/posts/admin/${id}`).then(res => {
        const d = res.data;
        const loaded: PostForm = {
          title: d.title || '',
          category: d.category || 'guide',
          author: d.author || 'تیم تحریریه',
          related_listing_id: d.related_listing_id ? String(d.related_listing_id) : '',
          excerpt: d.excerpt || '',
          content: d.content || '',
          meta_title: d.meta_title || '',
          meta_description: d.meta_description || '',
          focus_keyword: d.focus_keyword || '',
          is_published: Boolean(d.is_published),
          is_featured: Boolean(d.is_featured),
        };
        setFormData(loaded);
        setFocusKeyword(d.focus_keyword || '');
        lastSavedContent.current = d.content || '';
        if (d.cover_image) {
          setCoverFilename(d.cover_image);
          setCoverPreview(`/uploads/${d.cover_image}`);
        }
        setLoading(false);
      }).catch((err) => {
        toast.error(err.message);
        router.push('/admin/posts');
      });
    }
  }, [id]);

  // ذخیره خودکار هر ۳۰ ثانیه (فقط در حالت ویرایش)
  useEffect(() => {
    if (!id) return;
    const interval = setInterval(async () => {
      if (formData.content === lastSavedContent.current) return;
      try {
        const fd = new FormData();
        Object.entries(formData).forEach(([k, v]) => {
          if (v !== null && v !== undefined && v !== '') fd.append(k, String(v));
        });
        if (coverFile) fd.append('cover_image', coverFile);
        await api.putForm(`/posts/${id}`, fd);
        lastSavedContent.current = formData.content;
        setLastAutosave(new Date());
        toast.success('پیش‌نویس ذخیره شد');
      } catch {
        // ذخیره خودکار بی‌صدا در صورت خطا
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [id, formData, coverFile]);

  const buildFormData = (publish = false): FormData => {
    const fd = new FormData();
    const payload = { ...formData, is_published: publish };
    Object.entries(payload).forEach(([k, v]) => {
      if (v !== null && v !== undefined && v !== '') fd.append(k, String(v));
    });
    if (coverFile) fd.append('cover_image', coverFile);
    return fd;
  };

  const submitPost = async (publish = false) => {
    if (!formData.title.trim()) {
      toast.error('عنوان مقاله الزامی است');
      return;
    }
    if (!formData.category) {
      toast.error('انتخاب دسته‌بندی الزامی است');
      return;
    }
    setSubmitting(true);
    try {
      const fd = buildFormData(publish);
      if (id) {
        const res = await api.putForm(`/posts/${id}`, fd);
        toast.success(res.message);
        router.push('/admin/posts');
      } else {
        const res = await api.postForm('/posts', fd);
        toast.success(res.message);
        router.push('/admin/posts');
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCoverSelect = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('فقط فایل تصویری مجاز است');
      return;
    }
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const onCoverDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleCoverSelect(f);
    coverDragRef.current?.classList.remove('drag-over');
  };

  if (loading) return <Spinner />;

  return (
    <div className="flex flex-col gap-6" style={{ minHeight: 'calc(100vh - 80px)' }}>
      <div className="flex flex-col lg:flex-row gap-6 flex-1">
        {/* ستون چپ */}
        <div className="w-full lg:w-[65%] flex flex-col gap-6">
          {/* کارت ۱: اطلاعات اصلی */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">اطلاعات اصلی</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">عنوان مقاله *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="عنوان جذاب و توصیفی برای مقاله..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ fontSize: '1.1rem', fontWeight: 600 }}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">دسته‌بندی *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-sm"
                  >
                    <option value="guide">راهنمای خرید</option>
                    <option value="price">قیمت‌ها</option>
                    <option value="investment">سرمایه‌گذاری</option>
                    <option value="region">مناطق</option>
                    <option value="legal">حقوقی</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">نام نویسنده</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="مثال: تیم تحریریه یا نام مشاور..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">آگهی مرتبط (اختیاری)</label>
                  <select
                    value={formData.related_listing_id}
                    onChange={(e) => setFormData({ ...formData, related_listing_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-sm"
                  >
                    <option value="">— انتخاب آگهی —</option>
                    {listings.map(l => (
                      <option key={l.id} value={l.id}>{l.title}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">خلاصه مقاله (Excerpt)</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                  placeholder="خلاصه‌ای کوتاه از مقاله برای نمایش در کارت‌ها..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* کارت ۲: محتوای مقاله */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">محتوای مقاله</h2>
            <RichEditor
              content={formData.content}
              onChange={(html) => setFormData({ ...formData, content: html })}
              focusKeyword={focusKeyword}
              placeholder="متن کامل مقاله را اینجا بنویسید..."
              minHeight={520}
            />
          </div>

          {/* کارت ۳: تصویر کاور */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">تصویر کاور</h2>
            <div
              ref={coverDragRef}
              className="image-upload-zone"
              onClick={() => document.getElementById('cover-input')?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                coverDragRef.current?.classList.add('drag-over');
              }}
              onDragLeave={() => coverDragRef.current?.classList.remove('drag-over')}
              onDrop={onCoverDrop}
            >
              {coverPreview ? (
                <img src={coverPreview} alt="پیش‌نمایش کاور" className="max-h-48 mx-auto rounded-lg" />
              ) : (
                <>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🖼</div>
                  <p style={{ fontSize: '0.85rem', color: '#48484A', fontWeight: 600 }}>
                    تصویر کاور را اینجا رها کنید یا کلیک کنید
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#8E8E93', marginTop: '0.3rem' }}>
                    JPG، PNG یا WEBP — حداکثر ۸ مگابایت
                  </p>
                </>
              )}
              <input
                id="cover-input"
                type="file"
                accept="image/*"
                className="hidden"
                style={{ display: 'none' }}
                onChange={(e) => handleCoverSelect(e.target.files?.[0] || null)}
              />
            </div>
            {coverFilename && !coverFile && (
              <p style={{ fontSize: '0.75rem', color: '#8E8E93', marginTop: '0.5rem', textAlign: 'center' }}>
                فایل فعلی: {coverFilename}
              </p>
            )}
          </div>
        </div>

        {/* ستون راست: پنل سئو */}
        <div className="w-full lg:w-[35%]">
          <SeoPanel
            title={formData.title}
            focusKeyword={focusKeyword}
            content={formData.content}
            excerpt={formData.excerpt}
            metaTitle={formData.meta_title}
            metaDescription={formData.meta_description}
            coverImage={coverFilename || (coverFile ? 'pending' : '')}
            onFocusKeywordChange={setFocusKeyword}
            onMetaTitleChange={(v) => setFormData({ ...formData, meta_title: v })}
            onMetaDescriptionChange={(v) => setFormData({ ...formData, meta_description: v })}
          />
        </div>
      </div>

      {/* نوار پایین ذخیره */}
      <div className="post-bottom-bar">
        <Link href="/posts" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
          ← بازگشت به مقالات
        </Link>
        <div className="flex items-center gap-4">
          {lastAutosave && (
            <span style={{ fontSize: '0.75rem', color: '#8E8E93' }}>
              ذخیره خودکار: {lastAutosave.toLocaleTimeString('fa-IR')}
            </span>
          )}
          <Button type="button" variant="secondary" onClick={() => router.push('/admin/posts')}>انصراف</Button>
          <Button type="submit" isLoading={submitting} onClick={() => submitPost(false)}>ذخیره مقاله</Button>
          <Button
            onClick={() => submitPost(true)}
            isLoading={submitting}
            type="button"
          >
            انتشار مقاله
          </Button>
        </div>
      </div>
    </div>
  );
};
