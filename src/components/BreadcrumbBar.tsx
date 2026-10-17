import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
}

export default function BreadcrumbBar({ items }: Props) {
  return (
    <div className="bg-white border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 lg:px-10 py-3 flex items-center flex-wrap gap-2 text-sm">
        <Link href="/" className="text-[var(--color-gray-mid)] hover:text-[var(--color-dark)] transition">خانه</Link>
        
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <ChevronLeft size={16} className="text-[var(--color-gray-light)]" />
            {item.href ? (
              <Link href={item.href} className="text-[var(--color-gray-mid)] hover:text-[var(--color-dark)] transition">
                {item.label}
              </Link>
            ) : (
              <span className="font-bold text-[var(--color-dark)]">{item.label}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
