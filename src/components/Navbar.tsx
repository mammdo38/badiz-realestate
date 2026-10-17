'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Menu, X, PlusCircle, Home } from 'lucide-react';
import { cn } from '@/utils';
import LogoIcon from './LogoIcon';

export default function Navbar({ settings }: { settings?: any }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [hash, setHash] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Listen for hash change on client side
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHash(window.location.hash);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileMenuOpen(false);
  }, [pathname, hash]);

  const navLinks = [
    { label: 'آگهی‌ها', href: '/#listings' },
    { label: 'مناطق کردان', href: '/map' },
    { label: 'سرمایه‌گذاری', href: '/#investment' },
    { label: 'راهنمای خرید', href: '/magazine' }, // old /blog -> new /magazine
    { label: 'تماس با ما', href: '/#contact' },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 h-[84px] transition-all duration-300 border-b text-white",
          isScrolled ? "bg-[#2c3539]/90 backdrop-blur-xl border-white/5 shadow-[0_4px_20px_rgba(0,0,0,0.2)]" : "bg-[#2c3539] border-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          
          {/* Logo Right */}
          <Link href="/" className="flex items-center shrink-0 min-w-0 py-2">
            <LogoIcon className="h-[68px] w-auto text-white shrink-0" />
          </Link>

          {/* Desktop Nav Center */}
          <nav className="hidden md:flex items-center justify-center gap-6 md:gap-8">
            {navLinks.map((link, idx) => {
              const isActive = (pathname === link.href) || 
                (link.href.startsWith('/#') && pathname === '/' && hash === link.href.substring(1));
              return (
                <Link
                  key={idx}
                  href={link.href}
                  className={cn(
                    "text-[0.95rem] font-bold transition-colors relative py-2 group",
                    isActive ? "text-[var(--color-orange)]" : "text-gray-300 hover:text-white"
                  )}
                >
                  {link.label}
                  <span className={cn(
                    "absolute -bottom-1 left-1/2 -translate-x-1/2 h-[2.5px] rounded-full bg-[var(--color-orange)] transition-all duration-300",
                    isActive ? "w-1/2 opacity-100" : "w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-100"
                  )}></span>
                </Link>
              );
            })}
          </nav>

          {/* Phone Desktop */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <a href={`tel:${(settings?.site_phone || '02100000000').replace(/\D/g, '')}`} className="flex items-center gap-2 group text-white">
              <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-[var(--color-orange)] group-hover:text-white transition-all flex items-center justify-center">
                <Phone size={18} />
              </div>
              <span className="font-bold font-mono tracking-wider pt-1 transition-colors group-hover:text-[var(--color-orange)]" dir="ltr">
                {settings?.site_phone || '۰۲۱ - ۰۰۰۰۰۰۰۰'}
              </span>
            </a>
            <Link href="/contact?tab=entrust" className="bg-[var(--color-orange)] hover:bg-[var(--color-orange-light)] text-white px-5 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm">
              <Home size={18} />
              ثبت ملک
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-3 shrink-0">
            <Link href="/contact?tab=entrust" className="bg-[var(--color-orange)] hover:bg-[var(--color-orange-light)] text-white px-3 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm">
              <Home size={14} />
              ثبت ملک
            </Link>
            <button 
              className="text-white flex items-center justify-center p-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      <div 
        className={cn(
          "fixed inset-x-0 top-[84px] bg-[#2c3539] border-b border-white/10 shadow-lg z-40 transition-all duration-300 md:hidden flex flex-col overflow-hidden",
          mobileMenuOpen ? "max-h-[400px] py-4" : "max-h-0 py-0"
        )}
      >
        <div className="px-4 flex flex-col space-y-2">
          {navLinks.map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              className="px-4 py-3 bg-white/5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={`tel:${(settings?.site_phone || '02100000000').replace(/\D/g, '')}`}
            className="mt-4 flex items-center justify-center gap-2 border border-white/10 rounded-lg py-3 text-white font-medium font-mono bg-white/5"
          >
            <Phone size={18} className="text-gray-300" />
            <span dir="ltr">{settings?.site_phone || '۰۲۱ - ۰۰۰۰۰۰۰۰'}</span>
          </a>
        </div>
      </div>
    </>
  );
}
