'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { Spinner } from '../components/ui';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { getDealTypeLabel, getStatusLabel, getStatusColor, formatPrice } from '../utils/helpers';
import Link from 'next/link';

export const DashboardPage = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/dashboard/stats'),
      api.get('/dashboard/chart'),
      api.get('/dashboard/recent')
    ]).then(([stats, chart, recent]) => {
      setData({ stats: stats.data, chart: chart.data, recent: recent.data });
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!data) return null;

  const statCards = [
    { label: 'کل آگهی‌ها', value: data.stats.total_listings, color: 'border-blue-500' },
    { label: 'آگهی فعال', value: data.stats.active_listings, color: 'border-green-500' },
    { label: 'پیام‌های جدید', value: data.stats.new_inquiries, color: 'border-red-500' },
    { label: 'بازدید کل', value: data.stats.total_views, color: 'border-purple-500' },
  ];

  const pieColors: Record<string, string> = { active: '#22c55e', sold: '#3b82f6', rented: '#a855f7', pending: '#eab308', inactive: '#ef4444'};

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">داشبورد</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <div key={i} className={`bg-white rounded-lg shadow p-6 border-r-4 ${s.color}`}>
            <p className="text-gray-500 text-sm font-medium">{s.label}</p>
            <p className="text-3xl font-bold mt-2">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold mb-4">آگهی‌ها بر اساس نوع معامله</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.chart.dealType}>
                <XAxis dataKey="deal_type" tickFormatter={getDealTypeLabel} />
                <YAxis />
                <Tooltip labelFormatter={(label: any) => getDealTypeLabel(label)} />
                <Bar dataKey="count" fill="#E8611A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold mb-4">وضعیت آگهی‌ها</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.chart.status} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80}>
                  {data.chart.status.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={pieColors[entry.status] || '#cbd5e1'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any, name: any) => [value, getStatusLabel(name)]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b"><h2 className="text-lg font-bold">آخرین آگهی‌ها</h2></div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 text-right">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500">عنوان</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500">معامله</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500">قیمت</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.recent.listings.map((l: any) => (
                  <tr key={l.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap"><Link href={`/admin/listings/${l.id}/edit`} className="text-blue-600 hover:underline">{l.title}</Link></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getDealTypeLabel(l.deal_type)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPrice(l.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-bold">آخرین پیام‌ها</h2>
            <Link href="/admin/inquiries" className="text-sm text-orange-600">مشاهده همه</Link>
          </div>
          <div className="divide-y divide-gray-200">
            {data.recent.inquiries.map((iq: any) => (
              <div key={iq.id} className={`p-4 ${!iq.is_read ? 'bg-orange-50/50 border-r-4 border-orange-500' : ''}`}>
                <div className="flex justify-between">
                  <p className="font-bold">{iq.name}</p>
                  <p className="text-xs text-gray-400">{new Date(iq.created_at).toLocaleDateString('fa-IR')}</p>
                </div>
                <p className="text-sm text-gray-600 mt-1 truncate">{iq.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
