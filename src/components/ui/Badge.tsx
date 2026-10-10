import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'outline';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '', ...props }: BadgeProps) {
  const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900';
  
  const variants = {
    default: 'bg-slate-700 text-slate-100 hover:bg-slate-600',
    primary: 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30',
    success: 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30',
    danger: 'bg-red-500/20 text-red-300 hover:bg-red-500/30',
    outline: 'border border-slate-600 text-slate-300',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}
