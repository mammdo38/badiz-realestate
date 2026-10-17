'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, MessageSquare, Map, Settings, Users, Menu, X, LogOut, Home, UserCircle, Image } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (o: boolean) => void }) => {
  const { admin, logout } = useAuth();
  const pathname = usePathname();
  
  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'داشبورد' },
    { to: '/admin/listings', icon: Home, label: 'آگهی‌ها' },
    { to: '/admin/inquiries', icon: MessageSquare, label: 'پیام‌ها' },
    { to: '/admin/posts', icon: FileText, label: 'مقالات' },
    { to: '/admin/regions', icon: Map, label: 'مناطق' },
    { to: '/admin/map-locations', icon: Map, label: 'نقشه' },
    { to: '/admin/agents', icon: UserCircle, label: 'مشاورین' },
    { to: '/admin/media', icon: Image, label: 'گالری تصاویر' },
  ];

  const systemItems = [
    { to: '/admin/settings', icon: Settings, label: 'تنظیمات' },
    ...(admin?.role === 'superadmin' ? [{ to: '/admin/admins', icon: Users, label: 'مدیران' }] : [])
  ];

  const renderLink = (item: any) => {
    const isActive = pathname === item.to || (item.to !== '/admin' && pathname?.startsWith(item.to));
    return (
      <Link
        key={item.to}
        href={item.to}
        onClick={() => setIsOpen(false)}
        className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${isActive ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
      >
        <item.icon className="h-5 w-5 ml-3" />
        {item.label}
      </Link>
    );
  };

  return (
    <>
      <div className={`fixed inset-0 bg-gray-900/80 z-20 lg:hidden ${isOpen ? 'block' : 'hidden'}`} onClick={() => setIsOpen(false)} />
      <div className={`fixed inset-y-0 right-0 w-64 bg-gray-900 text-white shadow-xl z-30 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : 'translate-x-full lg:static lg:flex-shrink-0'}`}>
        <div className="flex items-center justify-between h-16 px-6 bg-black">
          <div className="flex items-center">
            <span className="text-xl font-bold">بادیز املاک</span>
          </div>
          <button className="lg:hidden" onClick={() => setIsOpen(false)}>
            <X className="h-6 w-6 text-gray-400" />
          </button>
        </div>
        
        <div className="overflow-y-auto h-[calc(100%-4rem)] flex flex-col">
          <div className="py-4 flex-1">
            <div className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">مدیریت</div>
            {navItems.map(renderLink)}
            
            <div className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-2">سیستم</div>
            {systemItems.map(renderLink)}
          </div>
          
          <div className="p-4 bg-gray-800">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                {admin?.name.charAt(0)}
              </div>
              <div className="mr-3">
                <p className="text-sm font-medium">{admin?.name}</p>
                <p className="text-xs text-gray-400">{admin?.role === 'superadmin' ? 'مدیر کل' : 'مدیر'}</p>
              </div>
            </div>
            <button onClick={logout} className="flex items-center text-sm text-red-400 hover:text-red-300 w-full">
              <LogOut className="h-4 w-4 ml-2" /> خروج از حساب
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
