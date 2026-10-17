'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { Spinner, Button } from '../components/ui';
import toast from 'react-hot-toast';

export const RegionsPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRegions = () => {
    setLoading(true);
    api.get('/regions')
      .then(res => setData(res.data))
      .catch(err => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  const handleUpdate = async (slug: string, description: string, is_active: boolean, page_title: string) => {
    try {
      const res = await api.put(`/regions/${slug}`, { description, is_active, page_title });
      toast.success(res.message);
    } catch(e: any) { toast.error(e.message); }
  };

  const handleAddRegion = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const payload = Object.fromEntries(formData.entries());
    
    try {
      const res = await api.post('/regions', payload);
      toast.success(res.message);
      fetchRegions();
      (e.target as HTMLFormElement).reset();
    } catch(e: any) {
      toast.error(e.message);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!window.confirm('آیا از حذف این منطقه مطمئن هستید؟ این عملیات قابل بازگشت نیست.')) return;
    try {
      const res = await api.del(`/regions/${slug}`);
      toast.success(res.message);
      fetchRegions();
    } catch(e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">مدیریت مناطق</h1>

      {/* Add New Region Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-bold mb-4">اضافه کردن منطقه جدید</h2>
        <form onSubmit={handleAddRegion} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">نام منطقه (فارسی)</label>
              <input name="name_fa" type="text" required placeholder="مثال: کردان غربی" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">شناسه انگلیسی (Slug)</label>
              <input name="slug" type="text" required dir="ltr" placeholder="kordan-gharbi" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500 text-left" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">عنوان صفحه (H1)</label>
              <input name="page_title" type="text" placeholder="خرید ویلا در کردان غربی" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ایموجی (اختیاری)</label>
              <input name="emoji" type="text" placeholder="🌲" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">توضیحات کوتاه (سئو)</label>
            <textarea name="description" rows={2} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500"></textarea>
          </div>
          <div className="flex justify-end">
            <Button type="submit">ثبت منطقه جدید</Button>
          </div>
        </form>
      </div>

      {loading ? <Spinner /> : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.map(r => (
            <div key={r.slug} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span>{r.emoji}</span> {r.name_fa}
                </h2>
                <div className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded">
                  {r.active_listing_count} آگهی فعال
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">عنوان اختصاصی صفحه (H1)</label>
                  <input 
                    type="text"
                    className="w-full text-sm border p-2 rounded-lg focus:ring-2 focus:ring-orange-500 mb-4"
                    value={r.page_title || ''}
                    placeholder="مثلاً: خرید ویلا در..."
                    onChange={(e) => setData(data.map(d => d.slug === r.slug ? {...d, page_title: e.target.value} : d))}
                  />
                  <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات سئو</label>
                  <textarea 
                    className="w-full text-sm border p-2 rounded-lg focus:ring-2 focus:ring-orange-500 h-24 leading-relaxed"
                    value={r.description || ''}
                    onChange={(e) => setData(data.map(d => d.slug === r.slug ? {...d, description: e.target.value} : d))}
                  ></textarea>
                </div>
                
                <label className="flex items-center gap-2 font-medium">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-orange-600 rounded"
                    checked={r.is_active}
                    onChange={(e) => setData(data.map(d => d.slug === r.slug ? {...d, is_active: e.target.checked} : d))}
                  />
                  فعال در سایت
                </label>
                
                <div className="flex gap-2 pt-2">
                  <Button onClick={() => handleUpdate(r.slug, r.description, r.is_active, r.page_title)} className="flex-1">ذخیره تغییرات</Button>
                  <button onClick={() => handleDelete(r.slug)} className="px-4 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100" title="حذف منطقه">
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
