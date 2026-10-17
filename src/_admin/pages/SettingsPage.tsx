'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { Spinner, Button, Input } from '../components/ui';
import toast from 'react-hot-toast';

export const SettingsPage = () => {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [pwds, setPwds] = useState({ currentPassword: '', newPassword: '' });

  useEffect(() => {
    api.get('/settings')
      .then(res => setSettings(res.data || {}))
      .catch(err => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.put('/settings', settings);
      toast.success(res.message);
    } catch(e: any) { toast.error(e.message); }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.put('/auth/change-password', pwds);
      toast.success(res.message);
      setPwds({ currentPassword: '', newPassword: '' });
    } catch(e: any) { toast.error(e.message); }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">تنظیمات سیستم</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold mb-4 border-b pb-2">تنظیمات سایت</h2>
        <form onSubmit={handleUpdateSettings} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="نام سایت" value={settings.site_name || ''} onChange={e => setSettings({...settings, site_name: e.target.value})} />
            <Input label="شعار سایت" value={settings.site_tagline || ''} onChange={e => setSettings({...settings, site_tagline: e.target.value})} />
            <Input label="شماره تماس" dir="ltr" className="text-left" value={settings.site_phone || ''} onChange={e => setSettings({...settings, site_phone: e.target.value})} />
            <Input label="ایمیل" dir="ltr" className="text-left" value={settings.site_email || ''} onChange={e => setSettings({...settings, site_email: e.target.value})} />
            <div className="md:col-span-2">
              <Input label="آدرس" value={settings.site_address || ''} onChange={e => setSettings({...settings, site_address: e.target.value})} />
            </div>
          </div>

          <h3 className="font-bold text-gray-700 mt-6 pt-4 border-t">شبکه‌های اجتماعی</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="واتس‌اپ (لینک)" dir="ltr" className="text-left" value={settings.site_whatsapp || ''} onChange={e => setSettings({...settings, site_whatsapp: e.target.value})} />
            <Input label="اینستاگرام (لینک)" dir="ltr" className="text-left" value={settings.site_instagram || ''} onChange={e => setSettings({...settings, site_instagram: e.target.value})} />
            <Input label="تلگرام (لینک)" dir="ltr" className="text-left" value={settings.site_telegram || ''} onChange={e => setSettings({...settings, site_telegram: e.target.value})} />
          </div>

          <h3 className="font-bold text-gray-700 mt-6 pt-4 border-t">نمایش بخش‌ها در سایت</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center gap-2 cursor-pointer border p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <input type="checkbox" checked={settings.show_urgent_section !== 'false' && settings.show_urgent_section !== false} onChange={e => setSettings({...settings, show_urgent_section: e.target.checked})} className="w-5 h-5 text-orange-600 rounded border-gray-300 focus:ring-orange-500" />
              <span className="font-medium text-gray-700">نمایش بخش فروش فوری (شکار بازار) در صفحه اصلی</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer border p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <input type="checkbox" checked={settings.show_investment_section !== 'false' && settings.show_investment_section !== false} onChange={e => setSettings({...settings, show_investment_section: e.target.checked})} className="w-5 h-5 text-orange-600 rounded border-gray-300 focus:ring-orange-500" />
              <span className="font-medium text-gray-700">نمایش بخش فرصت‌های سرمایه‌گذاری در صفحه اصلی</span>
            </label>
          </div>

          <h3 className="font-bold text-gray-700 mt-6 pt-4 border-t">آمار صفحه اصلی (Hero)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="آمار ۱ (ویلاهای فروش رفته)" value={settings.hero_stat_1 || ''} onChange={e => setSettings({...settings, hero_stat_1: e.target.value})} />
            <Input label="آمار ۲ (سال تجربه)" value={settings.hero_stat_2 || ''} onChange={e => setSettings({...settings, hero_stat_2: e.target.value})} />
            <Input label="آمار ۳ (رضایت مشتری)" value={settings.hero_stat_3 || ''} onChange={e => setSettings({...settings, hero_stat_3: e.target.value})} />
          </div>

          <div className="mt-6 pt-4 border-t">
             <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات فوتر</label>
             <textarea className="w-full border rounded-lg p-3 h-20 focus:ring-2 focus:ring-orange-500" value={settings.footer_desc || ''} onChange={e => setSettings({...settings, footer_desc: e.target.value})}></textarea>
          </div>

          <div className="flex justify-end border-t pt-4">
            <Button type="submit">ذخیره تنظیمات سایت</Button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold mb-4 border-b pb-2">تغییر رمز عبور</h2>
        <form onSubmit={handleChangePassword} className="space-y-4 max-w-sm">
           <Input label="رمز عبور فعلی" type="password" dir="ltr" className="text-left" value={pwds.currentPassword} onChange={e => setPwds({...pwds, currentPassword: e.target.value})} required/>
           <Input label="رمز عبور جدید" type="password" dir="ltr" className="text-left" value={pwds.newPassword} onChange={e => setPwds({...pwds, newPassword: e.target.value})} minLength={6} required/>
           <Button type="submit">بروزرسانی رمز عبور</Button>
        </form>
      </div>
    </div>
  );
};
