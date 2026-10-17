'use client';

import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from '../../_admin/context/AuthContext';
import { Sidebar } from '../../_admin/components/layout/Sidebar';
import { Spinner } from '../../_admin/components/ui';
import { usePathname, useRouter } from 'next/navigation';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [loading, isAuthenticated, pathname, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Spinner /></div>;
  if (!isAuthenticated && pathname !== '/admin/login') {
    return null;
  }

  // If we are on login page, don't show the sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen pt-[84px] overflow-hidden bg-gray-50 text-right" dir="rtl">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow relative z-10 lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button onClick={() => setSidebarOpen(true)} className="text-gray-500 hover:text-gray-700">
              <Menu className="h-6 w-6" />
            </button>
            <span className="font-bold text-gray-900">بادیز املاک</span>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutContent>
        {children}
        <Toaster position="top-center" toastOptions={{ style: { fontFamily: 'inherit', fontSize: '14px' } }} />
      </AdminLayoutContent>
    </AuthProvider>
  );
}
