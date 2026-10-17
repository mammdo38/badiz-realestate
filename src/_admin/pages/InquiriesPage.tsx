'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Spinner, Select, Button, Badge } from '../components/ui';
import toast from 'react-hot-toast';
import { Phone, ExternalLink, Calendar, CheckCircle, Trash2, Archive } from 'lucide-react';
import { api } from '../utils/api';
export const InquiriesPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ unread: '', archived: 'false', type: '' });

  const fetchInquiries = () => {
    setLoading(true);
    const q = new URLSearchParams(filters as any).toString();
    api.get(`/inquiries?${q}`)
      .then(res => setData(res.data))
      .catch(err => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchInquiries(); }, [filters]);

  const handleAction = async (id: number, action: 'read' | 'archive' | 'delete', val?: string) => {
    try {
      if (action === 'read') await api.patch(`/inquiries/${id}/read`, {});
      if (action === 'archive') await api.patch(`/inquiries/${id}/archive`, {});
      if (action === 'delete' && window.confirm('حذف شود؟')) await api.del(`/inquiries/${id}`);
      
      if (action === 'delete' || action === 'archive') fetchInquiries();
      else {
        // optimistically update read status
        setData(data.map(d => d.id === id ? {...d, is_read: true} : d));
      }
    } catch(e: any) { toast.error(e.message); }
  };

  const handleNote = async (id: number, note: string) => {
    try {
      await api.patch(`/inquiries/${id}/note`, { admin_note: note });
      toast.success('یادداشت ثبت شد');
    } catch(e: any) { toast.error(e.message); }
  }

  const getTypeLabel = (t: string) => {
    const map: any = { general: 'عمومی', listing: 'مربوط به ملک', investment: 'مشاوره سرمایه‌گذاری', consult: 'درخواست مشاوره'};
    return map[t] || t;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">مدیریت پیام‌ها و فرم‌ها</h1>

      <div className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row gap-4 mb-6">
        <Select label="وضعیت" options={[{value: '', label: 'همه'}, {value: 'true', label: 'فقط خوانده نشده'}]} value={filters.unread} onChange={e => setFilters({...filters, unread: e.target.value})} className="md:w-1/4" />
        <Select label="نوع پیام" options={[{value: 'general', label: 'عمومی'}, {value: 'listing', label: 'ملک'}, {value: 'investment', label: 'سرمایه‌گذاری'}, {value: 'consult', label: 'مشاوره'}]} value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})} className="md:w-1/4" />
        <Select label="آرشیو" options={[{value: 'false', label: 'پیام‌های فعال'}, {value: 'true', label: 'آرشیو شده'}]} value={filters.archived} onChange={e => setFilters({...filters, archived: e.target.value})} className="md:w-1/4" />
      </div>

      {loading ? <Spinner /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {data.length === 0 && <p className="text-gray-500 p-4">پیامی یافت نشد.</p>}
          {data.map(iq => (
            <div key={iq.id} className={`bg-white rounded-xl shadow-md overflow-hidden flex flex-col ${!iq.is_read ? 'border-r-4 border-orange-500' : 'border border-gray-200'}`}>
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{iq.name}</h3>
                    <a href={`tel:${iq.phone}`} className="text-orange-600 flex items-center text-sm font-medium mt-1 hover:underline" dir="ltr">
                      <Phone className="w-3 h-3 ml-1" /> {iq.phone}
                    </a>
                  </div>
                  <Badge className="bg-gray-100 text-gray-800">{getTypeLabel(iq.inquiry_type)}</Badge>
                </div>
                
                {iq.listing_title && (
                  <div className="bg-orange-50/50 text-orange-900 text-xs p-3.5 rounded-xl mb-4 border border-orange-100 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[10px] uppercase text-orange-700 tracking-wider">مربوط به ملک (آگهی)</span>
                      <div className="flex items-center gap-2">
                        <a href={`/listing/${iq.listing_slug || iq.listing_id}`} target="_blank" className="p-1 bg-white text-orange-600 rounded-md border border-orange-100 hover:bg-orange-50 transition" title="مشاهده آگهی در سایت">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <Link href={`/admin/listings/${iq.listing_id}/edit`} className="p-1 bg-white text-orange-600 rounded-md border border-orange-100 hover:bg-orange-50 transition" title="ویرایش ملک در پنل ادمین">
                          <span className="text-[10px] font-bold px-1">ویرایش ادمین</span>
                        </Link>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-800 truncate" title={iq.listing_title}>{iq.listing_title}</p>
                    <div className="text-[10px] text-gray-500">
                      کد سیستمی ملک: {iq.listing_id}
                    </div>
                  </div>
                )}
                
                <p className="text-gray-700 text-sm leading-relaxed mb-4 whitespace-pre-line">{iq.message}</p>
                
                <textarea 
                  className="w-full text-sm border bg-gray-50 p-2 rounded focus:ring-1 focus:ring-orange-500 h-16" 
                  placeholder="یادداشت مدیر (اینترنال)..."
                  defaultValue={iq.admin_note || ''}
                  onBlur={(e) => { 
                    if(e.target.value !== (iq.admin_note || '')) {
                      handleNote(iq.id, e.target.value);
                    }
                  }}
                ></textarea>
              </div>
              
              <div className="bg-gray-50 px-5 py-3 border-t flex justify-between items-center text-sm text-gray-500">
                <div className="flex flex-wrap gap-2">
                  {!iq.is_read && <button onClick={() => handleAction(iq.id, 'read')} title="علامت خوانده شده" className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200"><CheckCircle className="w-4 h-4"/></button>}
                  {!iq.is_archived && <button onClick={() => handleAction(iq.id, 'archive')} title="آرشیو" className="p-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"><Archive className="w-4 h-4"/></button>}
                  <button onClick={() => handleAction(iq.id, 'delete')} title="حذف" className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200"><Trash2 className="w-4 h-4"/></button>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 ml-1"/> {new Date(iq.created_at).toLocaleDateString('fa-IR')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
