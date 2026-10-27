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
  simulatorNode?: React.ReactNode;
  quizNode?: React.ReactNode;
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
  simulatorNode,
  quizNode,
}: Props) {
  const router = useRouter();
  const slideRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomImage, setZoomImage] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0); // 0: Overview, 1: Key Points, 2: Lab Notes, 3: Simulator, 4: Quiz
  const [drawerOpen, setDrawerOpen] = useState(false);

  const prevTopic = topics[currentIndex - 1] ?? null;
  const nextTopic = topics[currentIndex + 1] ?? null;

  const SLIDE_TABS = [
    { id: 0, label: 'Overview & Schematic', shortLabel: 'Overview', icon: '📊' },
    { id: 1, label: 'Key Engineering Points', shortLabel: 'Key Points', icon: '💡' },
    { id: 2, label: 'Technical Lab Notes', shortLabel: 'Lab Notes', icon: '📖' },
    { id: 3, label: 'Live Simulator', shortLabel: 'Simulator', icon: '⚡' },
    { id: 4, label: 'Knowledge Check Quiz', shortLabel: 'Quiz', icon: '📝' },
  ];

  // Navigate to previous slide or previous topic
  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    } else if (prevTopic) {
      router.push(`/lessons/${lessonSlug}/${prevTopic.slug}`);
    }
  };

  // Navigate to next slide or next topic
  const handleNext = () => {
    if (currentSlide < SLIDE_TABS.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else if (nextTopic) {
      router.push(`/lessons/${lessonSlug}/${nextTopic.slug}`);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key.toLowerCase() === 't') {
        e.preventDefault();
        setDrawerOpen(prev => !prev);
      } else if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const slideIdx = parseInt(e.key) - 1;
        if (slideIdx >= 0 && slideIdx < SLIDE_TABS.length) {
          setCurrentSlide(slideIdx);
        }
      } else if (e.key === 'Escape') {
        if (zoomImage) {
          setZoomImage(false);
        } else if (drawerOpen) {
          setDrawerOpen(false);
        } else if (isFullscreen) {
          setIsFullscreen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, prevTopic, nextTopic, isFullscreen, zoomImage, drawerOpen, lessonSlug]);

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
        background: isFullscreen ? '#070b14' : '#ffffff',
        border: isFullscreen ? 'none' : '1px solid #e2e8f0',
        borderRadius: isFullscreen ? 0 : '16px',
        boxShadow: isFullscreen ? 'none' : '0 4px 28px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: isFullscreen ? 'fixed' : 'relative',
        top: isFullscreen ? 0 : 'auto',
        left: isFullscreen ? 0 : 'auto',
        width: isFullscreen ? '100vw' : '100%',
        height: isFullscreen ? '100vh' : 'calc(100vh - 96px)',
        minHeight: isFullscreen ? '100vh' : '620px',
        maxHeight: isFullscreen ? '100vh' : '920px',
        zIndex: isFullscreen ? 99999 : 10,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        transition: 'all 0.2s ease',
      }}
    >
      {/* ── Top Header Bar: Breadcrumb, Topic Navigation & Projector Mode ── */}
      <div
        style={{
          padding: '10px 20px',
          background: isFullscreen ? '#0f172a' : `${color}08`,
          borderBottom: isFullscreen ? '1px solid #1e293b' : '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          flexShrink: 0,
        }}
      >
        {/* Left: Breadcrumb / Topic Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>{lessonIcon}</span>
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: isFullscreen ? '#94a3b8' : color, textTransform: 'uppercase' }}>
            {courseCode} · {lessonTitle}
          </span>
          <span style={{ color: isFullscreen ? '#475569' : '#cbd5e1' }}>/</span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: isFullscreen ? '#f1f5f9' : '#0f172a' }}>
            Topic {currentIndex + 1}/{topics.length}: {currentTopic.title}
          </span>
        </div>

        {/* Right: Topic Quick Switcher, Topics Drawer & Fullscreen Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {prevTopic && (
            <button
              onClick={() => router.push(`/lessons/${lessonSlug}/${prevTopic.slug}`)}
              title={`Previous Topic: ${prevTopic.title}`}
              style={{
                padding: '5px 10px',
                borderRadius: '6px',
                border: isFullscreen ? '1px solid #334155' : '1px solid #cbd5e1',
                background: isFullscreen ? '#1e293b' : '#ffffff',
                color: isFullscreen ? '#cbd5e1' : '#475569',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ◀ Prev Topic
            </button>
          )}

          {nextTopic && (
            <button
              onClick={() => router.push(`/lessons/${lessonSlug}/${nextTopic.slug}`)}
              title={`Next Topic: ${nextTopic.title}`}
              style={{
                padding: '5px 10px',
                borderRadius: '6px',
                border: isFullscreen ? '1px solid #334155' : '1px solid #cbd5e1',
                background: isFullscreen ? '#1e293b' : '#ffffff',
                color: isFullscreen ? '#cbd5e1' : '#475569',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Next Topic ▶
            </button>
          )}

          {/* Topics Menu Drawer Button */}
          <button
            onClick={() => setDrawerOpen(prev => !prev)}
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              border: isFullscreen ? '1px solid #334155' : '1px solid #cbd5e1',
              background: drawerOpen ? (isFullscreen ? '#38bdf8' : color) : (isFullscreen ? '#1e293b' : '#ffffff'),
              color: drawerOpen ? '#ffffff' : (isFullscreen ? '#cbd5e1' : '#0f172a'),
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <span>📋</span>
            <span>Topics ({topics.length})</span>
          </button>

          {/* Fullscreen Projector Toggle */}
          <button
            onClick={toggleFullscreen}
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              border: isFullscreen ? '1px solid #38bdf8' : '1px solid #cbd5e1',
              background: isFullscreen ? '#1e293b' : '#ffffff',
              color: isFullscreen ? '#38bdf8' : '#0f172a',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>{isFullscreen ? '✕ Exit' : '⛶ Projector Mode'}</span>
            <span style={{ fontSize: '10px', opacity: 0.7 }}>(F)</span>
          </button>
        </div>
      </div>

      {/* ── Slide Navigation Tabs Bar: 5 Crisp Sub-Slides ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 20px',
          background: isFullscreen ? '#0b1120' : '#f8fafc',
          borderBottom: isFullscreen ? '1px solid #1e293b' : '1px solid #e2e8f0',
          gap: '8px',
          flexWrap: 'wrap',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {SLIDE_TABS.map(tab => {
            const isActive = currentSlide === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentSlide(tab.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: isActive ? `1px solid ${color}` : (isFullscreen ? '1px solid #1e293b' : '1px solid #e2e8f0'),
                  background: isActive ? (isFullscreen ? `${color}25` : `${color}15`) : (isFullscreen ? '#0f172a' : '#ffffff'),
                  color: isActive ? (isFullscreen ? '#38bdf8' : color) : (isFullscreen ? '#94a3b8' : '#64748b'),
                  fontSize: '12px',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{tab.icon}</span>
                <span>Slide {tab.id + 1}: {tab.shortLabel}</span>
              </button>
            );
          })}
        </div>

        <div style={{ fontSize: '11px', color: isFullscreen ? '#64748b' : '#94a3b8' }}>
          Hotkeys: <strong>1, 2, 3, 4, 5</strong> · <strong>← / →</strong> or <strong>Space</strong>
        </div>
      </div>

      {/* ── Main Slide Stage (ZERO VERTICAL SCROLLBAR: Fits 100% into the frame) ── */}
      <div
        style={{
          flex: 1,
          padding: isFullscreen ? '28px 48px' : '20px 32px',
          overflow: 'hidden',
          background: isFullscreen ? '#070b14' : '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {/* ── SLIDE 1: Executive Overview & High-Resolution Schematic ── */}
        {currentSlide === 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.15fr 1fr',
              gap: isFullscreen ? '40px' : '28px',
              alignItems: 'center',
              height: '100%',
              overflow: 'hidden',
            }}
          >
            {/* Left: Topic Title, Core Concept, Engineering Note */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', justifyContent: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <span style={{ width: 4, height: 16, background: color, borderRadius: 99 }} />
                  <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: color, textTransform: 'uppercase' }}>
                    Topic {currentIndex + 1} of {topics.length} · {currentTopic.durationMinutes} min lecture
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

              {/* Core Principle Paragraph */}
              <div
                style={{
                  background: isFullscreen ? '#0f172a' : '#f8fafc',
                  border: isFullscreen ? '1px solid #1e293b' : '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '16px 20px',
                }}
              >
                <div style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.08em', color: isFullscreen ? '#38bdf8' : color, textTransform: 'uppercase', marginBottom: '8px' }}>
                  Core Automation Principle:
                </div>
                <p
                  style={{
                    fontSize: isFullscreen ? '15px' : '13.5px',
                    color: isFullscreen ? '#cbd5e1' : '#334155',
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {section?.content ? section.content.split('. ').slice(0, 3).join('. ') + '.' : 'Engineering lecture overview for this curriculum topic.'}
                </p>
              </div>

              {/* Engineering Note / Warning */}
              {section?.note && (
                <div
                  style={{
                    padding: '12px 16px',
                    background: isFullscreen ? '#261c0c' : '#fffbeb',
                    borderLeft: '4px solid #f59e0b',
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

            {/* Right: Technical Diagram with Lightbox */}
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
                height: '100%',
                maxHeight: isFullscreen ? '62vh' : '440px',
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
                      height: '85%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    title="Click to zoom image"
                  >
                    <img
                      src={asset(diagram.src)}
                      alt={diagram.caption}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                      }}
                    />
                  </div>
                  <p
                    style={{
                      fontSize: '11.5px',
                      color: isFullscreen ? '#94a3b8' : '#64748b',
                      marginTop: '8px',
                      fontStyle: 'italic',
                      textAlign: 'center',
                      margin: '8px 0 0 0',
                      lineHeight: 1.3,
                    }}
                  >
                    {diagram.caption}
                  </p>
                </>
              ) : (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: isFullscreen ? '#64748b' : '#94a3b8' }}>
                  <span style={{ fontSize: '36px', display: 'block', marginBottom: '8px' }}>📊</span>
                  <span style={{ fontSize: '13px' }}>Technical Schematic for {currentTopic.title}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SLIDE 2: Key Engineering Points (Split cleanly into visual cards) ── */}
        {currentSlide === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            <div style={{ borderBottom: isFullscreen ? '1px solid #1e293b' : '1px solid #e2e8f0', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span style={{ width: 4, height: 16, background: color, borderRadius: 99 }} />
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: color, textTransform: 'uppercase' }}>
                  Core Engineering Standards & Key Takeaways
                </span>
              </div>
              <h2 style={{ fontSize: isFullscreen ? '24px' : '20px', fontWeight: 800, color: isFullscreen ? '#ffffff' : '#0f172a', margin: 0 }}>
                Key Principles · {currentTopic.title}
              </h2>
            </div>

            {/* Grid of Key Points Cards (Fits 100% without scrollbar) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                flex: 1,
                alignContent: 'center',
                margin: '12px 0',
              }}
            >
              {section?.keyPoints && section.keyPoints.length > 0 ? (
                section.keyPoints.slice(0, 6).map((kp, idx) => {
                  const parts = kp.split(':');
                  const title = parts[0];
                  const desc = parts.slice(1).join(':').trim();
                  return (
                    <div
                      key={idx}
                      style={{
                        background: isFullscreen ? '#0f172a' : '#f8fafc',
                        border: isFullscreen ? '1px solid #1e293b' : '1px solid #e2e8f0',
                        borderRadius: '10px',
                        padding: '12px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <span style={{ color: color, fontWeight: 700 }}>▸</span>
                        <strong style={{ color: isFullscreen ? '#f1f5f9' : '#0f172a', fontSize: isFullscreen ? '14px' : '13px' }}>
                          {title}
                        </strong>
                      </div>
                      {desc && (
                        <div style={{ color: isFullscreen ? '#94a3b8' : '#475569', fontSize: isFullscreen ? '13px' : '12px', lineHeight: 1.5, paddingLeft: '14px' }}>
                          {desc}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div style={{ color: '#94a3b8', fontSize: '13px' }}>Key engineering specifications loaded for this topic.</div>
              )}
            </div>

            <div style={{ fontSize: '11px', color: isFullscreen ? '#64748b' : '#94a3b8', textAlign: 'right' }}>
              Slide 2 of 5 · Press <strong>Space</strong> or <strong>→</strong> to continue to Laboratory Notes
            </div>
          </div>
        )}

        {/* ── SLIDE 3: Detailed Technical Lab Notes & Guidelines ── */}
        {currentSlide === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            <div style={{ borderBottom: isFullscreen ? '1px solid #1e293b' : '1px solid #e2e8f0', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span style={{ width: 4, height: 16, background: color, borderRadius: 99 }} />
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: color, textTransform: 'uppercase' }}>
                  Laboratory Bench Specifications & Practical Theory
                </span>
              </div>
              <h2 style={{ fontSize: isFullscreen ? '24px' : '20px', fontWeight: 800, color: isFullscreen ? '#ffffff' : '#0f172a', margin: 0 }}>
                In-Depth Engineering Theory · {currentTopic.title}
              </h2>
            </div>

            {/* 2-Column Split: In-Depth Theory on Left, Field Guidelines on Right */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                gap: '20px',
                flex: 1,
                alignItems: 'center',
                margin: '12px 0',
              }}
            >
              {/* Left: Complete Theory Write-up */}
              <div
                style={{
                  background: isFullscreen ? '#0f172a' : '#f8fafc',
                  border: isFullscreen ? '1px solid #1e293b' : '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '20px 24px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <h4 style={{ fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.08em', color: isFullscreen ? '#38bdf8' : color, textTransform: 'uppercase', marginBottom: '8px', margin: '0 0 8px 0' }}>
                  Theoretical Process Dynamics:
                </h4>
                <p style={{ fontSize: isFullscreen ? '14.5px' : '13px', color: isFullscreen ? '#cbd5e1' : '#334155', lineHeight: 1.7, margin: 0 }}>
                  {section?.content}
                </p>
              </div>

              {/* Right: Operational Safety, Rules, and Wiring Protocols */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  height: '100%',
                  justifyContent: 'center',
                }}
              >
                {section?.note ? (
                  <div
                    style={{
                      background: isFullscreen ? '#261c0c' : '#fffbeb',
                      border: isFullscreen ? '1px solid #78350f' : '1px solid #fde68a',
                      borderLeft: '5px solid #f59e0b',
                      borderRadius: '8px',
                      padding: '16px 18px',
                      fontSize: isFullscreen ? '13.5px' : '12.5px',
                      color: isFullscreen ? '#fde68a' : '#92400e',
                      lineHeight: 1.6,
                    }}
                  >
                    ⚠️ <strong>Practical Bench Warning & Field Guidelines:</strong>
                    <div style={{ marginTop: '6px' }}>{section.note}</div>
                  </div>
                ) : null}

                <div
                  style={{
                    background: isFullscreen ? '#0f172a' : '#ffffff',
                    border: isFullscreen ? '1px solid #1e293b' : '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '14px 18px',
                    fontSize: isFullscreen ? '13px' : '12px',
                    color: isFullscreen ? '#94a3b8' : '#475569',
                    lineHeight: 1.5,
                  }}
                >
                  <strong style={{ color: isFullscreen ? '#ffffff' : '#0f172a' }}>Commissioning Checklist:</strong>
                  <ul style={{ margin: '6px 0 0 0', paddingLeft: '18px' }}>
                    <li>Verify 24VDC polarity before applying line power to the CPU rack.</li>
                    <li>Ensure PE grounding busbar resistance is &lt; 10 ohms.</li>
                    <li>Always test emergency stop hardware circuits independently of PLC logic.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div style={{ fontSize: '11px', color: isFullscreen ? '#64748b' : '#94a3b8', textAlign: 'right' }}>
              Slide 3 of 5 · Press <strong>Space</strong> or <strong>→</strong> to continue to Interactive Simulator
            </div>
          </div>
        )}

        {/* ── SLIDE 4: Interactive Live Simulator ── */}
        {currentSlide === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            <div style={{ borderBottom: isFullscreen ? '1px solid #1e293b' : '1px solid #e2e8f0', paddingBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span style={{ width: 4, height: 16, background: color, borderRadius: 99 }} />
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: color, textTransform: 'uppercase' }}>
                  Interactive Engineering Bench · Live Logic Simulation
                </span>
              </div>
              <h2 style={{ fontSize: isFullscreen ? '22px' : '18px', fontWeight: 800, color: isFullscreen ? '#ffffff' : '#0f172a', margin: 0 }}>
                Live Execution Stage: {currentTopic.title}
              </h2>
            </div>

            {/* Simulator Node Container (Contained to prevent scrolling) */}
            <div
              style={{
                width: '100%',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                padding: '8px 0',
              }}
            >
              <div style={{ width: '100%', maxHeight: '100%' }}>
                {simulatorNode}
              </div>
            </div>

            <div style={{ fontSize: '11px', color: isFullscreen ? '#64748b' : '#94a3b8', textAlign: 'right' }}>
              Slide 4 of 5 · Press <strong>Space</strong> or <strong>→</strong> to continue to Knowledge Check
            </div>
          </div>
        )}

        {/* ── SLIDE 5: Formative Knowledge Check Micro-Quiz ── */}
        {currentSlide === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            <div style={{ borderBottom: isFullscreen ? '1px solid #1e293b' : '1px solid #e2e8f0', paddingBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span style={{ width: 4, height: 16, background: color, borderRadius: 99 }} />
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: color, textTransform: 'uppercase' }}>
                  Formative Self-Assessment · Classroom Knowledge Check
                </span>
              </div>
              <h2 style={{ fontSize: isFullscreen ? '22px' : '18px', fontWeight: 800, color: isFullscreen ? '#ffffff' : '#0f172a', margin: 0 }}>
                Test Your Understanding: {currentTopic.title}
              </h2>
            </div>

            {/* Quiz Node Container */}
            <div
              style={{
                width: '100%',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                padding: '8px 0',
              }}
            >
              <div style={{ width: '100%' }}>
                {quizNode}
              </div>
            </div>

            <div style={{ fontSize: '11px', color: isFullscreen ? '#64748b' : '#94a3b8', textAlign: 'right' }}>
              Slide 5 of 5 · Press <strong>Space</strong> or <strong>→</strong> to advance to next topic
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom Slide Navigation Bar ── */}
      <div
        style={{
          padding: '10px 24px',
          background: isFullscreen ? '#0f172a' : '#f8fafc',
          borderTop: isFullscreen ? '1px solid #1e293b' : '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap',
          flexShrink: 0,
        }}
      >
        {/* Previous Slide Button */}
        <button
          onClick={handlePrev}
          style={{
            padding: '7px 16px',
            borderRadius: '8px',
            border: isFullscreen ? '1px solid #334155' : '1px solid #cbd5e1',
            background: isFullscreen ? '#1e293b' : '#ffffff',
            color: isFullscreen ? '#f1f5f9' : '#0f172a',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>◀</span>
          <span>{currentSlide > 0 ? `Prev: ${SLIDE_TABS[currentSlide - 1].shortLabel}` : (prevTopic ? `Prev Topic: ${prevTopic.title.slice(0, 20)}…` : 'Start of Lesson')}</span>
        </button>

        {/* Slide Indicator Dots (Showing current slide out of 5) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: isFullscreen ? '#94a3b8' : '#64748b' }}>
            Slide {currentSlide + 1} / {SLIDE_TABS.length}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {SLIDE_TABS.map(tab => {
              const isCurrent = tab.id === currentSlide;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentSlide(tab.id)}
                  title={tab.label}
                  style={{
                    width: isCurrent ? 24 : 10,
                    height: 10,
                    borderRadius: 99,
                    border: 'none',
                    background: isCurrent ? color : (isFullscreen ? '#334155' : '#cbd5e1'),
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'all 0.2s ease',
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Next Slide Button */}
        <button
          onClick={handleNext}
          style={{
            padding: '7px 18px',
            borderRadius: '8px',
            border: 'none',
            background: color,
            color: '#ffffff',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>{currentSlide < SLIDE_TABS.length - 1 ? `Next: ${SLIDE_TABS[currentSlide + 1].shortLabel}` : (nextTopic ? `Next Topic: ${nextTopic.title.slice(0, 20)}…` : 'Complete Lesson 🏁')}</span>
          <span>▶</span>
        </button>
      </div>

      {/* ── Topics Drawer Sidebar (Pop-out navigation) ── */}
      {drawerOpen && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: '320px',
            background: isFullscreen ? '#090d16' : '#ffffff',
            borderLeft: isFullscreen ? '1px solid #1e293b' : '1px solid #e2e8f0',
            boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
            zIndex: 999999,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              padding: '16px',
              borderBottom: isFullscreen ? '1px solid #1e293b' : '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ fontWeight: 700, fontSize: '13px', color: isFullscreen ? '#ffffff' : '#0f172a' }}>
              Lesson Topics ({topics.length})
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: '16px',
                color: isFullscreen ? '#94a3b8' : '#64748b',
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
            {topics.map((t, idx) => {
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={t.slug}
                  onClick={() => {
                    setDrawerOpen(false);
                    router.push(`/lessons/${lessonSlug}/${t.slug}`);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: isCurrent ? (isFullscreen ? '#1e293b' : '#f0f4ff') : 'transparent',
                    color: isCurrent ? (isFullscreen ? '#38bdf8' : color) : (isFullscreen ? '#cbd5e1' : '#334155'),
                    textAlign: 'left',
                    fontSize: '12.5px',
                    fontWeight: isCurrent ? 700 : 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '4px',
                  }}
                >
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: isCurrent ? color : (isFullscreen ? '#1e293b' : '#e2e8f0'),
                      color: isCurrent ? '#ffffff' : (isFullscreen ? '#94a3b8' : '#64748b'),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </span>
                  <div style={{ flex: 1 }}>{t.title}</div>
                  <span style={{ fontSize: '11px', color: isFullscreen ? '#64748b' : '#94a3b8' }}>
                    {t.durationMinutes}m
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Lightbox Image Modal (Zoom) ── */}
      {zoomImage && diagram && (
        <div
          onClick={() => setZoomImage(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.88)',
            zIndex: 9999999,
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
