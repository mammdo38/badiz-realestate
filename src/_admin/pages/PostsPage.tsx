'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../utils/api';
import { Spinner, Badge, Button } from '../components/ui';
import { getCategoryLabel } from '../utils/helpers';
import toast from 'react-hot-toast';
import { Edit, Trash2 } from 'lucide-react';

export const PostsPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = () => {
    setLoading(true);
    api.get('/posts/admin/all')
      .then(res => setData(res.data))
      .catch(err => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('آیا از حذف این مقاله اطمینان دارید؟')) {
      try {
        const res = await api.del(`/posts/${id}`);
        toast.success(res.message);
        fetchPosts();
      } catch(e: any) { toast.error(e.message); }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">مدیریت مقالات</h1>
        <Link href="/admin/posts/new">
          <Button>+ مقاله جدید</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? <Spinner /> : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">عنوان</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">دسته‌بندی</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">وضعیت</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">بازدید</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">تاریخ</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      <Link href={`/admin/posts/${item.id}/edit`} className="hover:underline">{item.title}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getCategoryLabel(item.category)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Badge className={item.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {item.is_published ? 'منتشر شده' : 'پیش‌نویس'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.views}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString('fa-IR')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
                      <Link href={`/admin/posts/${item.id}/edit`} className="inline-block text-indigo-600 hover:text-indigo-900 ml-4"><Edit className="w-5 h-5"/></Link>
                      <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-5 h-5"/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
