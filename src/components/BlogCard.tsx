import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';
import { getImageUrl } from '../utils';
import { BlogPost } from '../types';
import { cn } from '../utils';

interface Props {
  post: BlogPost;
  featured?: boolean;
}

const catColors: Record<string, string> = {
  guide: 'text-orange-700 bg-orange-100',
  price: 'text-blue-700 bg-blue-100',
  investment: 'text-green-700 bg-green-100',
  region: 'text-purple-700 bg-purple-100',
  legal: 'text-yellow-700 bg-yellow-100',
};

const catNames: Record<string, string> = {
  guide: 'راهنمای خرید',
  price: 'قیمت‌ها',
  investment: 'سرمایه‌گذاری',
  region: 'مناطق',
  legal: 'حقوقی',
};

export default function BlogCard({ post, featured = false }: Props) {
  if (featured) {
    return (
      <Link 
        href={`/magazine/${post.slug}`}
        className="group grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl border border-black/5 shadow-[0_4px_20px_rgb(0,0,0,0.04)] overflow-hidden hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300"
      >
        {post.coverImage ? (
          <div className="relative w-full h-64 md:h-full overflow-hidden">
            <img 
              src={getImageUrl(post.coverImage)} 
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-4 right-4">
              <span className={cn("px-3 py-1 text-sm font-bold rounded-lg shadow-sm", catColors[post.category] || 'bg-gray-100 text-gray-700')}>
                {catNames[post.category]}
              </span>
            </div>
          </div>
        ) : (
          <div className={cn("relative w-full h-64 md:h-full flex items-center justify-center bg-gradient-to-br", post.bgGradient)}>
            <span className="text-8xl filter drop-shadow-md group-hover:scale-110 transition-transform duration-300 transform -rotate-6">{post.imageEmoji}</span>
            <div className="absolute top-4 right-4">
              <span className={cn("px-3 py-1 text-sm font-bold rounded-lg shadow-sm", catColors[post.category] || 'bg-gray-100 text-gray-700')}>
                {catNames[post.category]}
              </span>
            </div>
          </div>
        )}
        <div className="p-6 md:p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-[var(--color-dark)] mb-4 leading-tight group-hover:text-[var(--color-orange)] transition-colors">
            {post.title}
          </h2>
          <p className="text-[var(--color-gray)] mb-6 line-clamp-3">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-4 text-xs font-medium text-[var(--color-gray-mid)] mt-auto">
            <div className="flex items-center gap-1.5"><Calendar size={14}/> <span>{post.date}</span></div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link 
      href={`/magazine/${post.slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-black/5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden hover:shadow-[0_12px_30px_rgb(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1"
    >
      {post.coverImage ? (
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          <img 
            src={getImageUrl(post.coverImage)} 
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 right-3">
            <span className={cn("px-2.5 py-1 text-xs font-bold rounded-lg shadow-sm", catColors[post.category] || 'bg-gray-100 text-gray-700')}>
              {catNames[post.category]}
            </span>
          </div>
        </div>
      ) : (
        <div className={cn("relative w-full aspect-[4/3] flex items-center justify-center bg-gradient-to-br", post.bgGradient)}>
          <span className="text-6xl filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300 transform -rotate-6">{post.imageEmoji}</span>
          <div className="absolute top-3 right-3">
            <span className={cn("px-2.5 py-1 text-xs font-bold rounded-lg shadow-sm", catColors[post.category] || 'bg-gray-100 text-gray-700')}>
              {catNames[post.category]}
            </span>
          </div>
        </div>
      )}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-[var(--color-dark)] text-lg mb-2 leading-snug line-clamp-2 group-hover:text-[var(--color-orange)] transition-colors">
          {post.title}
        </h3>
        <p className="text-[var(--color-gray)] text-sm mb-4 line-clamp-2">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between text-xs font-medium text-[var(--color-gray-mid)] mt-auto pt-4 border-t border-[var(--color-border)]">
          <div className="flex flex-wrap gap-x-3 gap-y-2">
            <div className="flex items-center gap-1.5"><Calendar size={14}/> <span>{post.date}</span></div>
          </div>
        </div>
      </div>
    </Link>
  );
}
