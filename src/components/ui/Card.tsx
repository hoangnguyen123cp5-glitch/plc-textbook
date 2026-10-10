import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  gradientHover?: boolean;
}

export function Card({ children, className = '', gradientHover = false, ...props }: CardProps) {
  return (
    <div
      className={`
        bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl overflow-hidden
        transition-all duration-300
        ${gradientHover ? 'hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:border-slate-600 hover:-translate-y-1' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-6 pb-4 ${className}`}>{children}</div>;
}

export function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-6 pt-0 flex items-center ${className}`}>{children}</div>;
}
