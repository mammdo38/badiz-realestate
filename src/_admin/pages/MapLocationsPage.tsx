'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { Spinner, Button } from '../components/ui';
import toast from 'react-hot-toast';

export const MapLocationsPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/map-locations');
      setData(res.data);
      
      const postsRes = await api.get('/posts/admin/all');
      setArticles(postsRes.data.filter((p: any) => p.is_published));
    } catch(err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = async (id: number, payload: any) => {
    try {
      const res = await api.put(`/admin/map-locations/${id}`, payload);
      toast.success(res.message);
      fetchData();
    } catch(e: any) { toast.error(e.message); }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const payload = Object.fromEntries(formData.entries());
    
    try {
      const res = await api.post('/admin/map-locations', payload);
      toast.success(res.message);
      fetchData();
      (e.target as HTMLFormElement).reset();
    } catch(e: any) {
      toast.error(e.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('آیا از حذف این لوکیشن مطمئن هستید؟')) return;
    try {
      const res = await api.del(`/admin/map-locations/${id}`);
      toast.success(res.message);
      fetchData();
    } catch(e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-24">
      <h1 className="text-2xl font-bold">مدیریت مکان‌های نقشه</h1>

      {/* Add New Location Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-bold mb-4">اضافه کردن لوکیشن جدید</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">نام مکان</label>
              <input name="name" type="text" required placeholder="مثال: آبشار..." className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">طول جغرافیایی (Lng)</label>
              <input name="lng" type="number" step="any" required dir="ltr" placeholder="50.8258" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500 text-left" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">عرض جغرافیایی (Lat)</label>
              <input name="lat" type="number" step="any" required dir="ltr" placeholder="35.9458" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500 text-left" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">نوع</label>
              <select name="type" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500">
                <option value="poi">مکان دیدنی (POI)</option>
                <option value="shomali">منطقه شمالی</option>
                <option value="jonoubi">منطقه جنوبی</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">اتصال به مقاله (راهنمای منطقه)</label>
              <select name="article_id" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500">
                <option value="">-- بدون مقاله --</option>
                {articles.map(a => (
                  <option key={a.id} value={a.id}>{a.title}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">توضیحات کوتاه روی نقشه</label>
            <textarea name="description" rows={2} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500"></textarea>
          </div>
          <div className="flex justify-end">
            <Button type="submit">ثبت لوکیشن جدید</Button>
          </div>
        </form>
      </div>

      {loading ? <Spinner /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.map(loc => (
            <div key={loc.id} className="bg-white rounded-lg shadow-md p-6 border-t-4 border-orange-500">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{loc.name}</h2>
                <div className="bg-slate-100 text-slate-800 text-xs font-bold px-2 py-1 rounded">
                  {loc.type === 'poi' ? 'مکان دیدنی' : loc.type === 'shomali' ? 'کردان شمالی' : 'کردان جنوبی'}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">طول جغرافیایی</label>
                    <input 
                      type="number" step="any" dir="ltr"
                      className="w-full text-sm border p-2 rounded-lg focus:ring-2 focus:ring-orange-500"
                      value={loc.lng}
                      onChange={(e) => setData(data.map(d => d.id === loc.id ? {...d, lng: e.target.value} : d))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">عرض جغرافیایی</label>
                    <input 
                      type="number" step="any" dir="ltr"
                      className="w-full text-sm border p-2 rounded-lg focus:ring-2 focus:ring-orange-500"
                      value={loc.lat}
                      onChange={(e) => setData(data.map(d => d.id === loc.id ? {...d, lat: e.target.value} : d))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">مقاله مرتبط</label>
                  <select 
                    className="w-full text-sm border p-2 rounded-lg focus:ring-2 focus:ring-orange-500 mb-2"
                    value={loc.article_id || ''}
                    onChange={(e) => setData(data.map(d => d.id === loc.id ? {...d, article_id: e.target.value} : d))}
                  >
                    <option value="">-- بدون مقاله --</option>
                    {articles.map(a => (
                      <option key={a.id} value={a.id}>{a.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">توضیحات</label>
                  <textarea 
                    className="w-full text-sm border p-2 rounded-lg focus:ring-2 focus:ring-orange-500 h-20"
                    value={loc.description || ''}
                    onChange={(e) => setData(data.map(d => d.id === loc.id ? {...d, description: e.target.value} : d))}
                  ></textarea>
                </div>
                
                <label className="flex items-center gap-2 font-medium text-sm">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-orange-600 rounded"
                    checked={loc.is_active}
                    onChange={(e) => setData(data.map(d => d.id === loc.id ? {...d, is_active: e.target.checked} : d))}
                  />
                  فعال روی نقشه
                </label>
                
                <div className="flex gap-2 pt-2">
                  <Button onClick={() => handleUpdate(loc.id, loc)} className="flex-1">ذخیره تغییرات</Button>
                  <button onClick={() => handleDelete(loc.id)} className="px-4 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100" title="حذف لوکیشن">
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
