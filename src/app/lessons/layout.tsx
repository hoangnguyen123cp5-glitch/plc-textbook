'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SiteNav, { NAV_HEIGHT } from '@/components/layout/SiteNav';
import { lessons } from '@/lib/lessons';

/*
 * Layout khoá học = nav + sidebar mục lục + cột nội dung.
 *
 * Mọi quyết định theo kích thước màn hình nằm trong CSS (globals.css, khối
 * "RESPONSIVE — layout bài học"), KHÔNG đọc window.innerWidth trong render.
 * React ở đây chỉ giữ đúng một trạng thái: ngăn kéo đang mở hay đóng.
 *
 * Chiều cao nav được truyền xuống CSS qua biến --nav-h để sidebar bám theo,
 * lấy từ cùng một hằng số mà SiteNav dùng — không có con số 60 nào bị lặp lại.
 */

function getCategoryColor(id: number) {
  if (id <= 3)  return '#1a3a6b';
  if (id <= 7)  return '#c9a227';
  if (id <= 10) return '#dc2626';
  if (id <= 14) return '#7c3aed';
  return '#16a34a';
}

export default function LessonsLayout({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  // Đổi bài thì đóng ngăn kéo — trên tablet/điện thoại người dùng bấm một bài
  // xong sẽ muốn thấy nội dung ngay, không phải tự tay đóng menu.
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Khoá cuộn nền khi ngăn kéo mở, tránh hiện tượng "scroll chaining" trên iOS
  // (vuốt trong sidebar làm trang phía sau cuộn theo).
  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  // Esc để đóng — bàn phím ngoài trên iPad, và là chuẩn a11y cho dialog.
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  return (
    <div
      style={
        {
          minHeight: '100vh',
          background: '#fff',
          display: 'flex',
          flexDirection: 'column',
          '--nav-h': `${NAV_HEIGHT}px`,
        } as React.CSSProperties
      }
    >
      {/* ── TOP NAV (dùng chung toàn site — components/layout/SiteNav.tsx) ── */}
      <SiteNav
        layout="centered"
        position="sticky"
        onMenuClick={() => setDrawerOpen((o) => !o)}
        menuExpanded={drawerOpen}
        cta={{ label: 'All Lessons', href: '/lessons' }}
      />

      {/* ── BODY: SIDEBAR + CONTENT ── */}
      <div className="lesson-shell">
        {/* Lớp phủ — CSS tự ẩn nó từ 1080px trở lên */}
        {drawerOpen && (
          <div className="lesson-overlay" onClick={() => setDrawerOpen(false)} aria-hidden="true" />
        )}

        {/* ── SIDEBAR ──
            Từ 1080px trở lên: nằm trong dòng chảy, luôn hiện.
            Dưới 1080px: ngăn kéo cố định, trượt vào theo data-open. */}
        <aside className="lesson-sidebar" data-open={drawerOpen} aria-label="Course Curriculum">
          <div style={{ padding: '16px 12px' }}>
            <p
              style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: '#a3a3a3',
                textTransform: 'uppercase',
                padding: '4px 12px',
                marginBottom: '8px',
              }}
            >
              Course Content
            </p>
            {lessons.map((lesson) => {
              const isActive = pathname.includes(`/lessons/${lesson.slug}`);
              const color = getCategoryColor(lesson.id);
              return (
                <Link
                  key={lesson.id}
                  href={`/lessons/${lesson.slug}`}
                  aria-current={isActive ? 'page' : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    marginBottom: '2px',
                    background: isActive ? '#f0f4ff' : 'transparent',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = '#f5f5f5';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span
                    style={{
                      width: 3,
                      height: 20,
                      borderRadius: 99,
                      background: isActive ? color : '#e5e5e5',
                      flexShrink: 0,
                      transition: 'background 0.15s',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#d4d4d4',
                      minWidth: '18px',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {String(lesson.id).padStart(2, '0')}
                  </span>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: isActive ? 600 : 450,
                      color: isActive ? '#1a3a6b' : '#525252',
                      lineHeight: 1.3,
                      flex: 1,
                    }}
                  >
                    {lesson.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="lesson-main">
          <div className="lesson-col">{children}</div>
        </main>
      </div>
    </div>
  );
}
