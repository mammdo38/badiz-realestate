'use client';

import { Printer } from 'lucide-react';

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="flex items-center gap-2 px-4 py-2 bg-white border border-[var(--color-border)] rounded-lg text-sm font-medium text-[var(--color-gray)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors"
    >
      <Printer size={16} /> چاپ
    </button>
  );
}
