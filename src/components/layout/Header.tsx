'use client';

import React, { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const progressPercent = 35; // Mock progress

  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-border h-16 flex flex-col justify-center">
      {/* Thin gradient progress bar at the very top */}
      <div className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300" style={{ width: `${progressPercent}%` }} />
      
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 text-text-secondary hover:text-text-primary transition-colors rounded-md hover:bg-surface-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>
          <span className="text-xl font-bold text-text-primary tracking-tight">PLC Masterclass</span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm text-text-secondary bg-surface-1 border border-border rounded-md hover:bg-surface-2 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <span>Search...</span>
            <kbd className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-mono bg-surface-2 rounded border border-border text-text-muted">
              <span>Ctrl</span>K
            </kbd>
          </button>
          
          <button onClick={() => setIsSearchOpen(true)} className="sm:hidden p-2 text-text-secondary hover:text-text-primary transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </button>

          <button 
            onClick={toggleTheme}
            className="p-2 text-text-secondary hover:text-text-primary transition-colors rounded-full hover:bg-surface-2"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            )}
          </button>
          
          <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-border">
             <span className="text-sm font-medium text-text-secondary">Progress</span>
             <span className="text-sm font-bold text-primary">{progressPercent}%</span>
          </div>
        </div>
      </div>
      
      {/* Search Modal Placeholder */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-surface-0/80 backdrop-blur-sm flex items-start justify-center pt-[20vh] px-4" onClick={() => setIsSearchOpen(false)}>
           <div className="w-full max-w-2xl bg-surface-1 border border-border rounded-xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="p-4 border-b border-border flex items-center gap-3">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                 <input autoFocus type="text" placeholder="Search lessons, topics, or PLC instructions..." className="w-full bg-transparent border-none outline-none text-text-primary placeholder:text-text-muted" />
                 <kbd className="hidden sm:inline-flex px-2 py-1 text-xs font-mono bg-surface-2 rounded border border-border text-text-muted cursor-pointer" onClick={() => setIsSearchOpen(false)}>ESC</kbd>
              </div>
              <div className="p-8 text-center text-text-muted">
                 Search functionality coming soon...
              </div>
           </div>
        </div>
      )}
    </header>
  );
}
