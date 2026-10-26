'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { asset } from '@/lib/asset';

interface TopicItem {
  id: number;
  slug: string;
  title: string;
  durationMinutes: number;
  parentLessonSlug: string;
}

interface SectionItem {
  title: string;
  content: string;
  keyPoints?: string[];
  note?: string;
}

interface DiagramItem {
  src: string;
  caption: string;
}

interface Props {
  lessonSlug: string;
  lessonTitle: string;
  lessonIcon: string;
  courseCode: string;
  color: string;
  currentTopic: TopicItem;
  topics: TopicItem[];
  currentIndex: number;
  section: SectionItem | null;
  diagram: DiagramItem | null;
}

export default function TopicSlideDeck({
  lessonSlug,
  lessonTitle,
  lessonIcon,
  courseCode,
  color,
  currentTopic,
  topics,
  currentIndex,
  section,
  diagram,
}: Props) {
  const router = useRouter();
  const slideRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomImage, setZoomImage] = useState(false);

  const prevTopic = topics[currentIndex - 1] ?? null;
  const nextTopic = topics[currentIndex + 1] ?? null;

  // Keyboard navigation: ArrowLeft (prev), ArrowRight/Space (next), F (fullscreen)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (nextTopic) {
          e.preventDefault();
          router.push(`/lessons/${lessonSlug}/${nextTopic.slug}`);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (prevTopic) {
          e.preventDefault();
          router.push(`/lessons/${lessonSlug}/${prevTopic.slug}`);
        }
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lessonSlug, prevTopic, nextTopic, isFullscreen, router]);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (slideRef.current?.requestFullscreen) {
        slideRef.current.requestFullscreen().catch(() => {});
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  return (
    <div
      ref={slideRef}
      style={{
        background: isFullscreen ? '#090d16' : '#ffffff',
        border: isFullscreen ? 'none' : '1px solid #e2e8f0',
        borderRadius: isFullscreen ? 0 : '16px',
        boxShadow: isFullscreen ? 'none' : '0 4px 24px rgba(0,0,0,0.06)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: isFullscreen ? 'fixed' : 'relative',
        top: isFullscreen ? 0 : 'auto',
        left: isFullscreen ? 0 : 'auto',
        width: isFullscreen ? '100vw' : '100%',
        height: isFullscreen ? '100vh' : 'auto',
        zIndex: isFullscreen ? 99999 : 1,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        marginBottom: isFullscreen ? 0 : '32px',
        transition: 'all 0.2s ease',
      }}
    >
      {/* ── Top Header Bar (Slide Info & Presentation Mode) ── */}
      <div
        style={{
          padding: '12px 20px',
          background: isFullscreen ? '#0f172a' : `${color}08`,
          borderBottom: isFullscreen ? '1px solid #1e293b' : '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        {/* Left: Breadcrumb / Topic Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>{lessonIcon}</span>
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: isFullscreen ? '#94a3b8' : color, textTransform: 'uppercase' }}>
            {courseCode} · {lessonTitle}
          </span>
          <span style={{ color: isFullscreen ? '#475569' : '#cbd5e1' }}>/</span>
          <span style={{ fontSize: '11px', fontWeight: 600, color: isFullscreen ? '#f1f5f9' : '#0f172a' }}>
            Slide {String(currentIndex + 1).padStart(2, '0')} of {String(topics.length).padStart(2, '0')}
          </span>
        </div>

        {/* Right: Fullscreen Presentation Button & Keyboard Guide */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', color: isFullscreen ? '#64748b' : '#94a3b8', display: 'none' }} className="desktop-hint">
            Tip: Press <strong>← / →</strong> to change slide, <strong>F</strong> for fullscreen
          </span>

          <button
            onClick={toggleFullscreen}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: isFullscreen ? '1px solid #334155' : '1px solid #cbd5e1',
              background: isFullscreen ? '#1e293b' : '#ffffff',
              color: isFullscreen ? '#38bdf8' : '#0f172a',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>{isFullscreen ? '✕ Exit Presentation' : '⛶ Presentation Mode'}</span>
          </button>
        </div>
      </div>

      {/* ── Slide Body Stage (Split 2-Column: Content + Diagram) ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isFullscreen ? '1.1fr 1fr' : 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: isFullscreen ? '32px' : '24px',
          padding: isFullscreen ? '36px 48px' : '28px 32px',
          flex: 1,
          alignItems: 'center',
          overflowY: 'auto',
          background: isFullscreen ? '#090d16' : '#ffffff',
        }}
      >
        {/* Left Column: Title, Key Points & Engineering Takeaways */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <span style={{ width: 4, height: 16, background: color, borderRadius: 99 }} />
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: color, textTransform: 'uppercase' }}>
                Topic {currentIndex + 1} of {topics.length} · {currentTopic.durationMinutes} min
              </span>
            </div>
            <h2
              style={{
                fontSize: isFullscreen ? '28px' : '22px',
                fontWeight: 800,
                color: isFullscreen ? '#ffffff' : '#0f172a',
                lineHeight: 1.25,
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              {currentTopic.title}
            </h2>
          </div>

          {/* Primary Principle Paragraph */}
          <p
            style={{
              fontSize: isFullscreen ? '15px' : '14px',
              color: isFullscreen ? '#cbd5e1' : '#334155',
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            {section?.content ? section.content.split('. ').slice(0, 2).join('. ') + '.' : ''}
          </p>

          {/* Key Engineering Bullet Points */}
          {section?.keyPoints && section.keyPoints.length > 0 && (
            <div
              style={{
                background: isFullscreen ? '#0f172a' : '#f8fafc',
                border: isFullscreen ? '1px solid #1e293b' : '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.08em', color: isFullscreen ? '#94a3b8' : '#64748b', textTransform: 'uppercase' }}>
                Key Engineering Takeaways:
              </div>
              {section.keyPoints.slice(0, 4).map((kp, idx) => {
                const parts = kp.split(':');
                const title = parts[0];
                const desc = parts.slice(1).join(':').trim();
                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: isFullscreen ? '13.5px' : '12.5px', lineHeight: 1.5 }}>
                    <span style={{ color: color, fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>▸</span>
                    <div>
                      <strong style={{ color: isFullscreen ? '#f1f5f9' : '#0f172a' }}>{title}</strong>
                      {desc ? <span style={{ color: isFullscreen ? '#94a3b8' : '#475569' }}>: {desc}</span> : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Engineering Note Callout */}
          {section?.note && (
            <div
              style={{
                padding: '10px 14px',
                background: isFullscreen ? '#261c0c' : '#fffbeb',
                borderLeft: `4px solid ${isFullscreen ? '#f59e0b' : '#f59e0b'}`,
                borderRadius: '0 8px 8px 0',
                fontSize: isFullscreen ? '13px' : '12px',
                color: isFullscreen ? '#fde68a' : '#92400e',
                lineHeight: 1.5,
              }}
            >
              💡 <strong>Engineering Note:</strong> {section.note}
            </div>
          )}
        </div>

        {/* Right Column: High-Resolution Technical Schematic Diagram */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: isFullscreen ? '#0f172a' : '#f8fafc',
            border: isFullscreen ? '1px solid #1e293b' : '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px',
            position: 'relative',
          }}
        >
          {diagram ? (
            <>
              <div
                onClick={() => setZoomImage(true)}
                style={{
                  position: 'relative',
                  cursor: 'zoom-in',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
                title="Click to zoom image"
              >
                <img
                  src={asset(diagram.src)}
                  alt={diagram.caption}
                  style={{
                    maxWidth: '100%',
                    maxHeight: isFullscreen ? '50vh' : '360px',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: '11.5px',
                  color: isFullscreen ? '#94a3b8' : '#64748b',
                  marginTop: '10px',
                  fontStyle: 'italic',
                  textAlign: 'center',
                  margin: '10px 0 0 0',
                }}
              >
                {diagram.caption}
              </p>
            </>
          ) : (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: isFullscreen ? '#64748b' : '#94a3b8' }}>
              <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>📊</span>
              <span style={{ fontSize: '13px' }}>Technical Schematic for {currentTopic.title}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Fixed Slide Bottom Navigation Bar ── */}
      <div
        style={{
          padding: '12px 24px',
          background: isFullscreen ? '#0f172a' : '#f8fafc',
          borderTop: isFullscreen ? '1px solid #1e293b' : '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        {/* Previous Slide Button */}
        {prevTopic ? (
          <button
            onClick={() => router.push(`/lessons/${lessonSlug}/${prevTopic.slug}`)}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              border: isFullscreen ? '1px solid #334155' : '1px solid #cbd5e1',
              background: isFullscreen ? '#1e293b' : '#ffffff',
              color: isFullscreen ? '#f1f5f9' : '#0f172a',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>◀</span>
            <span>Prev Slide: {prevTopic.title.slice(0, 24)}…</span>
          </button>
        ) : (
          <div style={{ width: '100px' }} />
        )}

        {/* Slide Indicator Dots (Clickable!) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {topics.map((t, idx) => {
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={t.slug}
                onClick={() => router.push(`/lessons/${lessonSlug}/${t.slug}`)}
                title={t.title}
                style={{
                  width: isCurrent ? 24 : 10,
                  height: 10,
                  borderRadius: 99,
                  border: 'none',
                  background: isCurrent ? color : isFullscreen ? '#334155' : '#cbd5e1',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.2s ease',
                }}
              />
            );
          })}
        </div>

        {/* Next Slide Button */}
        {nextTopic ? (
          <button
            onClick={() => router.push(`/lessons/${lessonSlug}/${nextTopic.slug}`)}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: color,
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>Next Slide: {nextTopic.title.slice(0, 24)}…</span>
            <span>▶</span>
          </button>
        ) : (
          <button
            onClick={() => router.push(`/lessons/${lessonSlug}`)}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: color,
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Finish Chapter 🏁
          </button>
        )}
      </div>

      {/* ── Lightbox Image Modal (Zoom) ── */}
      {zoomImage && diagram && (
        <div
          onClick={() => setZoomImage(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 999999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            cursor: 'zoom-out',
          }}
        >
          <img
            src={asset(diagram.src)}
            alt={diagram.caption}
            style={{
              maxWidth: '92vw',
              maxHeight: '85vh',
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              background: '#ffffff',
            }}
          />
          <p style={{ color: '#ffffff', marginTop: '16px', fontSize: '14px', fontStyle: 'italic', textAlign: 'center' }}>
            {diagram.caption} (Click anywhere to close)
          </p>
        </div>
      )}
    </div>
  );
}
