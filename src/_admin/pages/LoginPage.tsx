'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui';
import { api } from '../utils/api';
import toast from 'react-hot-toast';
import LogoIcon from '../../components/LogoIcon';

export const LoginPage = () => {
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      const res = await api.post('/auth/login', data);
      toast.success(res.message);
      login(res.data.token, res.data.admin);
      router.push('/admin');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 border-t-4 border-orange-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center mb-8">
            <LogoIcon className="h-16 w-auto text-gray-900" />
          </div>
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-8">ورود به پنل مدیریت</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="ایمیل"
              type="email"
              dir="ltr"
              className="text-left"
              {...register('email', { required: 'ایمیل الزامی است' })}
              error={errors.email?.message as string}
            />
            <div className="relative">
              <Input
                label="رمز عبور"
                type={showPassword ? 'text' : 'password'}
                dir="ltr"
                className="text-left"
                {...register('password', { required: 'رمز عبور الزامی است' })}
                error={errors.password?.message as string}
              />
              <button
                type="button"
                className="absolute left-3 top-9 text-gray-500 text-sm"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'مخفی' : 'نمایش'}
              </button>
            </div>
            <Button type="submit" className="w-full" isLoading={isSubmitting}>ورود</Button>
          </form>
        </div>
      </div>
    </div>
  );
};
