'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { lessons } from '@/lib/lessons';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [expandedLessons, setExpandedLessons] = useState<string[]>([]);

  const toggleLesson = (id: string) => {
    setExpandedLessons(prev => 
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  };

  const isCompleted = (id: string) => false; // Mock completion check

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-surface-0/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed top-16 left-0 z-40 w-72 h-[calc(100vh-4rem)] transition-transform duration-300 ease-in-out
        glass border-r border-border flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          <div className="mb-6 px-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Course Content</div>
          
          {lessons.map((lesson) => {
            const isExpanded = expandedLessons.includes(String(lesson.id));
            const isActive = pathname.startsWith(`/lessons/${lesson.slug}`);
            
            return (
              <div key={lesson.id} className="mb-2">
                <button
                  onClick={() => toggleLesson(String(lesson.id))}
                  className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors group
                    ${isActive ? 'bg-surface-2 text-primary' : 'text-text-secondary hover:bg-surface-1 hover:text-text-primary'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl opacity-80 group-hover:opacity-100">{lesson.icon}</span>
                    <span className="font-medium text-sm text-left">{lesson.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-surface-2 px-1.5 py-0.5 rounded text-text-muted group-hover:text-text-secondary">{lesson.durationMinutes}m</span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                      className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                    >
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </div>
                </button>
                
                {/* Nested Topics */}
                {isExpanded && (
                  <div className="mt-1 ml-9 pl-3 border-l border-border space-y-1">
                    {lesson.topics.map((topic) => {
                      const topicHref = `/lessons/${lesson.slug}/${topic.slug}`;
                      const isTopicActive = pathname === topicHref;
                      const topicCompleted = isCompleted(topic.slug);
                      
                      return (
                        <Link 
                          key={topic.id} 
                          href={topicHref}
                          className={`flex items-center gap-2 p-2 rounded-md text-sm transition-colors
                            ${isTopicActive ? 'bg-primary/10 text-primary font-medium' : 'text-text-muted hover:text-text-primary hover:bg-surface-1'}
                          `}
                        >
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0
                            ${topicCompleted ? 'bg-success border-success text-surface-0' : 'border-border text-transparent'}
                            ${isTopicActive && !topicCompleted ? 'border-primary' : ''}
                          `}>
                            {topicCompleted && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                            )}
                          </div>
                          <span>{topic.title}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Bottom Section */}
        <div className="p-4 border-t border-border bg-surface-1/50 space-y-2">
          <Link href="/simulator" className="flex items-center gap-3 p-2 rounded-lg text-sm text-text-secondary hover:bg-surface-2 hover:text-text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h.01"/><path d="M17 7h.01"/><path d="M7 17h.01"/><path d="M17 17h.01"/><path d="M12 12h.01"/><path d="M12 7h.01"/><path d="M12 17h.01"/><path d="M7 12h.01"/><path d="M17 12h.01"/></svg>
            <span>PLC Simulator</span>
          </Link>
          <Link href="/quiz-bank" className="flex items-center gap-3 p-2 rounded-lg text-sm text-text-secondary hover:bg-surface-2 hover:text-text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>
            <span>Quiz Bank</span>
          </Link>
          <Link href="/progress" className="flex items-center gap-3 p-2 rounded-lg text-sm text-text-secondary hover:bg-surface-2 hover:text-text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
            <span>My Progress</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
