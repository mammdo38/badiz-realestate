'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { api } from '../utils/api';
import { Button, Input, Select, Spinner } from '../components/ui';
import toast from 'react-hot-toast';
import { getImageUrl } from '../utils/helpers';
import { X, Star } from 'lucide-react';

export const ListingFormPage = () => {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [loading, setLoading] = useState(!!id);
  const [regions, setRegions] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [tab, setTab] = useState(0);
  const [images, setImages] = useState<any[]>([]);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  
  const { register, handleSubmit, control, reset, watch, formState: { errors, isSubmitting } } = useForm();
  
  const dealType = watch('deal_type');
  const agentId = watch('agent_id');

  useEffect(() => {
    api.get('/regions').then(res => setRegions(res.data)).catch(() => {});
    api.get('/agents').then(res => setAgents(res.data)).catch(() => {});
    
    if (id) {
      api.get(`/listings/admin/${id}`).then(res => {
        const d = res.data;
        [
          'has_pool', 'has_garden', 'has_parking', 'has_elevator', 'has_storage', 'has_security', 
          'three_phase_power', 'truck_access', 'has_water', 'has_electricity', 'has_gas', 
          'has_cctv', 'has_gazebo', 'has_bbq', 'has_master_deed', 'has_antenna',
          'price_negotiable', 'is_featured', 'is_investment', 'is_urgent', 'in_baft'
        ].forEach(k => {
          d[k] = Boolean(d[k]);
        });
        if (d.price) d.price = parseInt(String(d.price).replace(/\D/g, '')).toLocaleString('en-US');
        if (d.price_per_night) d.price_per_night = parseInt(String(d.price_per_night).replace(/\D/g, '')).toLocaleString('en-US');
        if (d.deposit_price) d.deposit_price = parseInt(String(d.deposit_price).replace(/\D/g, '')).toLocaleString('en-US');
        if (d.monthly_rent) d.monthly_rent = parseInt(String(d.monthly_rent).replace(/\D/g, '')).toLocaleString('en-US');
        reset(d);
        setImages(d.images || []);
        setLoading(false);
      }).catch(err => {
        toast.error(err.message);
        router.push('/admin/listings');
      });
    }
  }, [id]);

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    const booleanFields = [
      'has_pool', 'has_garden', 'has_parking', 'has_elevator', 'has_storage', 'has_security',
      'three_phase_power', 'truck_access', 'has_water', 'has_electricity', 'has_gas',
      'has_cctv', 'has_gazebo', 'has_bbq', 'has_master_deed', 'has_antenna',
      'price_negotiable', 'is_featured', 'is_investment', 'is_urgent', 'in_baft'
    ];
    Object.keys(data).forEach(key => {
      if (booleanFields.includes(key)) {
        formData.append(key, data[key] ? 'true' : 'false');
      } else if (key === 'price' || key === 'price_per_night' || key === 'deposit_price' || key === 'monthly_rent') {
        // Strip commas from formatted price before sending
        const raw = String(data[key] || '').replace(/[,\s]/g, '');
        if (raw) formData.append(key, raw);
      } else if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
        formData.append(key, data[key]);
      }
    });
    uploadFiles.forEach(f => formData.append('images', f));

    try {
      if (id) {
        const res = await api.putForm(`/listings/${id}`, formData);
        toast.success(res.message);
        router.push('/admin/listings');
      } else {
        const res = await api.postForm('/listings', formData);
        toast.success(res.message);
        router.push('/admin/listings');
      }
    } catch(e: any) { toast.error(e.message); }
  };

  const deleteImage = async (imgId: number) => {
    try {
      const res = await api.del(`/listings/images/${imgId}`);
      toast.success(res.message);
      setImages(images.filter(i => i.id !== imgId));
    } catch(e: any) { toast.error(e.message); }
  };

  const setPrimaryImage = async (imgId: number) => {
    try {
      const res = await api.patch(`/listings/images/${imgId}/primary`, {});
      toast.success(res.message);
      setImages(images.map(i => ({...i, is_primary: i.id === imgId})));
    } catch(e: any) { toast.error(e.message); }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">{id ? 'ویرایش آگهی' : 'آگهی جدید'}</h1>
      
      <div className="bg-white rounded-lg shadow">
        <div className="flex border-b overflow-x-auto">
          {['اطلاعات اصلی', 'جزئیات ملک', 'تصاویر', 'سئو'].map((t, i) => (
            <button key={i} onClick={() => setTab(i)} className={`px-4 py-3 font-medium whitespace-nowrap min-w-max ${tab === i ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500 hover:text-gray-700'}`}>
              {t}
            </button>
          ))}
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className={tab !== 0 ? 'hidden' : 'space-y-4'}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="عنوان" {...register('title', {required: 'اجباری'})} error={errors.title?.message as string}/>
              <Select label="وضعیت" options={[
                {value: 'active', label: 'فعال'}, {value: 'sold', label: 'فروخته شده'}, {value: 'rented', label: 'اجاره رفته'}, {value: 'pending', label: 'در حال بررسی'}, {value: 'inactive', label: 'غیرفعال'}
              ]} {...register('status')} />
              
              <Select label="نوع معامله" options={[
                {value: 'sell', label: 'فروش'}, {value: 'annual_rent', label: 'رهن و اجاره'}, {value: 'daily_rent', label: 'اجاره روزانه'}
              ]} {...register('deal_type', {required: 'اجباری'})} error={errors.deal_type?.message as string}/>
              
              <Select label="نوع ملک" options={[
                {value: 'villa', label: 'ویلا'}, {value: 'garden', label: 'باغ'}, {value: 'land', label: 'زمین'}, {value: 'apartment', label: 'آپارتمان'}
              ]} {...register('property_type', {required: 'اجباری'})} error={errors.property_type?.message as string}/>
              
              <Select label="منطقه" options={regions.map(r => ({value: r.id, label: r.name_fa}))} {...register('region_id', {required: 'اجباری'})} error={errors.region_id?.message as string}/>
              
              {dealType !== 'daily_rent' && (
                <>
                  <Select label="نوع سند (اعتمادساز)" options={[
                    {value: 'سند تک‌برگ', label: 'سند تک‌برگ'}, {value: 'سند مشاع', label: 'سند مشاع'}, {value: 'قولنامه‌ای با کدرهگیری', label: 'قولنامه‌ای'}, {value: 'سند اصلاحات ارضی', label: 'اصلاحات ارضی'}
                  ]} {...register('document_type')} />

                  <Select label="جهت ملک (اعتمادساز)" options={[
                    {value: 'شمالی', label: 'شمالی'}, {value: 'جنوبی', label: 'جنوبی'}, {value: 'شرقی', label: 'شرقی'}, {value: 'غربی', label: 'غربی'}
                  ]} {...register('property_direction')} />
                </>
              )}
              
              {dealType === 'annual_rent' ? (
                <>
                  <div className="w-full">
                    <Input 
                      label="مبلغ ودیعه / پول پیش (تومان)" 
                      type="text" 
                      dir="ltr"
                      className="text-left font-mono"
                      {...register('deposit_price', {
                        onChange: (e) => {
                          const raw = e.target.value.replace(/\D/g, '');
                          e.target.value = raw ? parseInt(raw).toLocaleString('en-US') : '';
                        }
                      })} 
                    />
                  </div>
                  <div className="w-full">
                    <Input 
                      label="اجاره ماهانه (تومان)" 
                      type="text" 
                      dir="ltr"
                      placeholder="در صورت رهن کامل خالی بگذارید"
                      className="text-left font-mono"
                      {...register('monthly_rent', {
                        onChange: (e) => {
                          const raw = e.target.value.replace(/\D/g, '');
                          e.target.value = raw ? parseInt(raw).toLocaleString('en-US') : '';
                        }
                      })} 
                    />
                    <p className="text-xs text-slate-500 mt-1 font-medium text-right">
                      💡 در صورت **رهن کامل**، مبلغ اجاره ماهانه را خالی بگذارید یا ۰ وارد کنید.
                    </p>
                  </div>
                </>
              ) : dealType === 'daily_rent' ? (
                <div className="w-full">
                  <Input 
                    label="قیمت هر شب (تومان)" 
                    type="text" 
                    dir="ltr"
                    className="text-left font-mono"
                    {...register('price_per_night', {
                      onChange: (e) => {
                        const raw = e.target.value.replace(/\D/g, '');
                        e.target.value = raw ? parseInt(raw).toLocaleString('en-US') : '';
                      }
                    })} 
                  />
                </div>
              ) : (
                <div className="w-full">
                  <Input 
                    label="قیمت کل (تومان)" 
                    type="text" 
                    dir="ltr"
                    className="text-left font-mono"
                    {...register('price', {
                      onChange: (e) => {
                        const raw = e.target.value.replace(/\D/g, '');
                        e.target.value = raw ? parseInt(raw).toLocaleString('en-US') : '';
                      }
                    })} 
                  />
                  {watch('price') && (watch('size_land') || watch('size_built')) && (
                    <p className="text-xs text-blue-600 mt-1 font-medium text-right">
                      قیمت هر متر: {Math.round(parseInt(String(watch('price')).replace(/\D/g, '')) / (parseInt(watch('size_land')) || parseInt(watch('size_built')) || 1)).toLocaleString('fa-IR')} تومان
                    </p>
                  )}
                </div>
              )}
              {dealType !== 'daily_rent' && (
                <Input label="برچسب قیمت (مثلا: متری ۱۰ میلیون)" {...register('price_label')} />
              )}
            </div>
            
            <div className="flex flex-wrap gap-4 mb-4">
              <label className="flex items-center gap-2"><input type="checkbox" {...register('price_negotiable')} /> قیمت توافقی</label>
              <label className="flex items-center gap-2"><input type="checkbox" {...register('is_featured')} /> آگهی ویژه</label>
              {dealType !== 'daily_rent' && (
                <>
                  <label className="flex items-center gap-2"><input type="checkbox" {...register('is_investment')} /> فرصت سرمایه‌گذاری</label>
                  <label className="flex items-center gap-2 text-red-600 font-bold"><input type="checkbox" {...register('is_urgent')} /> فروش فوری (زیر قیمت)</label>
                </>
              )}
            </div>
            
            <Input label="توضیح کوتاه (نمایش در کارت‌ها)" {...register('short_desc')} />
            <div className="w-full">
               <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات کامل</label>
               <textarea className="w-full border rounded-lg p-2 h-32" {...register('description')}></textarea>
            </div>
          </div>

          <div className={tab !== 1 ? 'hidden' : 'space-y-4'}>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <Input label="متراژ بنا" type="number" {...register('size_built')} />
               <Input label="متراژ زمین" type="number" {...register('size_land')} />
               <Input label="تعداد خواب" type="number" {...register('bedrooms')} />
               <Input label="تعداد حمام/دستشویی" type="number" {...register('bathrooms')} />
               <Input label="تعداد کل طبقات" type="number" {...register('floors')} />
               <Input label="شماره طبقه" type="number" {...register('floor_number')} />
             </div>
             {dealType !== 'daily_rent' && (
               <div className="mt-6 border rounded-xl p-4 bg-gray-50">
                 <h4 className="text-sm font-bold text-gray-700 mb-4 border-b pb-2">انشعابات و زیرساخت</h4>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {[
                     { id: 'has_water', label: 'آب' },
                     { id: 'has_electricity', label: 'برق' },
                     { id: 'has_gas', label: 'گاز شهری' },
                     { id: 'three_phase_power', label: 'برق سه فاز' }
                   ].map(item => (
                     <label key={item.id} className="flex flex-row-reverse justify-end gap-2 items-center"><input type="checkbox" {...register(item.id)} /> {item.label}</label>
                   ))}
                 </div>
               </div>
             )}

             <div className="mt-4 border rounded-xl p-4 bg-gray-50">
               <h4 className="text-sm font-bold text-gray-700 mb-4 border-b pb-2">امکانات رفاهی و امنیتی</h4>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    ...(dealType !== 'daily_rent' ? [{ id: 'has_master_deed', label: 'سند تک‌برگ' }] : []),
                    { id: 'has_pool', label: 'استخر' },
                    { id: 'has_garden', label: 'باغچه' },
                    { id: 'has_parking', label: 'پارکینگ اختصاصی' },
                    { id: 'has_elevator', label: 'آسانسور' },
                    { id: 'has_storage', label: 'انباری' },
                    { id: 'has_security', label: 'نگهبانی' },
                    { id: 'has_cctv', label: 'دوربین مداربسته' },
                    { id: 'has_gazebo', label: 'آلاچیق' },
                    { id: 'has_bbq', label: 'باربیکیو' },
                    { id: 'has_antenna', label: 'آنتن‌دهی مناسب' },
                    { id: 'truck_access', label: 'دسترسی تریلی' }
                  ].map(item => (
                    <label key={item.id} className="flex flex-row-reverse justify-end gap-2 items-center"><input type="checkbox" {...register(item.id)} /> {item.label}</label>
                  ))}
               </div>
             </div>

             {dealType !== 'daily_rent' && (
                <div className="mt-4 border rounded-xl p-4 bg-gray-50 border-blue-200">
                  <h4 className="text-sm font-bold text-blue-700 mb-4 border-b border-blue-200 pb-2">سئوی E-E-A-T (اعتمادساز)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <label className="flex flex-row-reverse justify-end gap-2 items-center text-blue-900 font-semibold">
                      <input type="checkbox" {...register('in_baft')} /> ملک داخل بافت است (دارای جواز)
                    </label>
                  </div>
                </div>
              )}
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
               <Input label="وضعیت جواز" {...register('permit_status')} />
               <Select label="انتخاب مشاور" options={[{value: '', label: 'بدون مشاور (فقط نام و شماره تماس ثبت شود)'}, ...agents.map(a => ({value: a.id, label: a.name}))]} {...register('agent_id')} />
               <div></div>
               {(!agentId || agentId === '') && (
                 <>
                   <Input label="نام مخاطب (اختیاری)" {...register('contact_name')} />
                   <Input label="شماره تماس ۱" {...register('contact_phone')} dir="ltr" />
                   <Input label="شماره تماس ۲" {...register('contact_phone_2')} dir="ltr" />
                   <Input label="شماره تماس ۳" {...register('contact_phone_3')} dir="ltr" />
                 </>
               )}
             </div>
             
             <div className="w-full mt-4">
               <label className="block text-sm font-medium text-gray-700 mb-1">آدرس دقیق</label>
               <textarea className="w-full border rounded-lg p-2 h-20" {...register('address')}></textarea>
             </div>
          </div>

          <div className={tab !== 2 ? 'hidden' : 'space-y-4'}>
             <input type="file" multiple accept="image/*" onChange={(e) => {
               if(e.target.files) setUploadFiles([...uploadFiles, ...Array.from(e.target.files)]);
             }} />
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
               {images.map(img => (
                 <div key={img.id} className="relative group rounded-lg overflow-hidden border">
                   <img src={getImageUrl(img.filename)} className="w-full h-32 object-cover" />
                   <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center gap-2">
                     <button type="button" onClick={() => setPrimaryImage(img.id)} className={`p-2 rounded-full ${img.is_primary ? 'bg-yellow-400' : 'bg-white'}`}><Star className="w-4 h-4"/></button>
                     <button type="button" onClick={() => deleteImage(img.id)} className="p-2 bg-red-500 text-white rounded-full"><X className="w-4 h-4"/></button>
                   </div>
                 </div>
               ))}
               
               {uploadFiles.map((f, idx) => (
                 <div key={idx} className="relative rounded-lg overflow-hidden border">
                   <img src={URL.createObjectURL(f)} className="w-full h-32 object-cover opacity-75" />
                   <button type="button" onClick={()=>setUploadFiles(uploadFiles.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-white rounded-full p-1"><X className="w-3 h-3 text-red-500"/></button>
                 </div>
               ))}
             </div>
          </div>

          <div className={tab !== 3 ? 'hidden' : 'space-y-4'}>
             <Input label="کلمه کلیدی" {...register('focus_keyword')} />
             <Input label={`عنوان متای سئو (${watch('meta_title')?.length || 0}/60)`} {...register('meta_title')} />
             <div className="w-full">
               <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات متا ({watch('meta_description')?.length || 0}/160)</label>
               <textarea className="w-full border rounded-lg p-2 h-20" {...register('meta_description')}></textarea>
             </div>
          </div>
          
          <div className="mt-8 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => router.push('/admin/listings')}>انصراف</Button>
            <Button type="submit" isLoading={isSubmitting}>ذخیره تغییرات</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
