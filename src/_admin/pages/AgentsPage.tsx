'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { Button, Input, Spinner } from '../components/ui';
import toast from 'react-hot-toast';
import { Trash2, Edit, Phone, UserCheck, UserX } from 'lucide-react';
import { getImageUrl } from '../utils/helpers';

export const AgentsPage = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<any>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [isActive, setIsActive] = useState(true);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/agents');
      setAgents(res.data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      toast.error('نام و شماره تماس الزامی است');
      return;
    }

    try {
      if (isEditing) {
        await api.put(`/agents/${isEditing.id}`, { name, phone, bio, is_active: isActive });
        toast.success('مشاور بروزرسانی شد');
      } else {
        await api.post('/agents', { name, phone, bio, is_active: isActive });
        toast.success('مشاور اضافه شد');
      }
      resetForm();
      fetchAgents();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const resetForm = () => {
    setIsEditing(null);
    setName('');
    setPhone('');
    setBio('');
    setIsActive(true);
  };

  const handleEdit = (agent: any) => {
    setIsEditing(agent);
    setName(agent.name);
    setPhone(agent.phone);
    setBio(agent.bio || '');
    setIsActive(agent.is_active);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('آیا از حذف این مشاور اطمینان دارید؟')) return;
    try {
      await api.del(`/agents/${id}`);
      toast.success('مشاور با موفقیت حذف شد');
      fetchAgents();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">مدیریت مشاورین</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold mb-4">{isEditing ? 'ویرایش مشاور' : 'افزودن مشاور جدید'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="نام مشاور" value={name} onChange={e => setName(e.target.value)} placeholder="مثال: علی رضایی" />
            <Input label="شماره موبایل" value={phone} onChange={e => setPhone(e.target.value)} placeholder="مثال: 09123456789" dir="ltr" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">بیوگرافی کوتاه (اختیاری)</label>
            <textarea 
              value={bio} 
              onChange={e => setBio(e.target.value)} 
              className="w-full border rounded-lg p-2 h-24 text-sm"
              placeholder="تخصص مشاور در مناطق..."
            ></textarea>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isActive" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="w-4 h-4 text-orange-600" />
            <label htmlFor="isActive" className="text-sm">مشاور فعال است (نمایش در سایت)</label>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            {isEditing && <Button type="button" variant="secondary" onClick={resetForm}>انصراف</Button>}
            <Button type="submit">{isEditing ? 'ذخیره تغییرات' : 'افزودن مشاور'}</Button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold">لیست مشاورین</h2>
        </div>
        
        {loading ? <Spinner /> : agents.length === 0 ? (
          <div className="p-8 text-center text-gray-500">هیچ مشاوری ثبت نشده است.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">مشاور</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">شماره تماس</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">وضعیت</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {agents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                          {agent.name.charAt(0)}
                        </div>
                        <div className="ml-4 mr-3">
                          <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-1" dir="ltr">
                        <Phone className="w-3 h-3 text-gray-400" /> {agent.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${agent.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {agent.is_active ? <span className="flex items-center gap-1"><UserCheck className="w-3 h-3"/> فعال</span> : <span className="flex items-center gap-1"><UserX className="w-3 h-3"/> غیرفعال</span>}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(agent)} className="text-indigo-600 hover:text-indigo-900 p-1 bg-indigo-50 rounded"><Edit className="w-4 h-4"/></button>
                        <button onClick={() => handleDelete(agent.id)} className="text-red-600 hover:text-red-900 p-1 bg-red-50 rounded"><Trash2 className="w-4 h-4"/></button>
                      </div>
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
