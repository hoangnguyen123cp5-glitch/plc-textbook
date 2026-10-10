'use client';

import React, { useState } from 'react';

interface InfoBoxProps {
  type?: 'note' | 'tip' | 'warning' | 'important' | 'danger';
  title?: string;
  children: React.ReactNode;
  collapsible?: boolean;
}

const config = {
  note: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    icon: (
      <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: 'Note',
    textColor: 'text-blue-300',
  },
  tip: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    icon: (
      <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    label: 'Tip',
    textColor: 'text-emerald-300',
  },
  warning: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    icon: (
      <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    label: 'Warning',
    textColor: 'text-amber-300',
  },
  important: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    icon: (
      <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: 'Important',
    textColor: 'text-purple-300',
  },
  danger: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    icon: (
      <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
      </svg>
    ),
    label: 'Danger',
    textColor: 'text-red-300',
  },
};

export default function InfoBox({ type = 'note', title, children, collapsible = false }: InfoBoxProps) {
  const [isOpen, setIsOpen] = useState(!collapsible);
  const c = config[type];

  return (
    <div className={`${c.bg} ${c.border} border rounded-lg my-4 overflow-hidden transition-all duration-300`}>
      <div
        className={`flex items-center gap-2 px-4 py-3 ${collapsible ? 'cursor-pointer hover:opacity-80' : ''}`}
        onClick={() => collapsible && setIsOpen(!isOpen)}
      >
        {c.icon}
        <span className={`font-semibold text-sm ${c.textColor}`}>
          {title || c.label}
        </span>
        {collapsible && (
          <svg
            className={`w-4 h-4 ml-auto transition-transform duration-200 ${c.textColor} ${isOpen ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </div>
      {isOpen && (
        <div className="px-4 pb-3 text-sm text-text-secondary leading-relaxed animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
}
