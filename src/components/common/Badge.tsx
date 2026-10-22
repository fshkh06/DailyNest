import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'discount' | 'stock' | 'trending' | 'deal' | 'neutral';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = ''
}) => {
  const styles = {
    discount: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    deal: 'bg-amber-50 text-amber-700 border-amber-200/80',
    trending: 'bg-teal-50 text-teal-800 border-teal-200/80',
    stock: 'bg-rose-50 text-rose-700 border-rose-200/80',
    neutral: 'bg-neutral-100 text-neutral-700 border-neutral-200'
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
