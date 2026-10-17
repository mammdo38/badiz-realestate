import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { defaultSettings } from "@/data";

import type { Viewport } from "next";
import localFont from "next/font/local";

const yekanBakh = localFont({
  src: [
    {
      path: "../../public/fonts/yekanbakh/YekanBakhFaNum-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/yekanbakh/YekanBakhFaNum-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/yekanbakh/YekanBakhFaNum-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/yekanbakh/YekanBakhFaNum-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/yekanbakh/YekanBakhFaNum-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-yekanbakh",
  display: "swap",
});

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getSettings() {
  try {
    const res = await fetch('http://localhost:5000/api/settings', { cache: 'no-store' });
    if (!res.ok) return defaultSettings;
    const data = await res.json();
    return data.success && data.data ? data.data : defaultSettings;
  } catch (e) {
    return defaultSettings;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  
  const siteName = settings.site_name || "بادیز";
  const tagline = settings.site_tagline || "دپارتمان تخصصی املاک کردان";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://badizvilla.ir";
  
  return {
    metadataBase: new URL(baseUrl),
    title: {
      template: `%s | ${siteName} املاک کردان`,
      default: `${siteName} | ${tagline}`,
    },
    description: "خرید و فروش ویلا، زمین و آپارتمان در کردان جنوبی، شمالی و مرکزی - دپارتمان تخصصی بادیز با بهترین کارشناسان منطقه.",
    alternates: {
      canonical: baseUrl,
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '48x48' },
        { url: '/icon-circular.png', type: 'image/png', sizes: '192x192' },
      ],
      apple: '/apple-icon.png',
    },
    openGraph: {
      title: `${siteName} | ${tagline}`,
      description: "خرید و فروش ویلا، زمین و آپارتمان در کردان جنوبی، شمالی و مرکزی - دپارتمان تخصصی بادیز با بهترین کارشناسان منطقه.",
      url: baseUrl,
      siteName: siteName,
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: `املاک ${siteName} کردان`,
        }
      ],
      locale: "fa_IR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} | ${tagline}`,
      description: "خرید و فروش ویلا، زمین و آپارتمان در کردان - دپارتمان تخصصی بادیز",
      images: [`${baseUrl}/og-image.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  return (
    <html lang="fa" dir="rtl" className={`h-full ${yekanBakh.variable}`}>
      <body className="min-h-full flex flex-col bg-[#2c3539] font-sans antialiased text-[var(--color-gray)]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "بادیز املاک",
              "url": "https://badizvilla.ir",
              "logo": "https://badizvilla.ir/logo.png"
            })
          }}
        />
        <Navbar settings={settings} />
        <main className="flex-1">
          {children}
        </main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}
