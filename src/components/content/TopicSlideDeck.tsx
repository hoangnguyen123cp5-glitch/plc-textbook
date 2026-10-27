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
  const [studioMode, setStudioMode] = useState(false); // LMS Recording Studio Mode
  const [zoomImage, setZoomImage] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0); // 0: Overview, 1: Key Points, 2: Lab Notes, 3: Simulator, 4: Quiz
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [simulatorLayout, setSimulatorLayout] = useState<'split' | 'full'>('split'); // Split with Telemetry or Full Width

  const prevTopic = topics[currentIndex - 1] ?? null;
  const nextTopic = topics[currentIndex + 1] ?? null;

  const SLIDE_TABS = [
    { id: 0, label: 'Tổng Quan & Sơ Đồ', shortLabel: '1. Sơ Đồ', icon: '📊' },
    { id: 1, label: 'Trọng Tâm Kỹ Thuật', shortLabel: '2. Trọng Tâm', icon: '💡' },
    { id: 2, label: 'Ghi Chú Lab & Tiêu Chuẩn', shortLabel: '3. Ghi Chú Lab', icon: '📖' },
    { id: 3, label: 'Thực Hành Mô Phỏng Ảo', shortLabel: '4. Mô Phỏng Lab', icon: '⚡' },
    { id: 4, label: 'Micro-Quiz Đánh Giá', shortLabel: '5. Micro-Quiz', icon: '📝' },
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
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        setStudioMode(prev => !prev);
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
        } else if (studioMode) {
          setStudioMode(false);
        } else if (isFullscreen) {
          setIsFullscreen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, prevTopic, nextTopic, isFullscreen, studioMode, zoomImage, drawerOpen, lessonSlug]);

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

  const isLMSDisplay = studioMode || isFullscreen;

  return (
    <div
      ref={slideRef}
      style={{
        width: '100%',
        maxWidth: isLMSDisplay ? '100vw' : '1440px',
        margin: '0 auto',
        height: isLMSDisplay ? '100vh' : 'calc(100vh - 90px)',
        minHeight: '620px',
        maxHeight: isLMSDisplay ? '100vh' : '920px',
        background: '#ffffff',
        borderRadius: isLMSDisplay ? '0px' : '14px',
        border: isLMSDisplay ? 'none' : '1.5px solid #cbd5e1',
        boxShadow: isLMSDisplay ? 'none' : '0 10px 30px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: isLMSDisplay ? 'fixed' : 'relative',
        top: isLMSDisplay ? 0 : 'auto',
        left: isLMSDisplay ? 0 : 'auto',
        zIndex: isLMSDisplay ? 9999 : 1,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* ── Top 3px Progress Line ── */}
      <div style={{ height: '3.5px', width: '100%', background: '#e2e8f0', flexShrink: 0 }}>
        <div
          style={{
            height: '100%',
            width: `${((currentSlide + 1) / SLIDE_TABS.length) * 100}%`,
            background: `linear-gradient(90deg, ${color}, #0284c7)`,
            transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </div>

      {/* ── Top Header Bar: Clean LMS Academic Presentation Header ── */}
      <div
        style={{
          padding: isLMSDisplay ? '12px 28px' : '10px 24px',
          background: isLMSDisplay ? '#0f172a' : '#ffffff',
          color: isLMSDisplay ? '#ffffff' : '#0f172a',
          borderBottom: isLMSDisplay ? '2px solid #0284c7' : '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          flexShrink: 0,
          transition: 'all 0.2s ease',
        }}
      >
        {/* Left: Branding & Course Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>{lessonIcon}</span>
          <div>
            <div style={{
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.06em',
              color: isLMSDisplay ? '#38bdf8' : color,
              textTransform: 'uppercase',
            }}>
              {courseCode} · GIÁO TRÌNH ĐIỆN TỬ PLC S7-1200 / S7-300
            </div>
            <div style={{
              fontSize: isLMSDisplay ? '14px' : '13px',
              fontWeight: 800,
              color: isLMSDisplay ? '#ffffff' : '#0f172a',
            }}>
              {lessonTitle} · Chuyên đề {currentIndex + 1}: {currentTopic.title}
            </div>
          </div>
        </div>

        {/* Right: Studio Controls, Fullscreen & Topic Drawer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* LMS Studio Mode Toggle */}
          <button
            onClick={() => setStudioMode(prev => !prev)}
            title="Bật/Tắt chế độ quay bài giảng LMS (Ẩn viền và thanh công cụ)"
            style={{
              padding: '6px 14px',
              borderRadius: '7px',
              border: studioMode ? '1.5px solid #38bdf8' : '1px solid #cbd5e1',
              background: studioMode ? '#0284c7' : isLMSDisplay ? '#1e293b' : '#f8fafc',
              color: studioMode ? '#ffffff' : isLMSDisplay ? '#f1f5f9' : '#0f172a',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: studioMode ? '0 2px 8px rgba(2,132,199,0.3)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <span>🎥</span>
            <span>{studioMode ? 'Đang Quay LMS (Bấm để Thoát)' : 'Chế Độ Quay LMS'}</span>
            <span style={{ fontSize: '10.5px', opacity: 0.8 }}>(R)</span>
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            title="Toàn màn hình trình chiếu"
            style={{
              padding: '6px 14px',
              borderRadius: '7px',
              border: isFullscreen ? '1.5px solid #38bdf8' : '1px solid #cbd5e1',
              background: isFullscreen ? '#0284c7' : isLMSDisplay ? '#1e293b' : '#ffffff',
              color: isFullscreen ? '#ffffff' : isLMSDisplay ? '#f1f5f9' : '#334155',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>{isFullscreen ? '✕ Thu Nhỏ' : '⛶ Toàn Màn Hình'}</span>
            <span style={{ fontSize: '10.5px', opacity: 0.8 }}>(F)</span>
          </button>

          {!isLMSDisplay && (
            <>
              {prevTopic && (
                <button
                  onClick={() => router.push(`/lessons/${lessonSlug}/${prevTopic.slug}`)}
                  title={`Chuyên đề trước: ${prevTopic.title}`}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '7px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#475569',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  ◀ Bài Trước
                </button>
              )}

              {nextTopic && (
                <button
                  onClick={() => router.push(`/lessons/${lessonSlug}/${nextTopic.slug}`)}
                  title={`Chuyên đề tiếp theo: ${nextTopic.title}`}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '7px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#475569',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Bài Sau ▶
                </button>
              )}

              <button
                onClick={() => setDrawerOpen(prev => !prev)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '7px',
                  border: `1px solid ${drawerOpen ? color : '#cbd5e1'}`,
                  background: drawerOpen ? `${color}15` : '#ffffff',
                  color: drawerOpen ? color : '#0f172a',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>📋</span>
                <span>Mục Lục ({topics.length})</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Slide Navigation Tabs Bar: 5 Crisp Sub-Slides ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 24px',
          background: isLMSDisplay ? '#f1f5f9' : '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          gap: '8px',
          flexWrap: 'wrap',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {SLIDE_TABS.map(tab => {
            const isActive = currentSlide === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentSlide(tab.id)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '8px',
                  border: isActive ? `2px solid ${color}` : '1px solid #e2e8f0',
                  background: isActive ? `${color}18` : '#ffffff',
                  color: isActive ? color : '#475569',
                  fontSize: '12.5px',
                  fontWeight: isActive ? 800 : 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: isActive ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>

        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
          Điều hướng: Phím <strong>1..5</strong> · <strong>← / →</strong> hoặc <strong>Phím Cách (Space)</strong>
        </div>
      </div>

      {/* ── Main Slide Stage (ZERO VERTICAL SCROLLBAR: Fits 100% into the frame) ── */}
      <div
        style={{
          flex: 1,
          padding: isLMSDisplay ? '24px 36px' : '20px 28px',
          overflow: 'hidden',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* ── SLIDE 1: Executive Overview & High-Resolution Schematic ── */}
        {currentSlide === 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.15fr 1fr',
              gap: isLMSDisplay ? '36px' : '24px',
              alignItems: 'center',
              height: '100%',
              overflow: 'hidden',
            }}
          >
            {/* Left: Topic Title, Core Concept, Engineering Note */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', justifyContent: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ width: 4, height: 18, background: color, borderRadius: 99 }} />
                  <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', color: color, textTransform: 'uppercase' }}>
                    Chuyên đề {currentIndex + 1} / {topics.length} · Thời lượng ~{currentTopic.durationMinutes} phút
                  </span>
                </div>
                <h2
                  style={{
                    fontSize: isLMSDisplay ? '26px' : '22px',
                    fontWeight: 800,
                    color: '#0f172a',
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
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  borderLeft: `5px solid ${color}`,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.06em', color: color, textTransform: 'uppercase', marginBottom: '8px' }}>
                  🎯 Khái Niệm & Nguyên Lý Tự Động Hoá Cốt Lõi:
                </div>
                <p
                  style={{
                    fontSize: isLMSDisplay ? '15px' : '13.5px',
                    color: '#334155',
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {section?.content ? section.content.split('. ').slice(0, 3).join('. ') + '.' : 'Nội dung bài giảng lý thuyết chuyên đề tự động hoá.'}
                </p>
              </div>

              {/* Engineering Note / Warning */}
              {section?.note && (
                <div
                  style={{
                    padding: '12px 18px',
                    background: '#fffbeb',
                    border: '1px solid #fde68a',
                    borderLeft: '4px solid #f59e0b',
                    borderRadius: '8px',
                    fontSize: isLMSDisplay ? '13px' : '12px',
                    color: '#92400e',
                    lineHeight: 1.55,
                  }}
                >
                  💡 <strong>Lưu ý Giảng viên & Kỹ thuật:</strong> {section.note}
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
                background: '#f8fafc',
                border: '1.5px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                height: '100%',
                maxHeight: isLMSDisplay ? '62vh' : '440px',
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
                    title="Bấm để phóng to sơ đồ kỹ thuật"
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
                        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                      }}
                    />
                  </div>
                  <p
                    style={{
                      fontSize: '11.5px',
                      color: '#475569',
                      marginTop: '8px',
                      fontStyle: 'italic',
                      textAlign: 'center',
                      lineHeight: 1.35,
                      fontWeight: 500,
                    }}
                  >
                    {diagram.caption}
                  </p>
                </>
              ) : (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                  <span style={{ fontSize: '38px', display: 'block', marginBottom: '8px' }}>📊</span>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>Sơ đồ kỹ thuật chuyên đề: {currentTopic.title}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SLIDE 2: Key Engineering Points ── */}
        {currentSlide === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span style={{ width: 4, height: 16, background: color, borderRadius: 99 }} />
                <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', color: color, textTransform: 'uppercase' }}>
                  Trọng Tâm Kỹ Thuật & Quy Tắc Thiết Kế (Key Engineering Principles)
                </span>
              </div>
              <h2 style={{ fontSize: isLMSDisplay ? '24px' : '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Các Nguyên Lý Trọng Tâm Cần Ghi Nhớ · {currentTopic.title}
              </h2>
            </div>

            {/* Grid of Key Points Cards (Fits 100% without scrollbar) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '14px',
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
                        background: '#f8fafc',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '10px',
                        padding: '14px 18px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <span style={{
                          width: 24, height: 24, borderRadius: '50%',
                          background: `${color}18`, color: color,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '12px', fontWeight: 800, flexShrink: 0
                        }}>
                          {idx + 1}
                        </span>
                        <strong style={{ color: '#0f172a', fontSize: isLMSDisplay ? '14.5px' : '13.5px' }}>
                          {title}
                        </strong>
                      </div>
                      {desc && (
                        <div style={{ color: '#334155', fontSize: isLMSDisplay ? '13px' : '12px', lineHeight: 1.55, paddingLeft: '34px' }}>
                          {desc}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div style={{ color: '#64748b', fontSize: '13px' }}>Đang nạp các quy tắc kỹ thuật trọng tâm cho chuyên đề này.</div>
              )}
            </div>

            <div style={{ fontSize: '12px', color: '#64748b', textAlign: 'right', fontWeight: 600 }}>
              Slide 2 / 5 · Nhấn <strong>Phím Cách</strong> hoặc <strong>→</strong> để tiếp tục sang Ghi Chú Lab
            </div>
          </div>
        )}

        {/* ── SLIDE 3: Technical Lab Notes & Guidelines ── */}
        {currentSlide === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span style={{ width: 4, height: 16, background: color, borderRadius: 99 }} />
                <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', color: color, textTransform: 'uppercase' }}>
                  Ghi Chú Phòng Thí Nghiệm & Tiêu Chuẩn Thực Hành (Lab Notes & Standards)
                </span>
              </div>
              <h2 style={{ fontSize: isLMSDisplay ? '24px' : '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Lý Thuyết Chuyên Sâu & Tiêu Chuẩn Đấu Nối · {currentTopic.title}
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
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '20px 24px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <h4 style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.06em', color: color, textTransform: 'uppercase', marginBottom: '8px', margin: '0 0 8px 0' }}>
                  Động Học Quá Trình & Nguyên Lý Điều Khiển:
                </h4>
                <p style={{ fontSize: isLMSDisplay ? '14px' : '13px', color: '#334155', lineHeight: 1.7, margin: 0 }}>
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
                      background: '#fffbeb',
                      border: '1.5px solid #fde68a',
                      borderLeft: '5px solid #f59e0b',
                      borderRadius: '8px',
                      padding: '16px 18px',
                      fontSize: isLMSDisplay ? '13px' : '12px',
                      color: '#92400e',
                      lineHeight: 1.6,
                    }}
                  >
                    ⚠️ <strong>Cảnh Báo An Toàn & Lưu Ý Phòng Thí Nghiệm:</strong>
                    <div style={{ marginTop: '6px' }}>{section.note}</div>
                  </div>
                ) : null}

                <div
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '14px 18px',
                    fontSize: isLMSDisplay ? '13px' : '12px',
                    color: '#334155',
                    lineHeight: 1.55,
                  }}
                >
                  <strong style={{ color: '#0f172a' }}>Danh Mục Kiểm Tra Trước Khi Cấp Nguồn (Pre-Power Checklist):</strong>
                  <ul style={{ margin: '6px 0 0 0', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <li>Kiểm tra đúng cực tính nguồn 24VDC (L+ và M) trước khi bật aptomat nguồn CPU.</li>
                    <li>Đảm bảo điện trở thanh đồng nối đất bảo vệ PE &lt; 10 Ω để chống xung nhiễu công nghiệp.</li>
                    <li>Mạch dừng khẩn cấp (Emergency Stop) bắt buộc phải ngắt phần cứng, không chỉ qua phần mềm.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div style={{ fontSize: '12px', color: '#64748b', textAlign: 'right', fontWeight: 600 }}>
              Slide 3 / 5 · Nhấn <strong>Phím Cách</strong> hoặc <strong>→</strong> để tiếp tục sang Bàn Thí Nghiệm Mô Phỏng
            </div>
          </div>
        )}

        {/* ── SLIDE 4: Interactive Live Simulator (Broadcast-Ready Dual Studio View) ── */}
        {currentSlide === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <span style={{ width: 4, height: 16, background: color, borderRadius: 99 }} />
                  <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', color: color, textTransform: 'uppercase' }}>
                    Bàn Thí Nghiệm Ảo & Mô Phỏng Tương Tác Trực Tuyến (Interactive Studio Bench)
                  </span>
                </div>
                <h2 style={{ fontSize: isLMSDisplay ? '22px' : '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Thực Nghiệm Quá Trình: {currentTopic.title}
                </h2>
              </div>

              {/* View Layout Toggle for Lecturer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={() => setSimulatorLayout('split')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: simulatorLayout === 'split' ? `1.5px solid ${color}` : '1px solid #cbd5e1',
                    background: simulatorLayout === 'split' ? `${color}15` : '#ffffff',
                    color: simulatorLayout === 'split' ? color : '#64748b',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  📊 Bố Cục Studio 2 Cánh
                </button>
                <button
                  onClick={() => setSimulatorLayout('full')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: simulatorLayout === 'full' ? `1.5px solid ${color}` : '1px solid #cbd5e1',
                    background: simulatorLayout === 'full' ? `${color}15` : '#ffffff',
                    color: simulatorLayout === 'full' ? color : '#64748b',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  ⛶ Mở Rộng Bàn Thí Nghiệm
                </button>
              </div>
            </div>

            {/* Simulator Node Container: Zero Empty Void */}
            <div
              style={{
                width: '100%',
                flex: 1,
                display: 'flex',
                alignItems: 'stretch',
                overflow: 'hidden',
                padding: '10px 0',
                gap: '16px',
              }}
            >
              {/* Left Column: Live Simulator Canvas */}
              <div
                style={{
                  flex: simulatorLayout === 'split' ? '1.35' : '1',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  overflowY: 'auto',
                  maxHeight: '100%',
                }}
              >
                {simulatorNode}
              </div>

              {/* Right Column: Lecturer Studio Telemetry & Field Analysis (Shown in split mode) */}
              {simulatorLayout === 'split' && (
                <div
                  style={{
                    flex: '1',
                    maxWidth: '430px',
                    background: '#f8fafc',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <span style={{ fontSize: '18px' }}>🎙️</span>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Góc Giảng Viên & Phân Tích Công Nghiệp
                      </span>
                    </div>

                    {/* Section 1: Demonstration Target */}
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 12px', marginBottom: '10px' }}>
                      <span style={{ fontSize: '10.5px', fontWeight: 800, color: color, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                        🎯 Mục Tiêu Trình Chiếu Video LMS:
                      </span>
                      <p style={{ margin: 0, fontSize: '12px', color: '#334155', lineHeight: 1.5 }}>
                        Giảng viên hướng dẫn sinh viên thao tác các nút điều khiển, quan sát sự thay đổi tức thời của dòng tín hiệu và đáp ứng khử nhiễu tự động của PLC.
                      </p>
                    </div>

                    {/* Section 2: Industrial Telemetry */}
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 12px', marginBottom: '10px' }}>
                      <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                        ⚡ Chuẩn Tín Hiệu & Thiết Bị Thật:
                      </span>
                      <div style={{ fontSize: '11.5px', color: '#475569', lineHeight: 1.6 }}>
                        <div>• <strong>PLC:</strong> SIMATIC S7-1200 CPU 1214C DC/DC/DC</div>
                        <div>• <strong>Chuẩn I/O:</strong> 24VDC PNP, 4–20 mA (AI), 0–10V (AO)</div>
                        <div>• <strong>Truyền thông:</strong> PROFINET RT (Chu kỳ quét 1 ms)</div>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Lecturer Tip */}
                  <div style={{
                    background: '#fffbeb',
                    border: '1px solid #fde68a',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    fontSize: '11.5px',
                    color: '#92400e',
                    lineHeight: 1.5,
                  }}>
                    💡 <strong>Gợi ý thuyết minh:</strong> Nhấn mạnh sự khác biệt căn bản giữa hệ vòng kín (có cảm biến phản hồi khử nhiễu) và hệ vòng hở trong môi trường nhà máy thực tế.
                  </div>
                </div>
              )}
            </div>

            <div style={{ fontSize: '12px', color: '#64748b', textAlign: 'right', fontWeight: 600 }}>
              Slide 4 / 5 · Nhấn <strong>Phím Cách</strong> hoặc <strong>→</strong> để tiếp tục sang Micro-Quiz Đánh Giá
            </div>
          </div>
        )}

        {/* ── SLIDE 5: Formative Knowledge Check Micro-Quiz ── */}
        {currentSlide === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span style={{ width: 4, height: 16, background: color, borderRadius: 99 }} />
                <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', color: color, textTransform: 'uppercase' }}>
                  Đánh Giá Quá Trình · Micro-Quiz Củng Cố Kiến Thức (Knowledge Check)
                </span>
              </div>
              <h2 style={{ fontSize: isLMSDisplay ? '22px' : '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Kiểm Tra & Củng Cố Nhanh Cuối Bài Giảng · {currentTopic.title}
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

            <div style={{ fontSize: '12px', color: '#64748b', textAlign: 'right', fontWeight: 600 }}>
              Slide 5 / 5 · Nhấn <strong>Phím Cách</strong> hoặc <strong>→</strong> để chuyển sang Chuyên Đề Kế Tiếp
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom Slide Navigation Bar ── */}
      <div
        style={{
          padding: '10px 24px',
          background: isLMSDisplay ? '#f1f5f9' : '#f8fafc',
          borderTop: '1px solid #e2e8f0',
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
            border: '1px solid #cbd5e1',
            background: '#ffffff',
            color: '#0f172a',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          }}
        >
          <span>◀</span>
          <span>{currentSlide > 0 ? `Slide Trước: ${SLIDE_TABS[currentSlide - 1].shortLabel}` : (prevTopic ? `Bài Trước: ${prevTopic.title.slice(0, 18)}…` : 'Đầu Bài Học')}</span>
        </button>

        {/* Slide Indicator Dots (Showing current slide out of 5) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#334155' }}>
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
                    width: isCurrent ? 26 : 10,
                    height: 10,
                    borderRadius: 99,
                    border: 'none',
                    background: isCurrent ? color : '#cbd5e1',
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
            padding: '7px 20px',
            borderRadius: '8px',
            border: 'none',
            background: color,
            color: '#ffffff',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: `0 2px 8px ${color}33`,
          }}
        >
          <span>{currentSlide < SLIDE_TABS.length - 1 ? `Slide Sau: ${SLIDE_TABS[currentSlide + 1].shortLabel}` : (nextTopic ? `Bài Tiếp: ${nextTopic.title.slice(0, 18)}…` : 'Hoàn Thành Chương 🏁')}</span>
          <span>▶</span>
        </button>
      </div>

      {/* ── Topics Drawer Sidebar (Pop-out navigation, pure light mode) ── */}
      {drawerOpen && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '320px',
            height: '100%',
            background: '#ffffff',
            boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid #e2e8f0',
          }}
        >
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#f8fafc',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Mục Lục Chuyên Đề
              </div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                {lessonTitle}
              </div>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                color: '#64748b',
                padding: '4px',
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
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
                    border: isCurrent ? `1.5px solid ${color}` : '1px solid transparent',
                    background: isCurrent ? `${color}12` : 'transparent',
                    color: isCurrent ? '#0f172a' : '#334155',
                    fontWeight: isCurrent ? 800 : 500,
                    fontSize: '13px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '4px',
                    transition: 'background 0.15s ease',
                  }}
                >
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: isCurrent ? color : '#e2e8f0',
                      color: isCurrent ? '#ffffff' : '#64748b',
                      fontSize: '11px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div>{t.title}</div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                      ~{t.durationMinutes} phút · 5 Slide
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Image Lightbox Modal ── */}
      {zoomImage && diagram && (
        <div
          onClick={() => setZoomImage(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: '92vw',
              maxHeight: '92vh',
              background: '#ffffff',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{diagram.caption}</span>
              <button
                onClick={() => setZoomImage(false)}
                style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', fontWeight: 700 }}
              >
                ✕ Đóng (Esc)
              </button>
            </div>
            <img
              src={asset(diagram.src)}
              alt={diagram.caption}
              style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
