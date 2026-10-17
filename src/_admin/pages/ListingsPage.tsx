'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../utils/api';
import { Spinner, Badge, Select, Input, Button } from '../components/ui';
import { getPropertyTypeLabel, getDealTypeLabel, getStatusLabel, getStatusColor, formatPrice, getImageUrl } from '../utils/helpers';
import toast from 'react-hot-toast';
import { Edit, Trash2, Filter, ChevronDown, ChevronUp } from 'lucide-react';

export const ListingsPage = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: '', deal_type: '', property_type: '', page: 1 });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const fetchListings = () => {
    setLoading(true);
    const q = new URLSearchParams(filters as any).toString();
    api.get(`/listings/admin/all?${q}`)
      .then(res => setData(res))
      .catch(err => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchListings(), 300);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleDelete = async (id: number) => {
    if (window.confirm('آیا از حذف این آگهی اطمینان دارید؟')) {
      try {
        const res = await api.del(`/listings/${id}`);
        toast.success(res.message);
        fetchListings();
      } catch(e: any) { toast.error(e.message); }
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await api.patch(`/listings/${id}/status`, { status });
      toast.success(res.message);
      fetchListings();
    } catch(e: any) { toast.error(e.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">مدیریت آگهی‌ها</h1>
        <Link href="/admin/listings/new">
          <Button>+ آگهی جدید</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <button 
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          className="md:hidden w-full p-4 flex items-center justify-between font-bold text-gray-700"
        >
          <span className="flex items-center gap-2"><Filter size={18} className="text-orange-500" /> فیلترها</span>
          {isMobileFilterOpen ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
        </button>
        <div className={`p-4 border-t border-gray-100 flex-col md:flex-row gap-4 ${isMobileFilterOpen ? 'flex' : 'hidden md:flex'}`}>
          <Input placeholder="جستجو در عنوان..." value={filters.search} onChange={e => setFilters({...filters, search: e.target.value, page: 1})} className="md:w-1/4" />
          <Select options={[
              {value: 'active', label: 'فعال'}, {value: 'sold', label: 'فروخته شده'}, {value: 'rented', label: 'اجاره رفته'}, {value: 'pending', label: 'در حال بررسی'}, {value: 'inactive', label: 'غیرفعال'}
            ]} value={filters.status} onChange={e => setFilters({...filters, status: e.target.value, page: 1})} className="md:w-1/5" />
          <Select options={[
              {value: 'sell', label: 'فروش'}, {value: 'annual_rent', label: 'رهن و اجاره'}, {value: 'daily_rent', label: 'اجاره روزانه'}
            ]} value={filters.deal_type} onChange={e => setFilters({...filters, deal_type: e.target.value, page: 1})} className="md:w-1/5" />
          <Select options={[
              {value: 'villa', label: 'ویلا'}, {value: 'garden', label: 'باغ'}, {value: 'land', label: 'زمین'}
            ]} value={filters.property_type} onChange={e => setFilters({...filters, property_type: e.target.value, page: 1})} className="md:w-1/5" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading && !data ? <Spinner /> : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">تصویر</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">عنوان</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">معامله/تایپ</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">قیمت</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">وضعیت</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">بازدید</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.data.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.primary_image ? (
                        <img src={getImageUrl(item.primary_image)} alt="" className="h-10 w-10 rounded object-cover" />
                      ) : <div className="h-10 w-10 bg-gray-200 rounded" />}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 border-none">
                      <Link href={`/admin/listings/${item.id}/edit`} className="hover:underline">{item.title}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Badge className="bg-blue-100 text-blue-800 ml-2">{getDealTypeLabel(item.deal_type)}</Badge>
                      {getPropertyTypeLabel(item.property_type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPrice(item.price)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select 
                        className={`text-sm rounded border-gray-300 ${getStatusColor(item.status)}`}
                        value={item.status} 
                        onChange={(e) => updateStatus(item.id, e.target.value)}
                      >
                        <option value="active">فعال</option>
                        <option value="sold">فروخته شده</option>
                        <option value="rented">اجاره رفته</option>
                        <option value="pending">در حال بررسی</option>
                        <option value="inactive">غیرفعال</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.views}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
                      <Link href={`/admin/listings/${item.id}/edit`} className="inline-block text-indigo-600 hover:text-indigo-900 ml-4"><Edit className="w-5 h-5"/></Link>
                      <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-5 h-5"/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {data?.pagination && data.pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({length: data.pagination.pages}).map((_, i) => (
             <button key={i} onClick={() => setFilters({...filters, page: i+1})} className={`w-8 h-8 rounded ${filters.page === i+1 ? 'bg-orange-500 text-white' : 'bg-white border'}`}>
               {i+1}
             </button>
          ))}
        </div>
      )}
    </div>
  );
};
