'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { Spinner, Button, Input, Select, Badge } from '../components/ui';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Trash2 } from 'lucide-react';

export const AdminsPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'admin' });
  const { admin } = useAuth();

  const fetchAdmins = () => {
    setLoading(true);
    api.get('/admins')
      .then(res => setData(res.data))
      .catch(err => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => fetchAdmins(), []);

  const handleToggle = async (id: number) => {
    try {
      const res = await api.patch(`/admins/${id}/toggle`, {});
      toast.success(res.message);
      fetchAdmins();
    } catch(e: any) { toast.error(e.message); }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('آیا از حذف این مدیر اطمینان دارید؟')) {
      try {
        const res = await api.del(`/admins/${id}`);
        toast.success(res.message);
        fetchAdmins();
      } catch(e: any) { toast.error(e.message); }
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/admins', formData);
      toast.success(res.message);
      setShowModal(false);
      setFormData({ name: '', email: '', password: '', role: 'admin' });
      fetchAdmins();
    } catch(e: any) { toast.error(e.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">مدیریت اعضا</h1>
        <Button onClick={() => setShowModal(true)}>+ مدیر جدید</Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? <Spinner /> : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">نام</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">ایمیل</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">نقش</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">وضعیت</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">آخرین ورود</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map(a => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{a.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" dir="ltr text-right">{a.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{a.role === 'superadmin' ? 'مدیر کل' : 'مدیر'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button variant="ghost" className={`p-1 h-auto text-xs ${a.is_active ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`} onClick={() => handleToggle(a.id)} disabled={a.id === admin?.id}>
                        {a.is_active ? 'فعال' : 'غیرفعال'}
                      </Button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" dir="ltr text-right">
                      {a.last_login ? new Date(a.last_login).toLocaleString('fa-IR') : 'هرگز'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
                      {a.id !== admin?.id && <button onClick={() => handleDelete(a.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-5 h-5"/></button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">تعریف مدیر جدید</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input label="نام" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              <Input label="ایمیل" type="email" dir="ltr" className="text-left" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              <Input label="رمز عبور" type="password" dir="ltr" className="text-left" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} minLength={6} required />
              <Select label="نقش" options={[{value: 'admin', label:'مدیر'}, {value: 'superadmin', label:'مدیر کل'}]} value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="ghost" onClick={() => setShowModal(false)} type="button">انصراف</Button>
                <Button type="submit">ذخیره</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
