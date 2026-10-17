'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { Spinner } from '../components/ui';
import toast from 'react-hot-toast';
import { getImageUrl } from '../utils/helpers';
import { Trash2, ExternalLink, HardDrive } from 'lucide-react';
import Link from 'next/link';

export const MediaLibraryPage = () => {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await api.get('/media');
      setMedia(res.data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('آیا از حذف این تصویر مطمئن هستید؟ این عکس از آگهی مربوطه نیز پاک خواهد شد!')) return;
    try {
      await api.del(`/media/${id}`);
      toast.success('تصویر با موفقیت حذف شد');
      setMedia(media.filter(m => m.id !== id));
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0 || !bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalSize = media.reduce((acc, curr) => acc + (curr.file_size || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">گالری تصاویر آپلود شده</h1>
        <div className="bg-orange-50 text-orange-800 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2" dir="ltr">
          <HardDrive className="w-4 h-4" />
          Total Size: {formatBytes(totalSize)}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {loading ? <Spinner /> : media.length === 0 ? (
          <div className="p-8 text-center text-gray-500">هیچ تصویری آپلود نشده است.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {media.map((item) => (
              <div key={item.id} className="relative group rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <img src={getImageUrl(item.filename)} alt={item.original_name} className="w-full h-32 object-cover" loading="lazy" />
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex justify-end gap-1">
                    {item.listing_id && (
                       <Link href={`/admin/listings/${item.listing_id}/edit`} title="مشاهده آگهی" className="p-1.5 bg-white text-gray-800 rounded-full hover:bg-gray-200">
                         <ExternalLink className="w-3.5 h-3.5" />
                       </Link>
                    )}
                    <button onClick={() => handleDelete(item.id)} title="حذف تصویر" className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <div className="text-white text-xs">
                    <p className="truncate font-medium mb-1" dir="ltr">{item.original_name || item.filename}</p>
                    <p className="opacity-80 flex justify-between">
                       <span>{formatBytes(item.file_size)}</span>
                       {item.listing_id && <span className="text-orange-300">#{item.listing_id}</span>}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
