'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { asset } from '@/lib/asset';
import { TopicCaseStudy } from '@/data/topic-case-studies';
import {
  IconChevronLeft,
  IconChevronRight,
  IconList,
  IconMaximize2,
  IconMinimize2,
} from '@/components/ui/TechnicalIcons';

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
  allSections?: SectionItem[];
  chapterOverview?: string;
  chapterObjectives?: string[];
  allDiagrams?: Record<string, { src: string; caption: string }>;
  caseStudy?: TopicCaseStudy;
  simulatorNode?: React.ReactNode;
  quizNode?: React.ReactNode;
}

// 10 Focused Engineering Slide Tabs (MATLAB / Simulink Technical Sequence)
const TOPIC_SLIDES = [
  { id: 0, label: 'Mục Tiêu & Chuẩn Đầu Ra (CLO)', short: '01. CLO & Mục tiêu', category: 'CHUẨN ĐẦU RA MÔN HỌC' },
  { id: 1, label: 'Bối Cảnh & Động Lực Công Nghiệp', short: '02. Động lực công nghiệp', category: 'BỐI CẢNH KỸ THUẬT' },
  { id: 2, label: 'Nguyên Lý Lý Thuyết Cốt Lõi', short: '03. Nguyên lý lý thuyết', category: 'LÝ THUYẾT ĐIỀU KHIỂN' },
  { id: 3, label: 'Sơ Đồ Hệ Thống & Đấu Nối Vật Lý', short: '04. Sơ đồ & Đấu nối', category: 'KIẾN TRÚC VẬT LÝ' },
  { id: 4, label: 'Quy Tắc Vận Hành & Khống Chế Kỹ Thuật', short: '05. Quy tắc vận hành', category: 'NGUYÊN LÝ KHỐNG CHẾ' },
  { id: 5, label: 'Mô Hình Toán Học & Rời Rạc Hóa', short: '06. Mô hình toán học', category: 'MÔ HÌNH TOÁN HỌC' },
  { id: 6, label: 'Tình Huống Kỹ Thuật Nhà Máy', short: '07. Ứng dụng thực tế', category: 'ỨNG DỤNG NHÀ MÁY' },
  { id: 7, label: 'Bàn Mô Phỏng Tương Tác', short: '08. Mô phỏng tương tác', category: 'MÔ PHỎNG TƯƠNG TÁC' },
  { id: 8, label: 'Quy Trình Nghiệm Thu & Chẩn Đoán Lỗi', short: '09. SOP & Chẩn đoán', category: 'NGHIỆM THU & SỰ CỐ' },
  { id: 9, label: 'Tổng Kết & Khuyến Nghị Kỹ Thuật', short: '10. Tổng kết chuyên đề', category: 'TỔNG KẾT BÀI HỌC' },
];

export default function TopicSlideDeck({
  lessonSlug,
  lessonTitle,
  courseCode,
  currentTopic,
  topics,
  currentIndex,
  section,
  diagram,
  allSections = [],
  chapterOverview = '',
  chapterObjectives = [],
  allDiagrams = {},
  caseStudy,
  simulatorNode,
}: Props) {
  const router = useRouter();
  const slideRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [deckMode, setDeckMode] = useState<'topic' | 'chapter'>('topic');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Chapter Deck Sections
  const chapterSections = allSections.length > 0 ? allSections : (section ? [section] : []);
  const totalChapterSlides = chapterSections.length + 5; // Cover + N Sections + Virtual Bench + SOP + Diagnostics + Summary
  const currentTotalSlides = deckMode === 'topic' ? TOPIC_SLIDES.length : totalChapterSlides;

  // Smart section diagram matcher
  const getSectionDiagram = useCallback((secIndex: number, secTitle: string) => {
    // 1. By corresponding topic in topics array
    const topicByIndex = topics[secIndex];
    if (topicByIndex && allDiagrams[topicByIndex.slug]) {
      return allDiagrams[topicByIndex.slug];
    }
    // 2. By numeric match in title (e.g., "1.5" matches topic with "1.5")
    const numMatch = secTitle.match(/^(\d+\.\d+)/);
    if (numMatch) {
      const matchedTopic = topics.find(tp => tp.title.includes(numMatch[1]));
      if (matchedTopic && allDiagrams[matchedTopic.slug]) {
        return allDiagrams[matchedTopic.slug];
      }
    }
    // 3. By exact title key
    if (allDiagrams[secTitle]) return allDiagrams[secTitle];
    // 4. Default to diagram if first section
    return secIndex === 0 ? diagram : null;
  }, [allDiagrams, diagram, topics]);

  // Slide navigation
  const handlePrev = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  }, [currentSlide]);

  const handleNext = useCallback(() => {
    if (currentSlide < currentTotalSlides - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  }, [currentSlide, currentTotalSlides]);

  // Fullscreen toggle
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

  // Auto-hiding controls in Fullscreen Presentation Mode
  const resetHideTimer = useCallback(() => {
    setControlsVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (isFullscreen) {
      hideTimerRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, 3000);
    }
  }, [isFullscreen]);

  useEffect(() => {
    const onActivity = () => resetHideTimer();
    window.addEventListener('mousemove', onActivity);
    window.addEventListener('keydown', onActivity);
    window.addEventListener('touchstart', onActivity);
    resetHideTimer();
    return () => {
      window.removeEventListener('mousemove', onActivity);
      window.removeEventListener('keydown', onActivity);
      window.removeEventListener('touchstart', onActivity);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [resetHideTimer]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName) || (target as HTMLInputElement)?.type === 'range') {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Home') {
        e.preventDefault();
        setCurrentSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setCurrentSlide(currentTotalSlides - 1);
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setNotesOpen(prev => !prev);
      } else if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setDrawerOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        if (zoomImage) {
          setZoomImage(null);
        } else if (notesOpen) {
          setNotesOpen(false);
        } else if (drawerOpen) {
          setDrawerOpen(false);
        } else if (isFullscreen) {
          if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
          setIsFullscreen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, currentTotalSlides, isFullscreen, zoomImage, drawerOpen, notesOpen, handleNext, handlePrev]);

  // Current Slide Metadata
  const currentSlideMeta = deckMode === 'topic'
    ? TOPIC_SLIDES[currentSlide]
    : {
        id: currentSlide,
        label: currentSlide === 0
          ? 'Course Overview & Learning Outcomes'
          : currentSlide <= chapterSections.length
          ? chapterSections[currentSlide - 1]?.title || 'Section Topic'
          : currentSlide === chapterSections.length + 1
          ? 'Process Simulation Bench'
          : currentSlide === chapterSections.length + 2
          ? 'Master Commissioning Checklist'
          : currentSlide === chapterSections.length + 3
          ? 'Fault Diagnostics & Troubleshooting Guide'
          : 'Chapter Summary & Action Checklist',
        category: 'CHƯƠNG TRÌNH ĐÀO TẠO KỸ THUẬT',
      };

  return (
    <div
      ref={slideRef}
      style={{
        width: '100%',
        maxWidth: isFullscreen ? '100vw' : '1440px',
        margin: '0 auto',
        height: isFullscreen ? '100vh' : 'calc(100vh - 86px)',
        minHeight: '640px',
        maxHeight: isFullscreen ? '100vh' : '920px',
        background: '#ffffff',
        borderRadius: isFullscreen ? '0px' : '4px',
        border: isFullscreen ? 'none' : '1px solid #cbd5e1',
        boxShadow: 'none',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: isFullscreen ? 'fixed' : 'relative',
        top: isFullscreen ? 0 : 'auto',
        left: isFullscreen ? 0 : 'auto',
        zIndex: isFullscreen ? 9999 : 1,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* ── Top Progress Line ── */}
      <div style={{ height: '3px', width: '100%', background: '#e2e8f0', flexShrink: 0 }}>
        <div
          style={{
            height: '100%',
            width: `${((currentSlide + 1) / currentTotalSlides) * 100}%`,
            background: '#0072BD',
            transition: 'width 0.2s ease',
          }}
        />
      </div>

      {/* ── Top Technical Header Bar (MATLAB / Simulink Style) ── */}
      <div
        style={{
          padding: isFullscreen ? '10px 24px' : '8px 20px',
          background: '#f8fafc',
          color: '#0f172a',
          borderBottom: '1px solid #cbd5e1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          flexShrink: 0,
        }}
      >
        {/* Left: Branding & Academic Context */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div>
            <div style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              color: '#475569',
              textTransform: 'uppercase',
            }}>
              {courseCode} · SIMATIC S7-1200 / S7-300 COURSEWARE · IEC 61131-2
            </div>
            <div style={{
              fontSize: isFullscreen ? '15px' : '14px',
              fontWeight: 700,
              color: '#0f172a',
            }}>
              {lessonTitle} — <span style={{ color: '#0072BD' }}>{currentTopic.title}</span>
            </div>
          </div>
        </div>

        {/* Center: Slide Position Indicator (PowerPoint Style) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: '#ffffff',
          padding: '4px 12px',
          borderRadius: '4px',
          border: '1px solid #cbd5e1',
        }}>
          <span style={{
            fontSize: '12.5px',
            fontWeight: 700,
            fontFamily: 'Consolas, monospace',
            color: '#0072BD',
          }}>
            [Slide {String(currentSlide + 1).padStart(2, '0')} / {String(currentTotalSlides).padStart(2, '0')}]
          </span>
          <span style={{ fontSize: '12px', color: '#64748b' }}>·</span>
          <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>
            {currentSlideMeta.label}
          </span>
        </div>

        {/* Right: Technical Actions & Navigation Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Deck Mode Toggle */}
          <div style={{ display: 'flex', background: '#ffffff', padding: '2px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
            <button
              onClick={() => {
                setDeckMode('topic');
                setCurrentSlide(0);
              }}
              style={{
                padding: '4px 10px',
                borderRadius: '3px',
                border: 'none',
                background: deckMode === 'topic' ? '#0072BD' : 'transparent',
                color: deckMode === 'topic' ? '#ffffff' : '#475569',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Chuyên đề (10 slide)
            </button>
            <button
              onClick={() => {
                setDeckMode('chapter');
                setCurrentSlide(0);
              }}
              style={{
                padding: '4px 10px',
                borderRadius: '3px',
                border: 'none',
                background: deckMode === 'chapter' ? '#0072BD' : 'transparent',
                color: deckMode === 'chapter' ? '#ffffff' : '#475569',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Toàn chương ({totalChapterSlides} slide)
            </button>
          </div>

          {/* Speaker Notes Toggle (Key: N) */}
          <button
            onClick={() => setNotesOpen(prev => !prev)}
            title="Bật/Tắt Ghi chú giảng viên (Phím: N)"
            style={{
              padding: '5px 10px',
              borderRadius: '4px',
              border: notesOpen ? '1px solid #0072BD' : '1px solid #cbd5e1',
              background: notesOpen ? '#eff6ff' : '#ffffff',
              color: notesOpen ? '#0072BD' : '#334155',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <span>Ghi chú</span>
            <span style={{ fontSize: '10px', color: '#64748b' }}>(N)</span>
          </button>

          {/* Outline Button (Key: M) */}
          <button
            onClick={() => setDrawerOpen(prev => !prev)}
            title="Mục lục bài giảng (Phím: M)"
            style={{
              padding: '5px 10px',
              borderRadius: '4px',
              border: drawerOpen ? '1px solid #0072BD' : '1px solid #cbd5e1',
              background: drawerOpen ? '#eff6ff' : '#ffffff',
              color: drawerOpen ? '#0072BD' : '#334155',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <IconList size={14} />
            <span>Mục lục</span>
          </button>

          {/* Fullscreen Button (Key: F) */}
          <button
            onClick={toggleFullscreen}
            title="Toàn màn hình trình chiếu (Phím: F)"
            style={{
              padding: '5px 10px',
              borderRadius: '4px',
              border: isFullscreen ? '1px solid #0072BD' : '1px solid #cbd5e1',
              background: isFullscreen ? '#eff6ff' : '#ffffff',
              color: isFullscreen ? '#0072BD' : '#334155',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            {isFullscreen ? <IconMinimize2 size={14} /> : <IconMaximize2 size={14} />}
            <span>{isFullscreen ? 'Thoát' : 'Toàn màn hình'}</span>
          </button>
        </div>
      </div>

      {/* ── Main Stage Workspace (ZERO VERTICAL SCROLLBAR: Fits 100% Viewport) ── */}
      <div
        style={{
          flex: 1,
          padding: isFullscreen ? '22px 36px 76px 36px' : '18px 26px 64px 26px',
          overflow: 'hidden',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        {/* ════════════════════════════════════════════════════════════════════
           A. TOPIC FOCUS DECK (10 HIGH-PRECISION MATLAB-STYLE SLIDES)
        ════════════════════════════════════════════════════════════════════ */}
        {deckMode === 'topic' && (() => {
          // Slide 0: CLO & Objectives
          if (currentSlide === 0) {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1px solid #cbd5e1', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ width: 4, height: 16, background: '#0072BD', borderRadius: 2 }} />
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {TOPIC_SLIDES[0].category} · CHUYÊN ĐỀ {currentIndex + 1} / {topics.length}
                    </span>
                  </div>
                  <h1 style={{ fontSize: isFullscreen ? '28px' : '25px', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.25 }}>
                    {currentTopic.title}
                  </h1>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '22px', flex: 1, alignItems: 'stretch', margin: '14px 0' }}>
                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '20px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                        Chuẩn Đầu Ra Môn Học (CLO):
                      </span>
                      <p style={{ margin: 0, fontSize: '15.5px', color: '#1e293b', lineHeight: 1.65 }}>
                        Sau khi hoàn thành chuyên đề này, sinh viên nắm vững nguyên lý truyền dẫn tín hiệu vật lý, các ràng buộc thời gian thực của PLC, và quy chuẩn nghiệm thu lắp đặt cho <strong>{currentTopic.title}</strong> theo tiêu chuẩn tự động hóa công nghiệp IEC 61131.
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, padding: '5px 12px', borderRadius: '4px', background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155' }}>
                        Thời lượng: ~{currentTopic.durationMinutes} phút
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 600, padding: '5px 12px', borderRadius: '4px', background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155' }}>
                        Bàn mô phỏng tương tác
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 600, padding: '5px 12px', borderRadius: '4px', background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155' }}>
                        Mô hình Siemens S7-1200
                      </span>
                    </div>
                  </div>

                  {/* Right: Engineering Competency Overview */}
                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                      Trọng Tâm Kỹ Thuật Chuyên Đề:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ padding: '10px 14px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                        <strong style={{ fontSize: '13px', color: '#0f172a' }}>1. Kiến trúc vật lý & cách ly tín hiệu:</strong>
                        <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px', lineHeight: 1.45 }}>Phân biệt mạch cách ly quang 500V, đấu nối PNP/NPN và vòng dòng 4–20 mA.</div>
                      </div>
                      <div style={{ padding: '10px 14px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                        <strong style={{ fontSize: '13px', color: '#0f172a' }}>2. Chu kỳ quét xác định (Deterministic Scan):</strong>
                        <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px', lineHeight: 1.45 }}>Tổ chức ngắt tuần hoàn OB30 loại bỏ hoàn toàn hiện tượng jitter chu kỳ.</div>
                      </div>
                      <div style={{ padding: '10px 14px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                        <strong style={{ fontSize: '13px', color: '#0f172a' }}>3. Quy trình nghiệm thu & chẩn đoán lỗi:</strong>
                        <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px', lineHeight: 1.45 }}>Quy tắc chống rung tiếp điểm, xử lý vòng lặp mass và lỗi watchdog OB80.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Slide 1: Industrial Motivation & Drivers
          if (currentSlide === 1) {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1px solid #cbd5e1', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ width: 4, height: 16, background: '#0072BD', borderRadius: 2 }} />
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase' }}>
                      {TOPIC_SLIDES[1].category}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.25 }}>
                    Bối Cảnh & Động Lực Kỹ Thuật Công Nghiệp: {currentTopic.title}
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '22px', flex: 1, alignItems: 'stretch', margin: '14px 0' }}>
                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '20px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                        Thách Thức Kỹ Thuật Thực Tế:
                      </span>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '0 0 10px 0' }}>
                        Khắc Phục Ràng Buộc Phần Cứng Cứng Nhắc & Thời Gian Dừng Dây Chuyền
                      </h3>
                      <p style={{ fontSize: '15px', color: '#1e293b', lineHeight: 1.65, margin: 0 }}>
                        {section?.content ? section.content.split('. ').slice(0, 3).join('. ') + '.' : 'Trước khi điều khiển khả trình phổ biến, các nhà máy công nghiệp chịu tổn thất lớn do mỏi cơ khí relay, dây nối chằng chịt và thiếu giám sát từ xa.'}
                      </p>
                    </div>

                    <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '14px 16px', marginTop: '14px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                        Giá Trị Kỹ Thuật Của PLC Hiện Đại:
                      </span>
                      <div style={{ fontSize: '14px', color: '#334155', lineHeight: 1.55 }}>
                        Loại bỏ rơ-le trung gian, thu gọn tủ điện &gt;80%, đảm bảo chu kỳ quét micro-giây xác định và tích hợp trực tiếp mạng truyền thông PROFINET / Modbus TCP.
                      </div>
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase', marginBottom: '10px' }}>
                      Bảng So Sánh Công Nghệ:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '12px 14px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#b91c1c', marginBottom: '4px' }}>Phương Pháp Rơ-le Truyền Thống</div>
                        <div style={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.5 }}>Tiếp điểm cơ học mỏi theo thời gian, đấu dây cố định, thời gian sửa chữa dừng máy kéo dài, không có dữ liệu chẩn đoán.</div>
                      </div>
                      <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '12px 14px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#15803d', marginBottom: '4px' }}>Kiến Trúc PLC Vi Điều Khiển</div>
                        <div style={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.5 }}>Lập trình linh hoạt theo IEC 61131, chỉnh sửa online không dừng chuyền, giám sát tín hiệu qua SCADA/HMI.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Slide 2: Core Theoretical Principle
          if (currentSlide === 2) {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1px solid #cbd5e1', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ width: 4, height: 16, background: '#0072BD', borderRadius: 2 }} />
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase' }}>
                      {TOPIC_SLIDES[2].category}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.25 }}>
                    Nguyên Lý Lý Thuyết Cốt Lõi: {currentTopic.title}
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '22px', flex: 1, alignItems: 'stretch', margin: '14px 0' }}>
                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '20px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                        Cơ Sở Lý Thuyết & Luồng Tín Hiệu:
                      </span>
                      <p style={{ fontSize: '15px', color: '#1e293b', lineHeight: 1.65, margin: 0 }}>
                        {section?.content || 'Nguyên lý lý thuyết mô tả quá trình thu thập tín hiệu vật lý, xử lý thuật toán tuần hoàn và xuất tín hiệu điều khiển ra cơ cấu chấp hành.'}
                      </p>
                    </div>

                    {section?.note && (
                      <div style={{ marginTop: '14px', padding: '12px 14px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                        <strong style={{ color: '#0f172a' }}>Lưu ý kỹ thuật:</strong> {section.note}
                      </div>
                    )}
                  </div>

                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', marginBottom: '10px' }}>
                      Chu Trình Xử Lý Tín Hiệu Số:
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'Consolas, monospace', fontSize: '12px' }}>
                      <div style={{ padding: '10px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '3px' }}>
                        01. Đại lượng vật lý (Nhiệt/Áp/Lưu lượng) ➔ Cảm biến đo lường
                      </div>
                      <div style={{ padding: '10px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '3px' }}>
                        02. 24VDC / 4–20 mA ➔ Cách ly quang 500V & Bộ biến đổi ADC
                      </div>
                      <div style={{ padding: '10px 12px', background: '#eff6ff', border: '1px solid #0072BD', borderRadius: '3px', color: '#0072BD', fontWeight: 700 }}>
                        03. Vùng nhớ ảnh quá trình (PII) ➔ CPU xử lý chương trình OB1 / OB30
                      </div>
                      <div style={{ padding: '10px 12px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '3px', color: '#15803d', fontWeight: 700 }}>
                        04. Vùng nhớ ngõ ra (PIQ) ➔ Transistor / Relay kích chấp hành
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Slide 3: System Schematics & Wiring (FIGURE 1.1)
          if (currentSlide === 3) {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1px solid #cbd5e1', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ width: 4, height: 16, background: '#0072BD', borderRadius: 2 }} />
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase' }}>
                      {TOPIC_SLIDES[3].category}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.25 }}>
                    Sơ Đồ Hệ Thống & Đấu Nối Vật Lý: {currentTopic.title}
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: '22px', flex: 1, alignItems: 'stretch', margin: '14px 0', minHeight: 0 }}>
                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '20px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                        Kiến Trúc Đầu Cổng I/O Công Nghiệp:
                      </span>
                      <p style={{ margin: 0, fontSize: '15px', color: '#1e293b', lineHeight: 1.65 }}>
                        Ngõ vào số 24VDC sử dụng mạch bán dẫn PNP (sinking/sourcing) cách ly quang 500V. Kênh analog dùng cáp xoắn đôi có vỏ bọc chống nhiễu (STP) truyền dòng điện 4–20 mA hoặc điện áp 0–10V.
                      </p>
                    </div>

                    <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '12px 14px', fontSize: '13px', color: '#475569', marginTop: '14px' }}>
                      <strong style={{ color: '#0f172a' }}>Quy tắc lắp đặt:</strong> Luôn nối chân 1M về cực âm 0VDC của bộ nguồn phụ SITOP để thiết lập mạch chuẩn cho ngõ vào số Type 1 theo IEC 61131.
                    </div>
                  </div>

                  {/* Right: Technical Schematic Visualizer */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '14px', height: '100%' }}>
                    {diagram ? (
                      <>
                        <div
                          onClick={() => setZoomImage(diagram.src)}
                          style={{ width: '100%', height: '88%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-in', background: '#ffffff', borderRadius: '4px', border: '1px solid #e2e8f0', overflow: 'hidden' }}
                          title="Nhấp để phóng to toàn màn hình sơ đồ"
                        >
                          <img
                            src={asset(diagram.src)}
                            alt={diagram.caption}
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                          />
                        </div>
                        <p style={{ fontSize: '12px', color: '#475569', marginTop: '8px', textAlign: 'center', lineHeight: 1.35, fontWeight: 500, margin: '8px 0 0 0' }}>
                          {diagram.caption}
                        </p>
                      </>
                    ) : (
                      <div style={{ textAlign: 'center', color: '#64748b' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600 }}>Sơ Đồ Kỹ Thuật Đang Tải</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          // Slide 4: Key Technical Principles
          if (currentSlide === 4) {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1px solid #cbd5e1', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ width: 4, height: 16, background: '#0072BD', borderRadius: 2 }} />
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase' }}>
                      {TOPIC_SLIDES[4].category}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.25 }}>
                    Quy Tắc Vận Hành & Khống Chế Kỹ Thuật: {currentTopic.title}
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', flex: 1, alignContent: 'center', margin: '14px 0' }}>
                  {section?.keyPoints && section.keyPoints.length > 0 ? (
                    section.keyPoints.slice(0, 6).map((kp, idx) => {
                      const parts = kp.split(':');
                      const title = parts[0];
                      const desc = parts.slice(1).join(':').trim();
                      return (
                        <div key={idx} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ width: 22, height: 22, borderRadius: '2px', background: '#0072BD', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                            <strong style={{ color: '#0f172a', fontSize: '14px' }}>{title}</strong>
                          </div>
                          {desc && (
                            <div style={{ color: '#334155', fontSize: '13px', lineHeight: 1.5, paddingLeft: '30px' }}>{desc}</div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ color: '#64748b', fontSize: '13px' }}>Đang nạp các nguyên lý khống chế hệ thống.</div>
                  )}
                </div>
              </div>
            );
          }

          // Slide 5: Mathematical Formulation
          if (currentSlide === 5) {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1px solid #cbd5e1', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ width: 4, height: 16, background: '#0072BD', borderRadius: 2 }} />
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase' }}>
                      {TOPIC_SLIDES[5].category}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.25 }}>
                    Mô Hình Toán Học & Ràng Buộc Rời Rạc Hóa: {currentTopic.title}
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '22px', flex: 1, alignItems: 'stretch', margin: '14px 0' }}>
                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '20px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                        Phương Trình Điều Khiển & Quan Hệ Biến Số:
                      </span>
                      <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '14px 16px', fontFamily: 'Consolas, monospace', fontSize: '14.5px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
                        {caseStudy?.keyFormulaOrMetric || 'e(t) = SP(t) − PV(t) | Chu kỳ quét T_scan = T_input + T_logic + T_diag + T_output <= 10 ms'}
                      </div>
                      <p style={{ fontSize: '14.5px', color: '#1e293b', lineHeight: 1.65, margin: 0 }}>
                        Tính toán thời gian thực đòi hỏi thời gian quét tồi nhất $T_{'{scan}'}$ phải luôn nhỏ hơn ngưỡng bảo vệ watchdog của CPU (mặc định 150 ms trong TIA Portal, tối ưu hóa &lt; 10 ms trong điều khiển đóng mở nhanh).
                      </p>
                    </div>

                    <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '12px 14px', fontSize: '13px', color: '#475569', marginTop: '12px' }}>
                      <strong style={{ color: '#0f172a' }}>Tiêu chuẩn lấy mẫu Nyquist:</strong> Tần số lấy mẫu ngõ vào phải lớn hơn ít nhất 2 lần tần số động học cao nhất của đối tượng vật lý để tránh méo tín hiệu do hiện tượng aliasing.
                    </div>
                  </div>

                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase' }}>
                      Bảng Thông Số Kỹ Thuật Thời Gian Thực:
                    </span>
                    <div style={{ padding: '10px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '3px', fontSize: '13px' }}>
                      • <strong>Độ dao động chu kỳ (Jitter):</strong> &lt; 100 μs trên CPU Siemens S7-1200
                    </div>
                    <div style={{ padding: '10px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '3px', fontSize: '13px' }}>
                      • <strong>Độ phân giải ADC:</strong> 12-bit đến 16-bit (tương ứng 0..27648 đơn vị chuẩn)
                    </div>
                    <div style={{ padding: '10px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '3px', fontSize: '13px' }}>
                      • <strong>Độ trễ lọc quang (Optocoupler):</strong> 0.2 ms đến 12.8 ms (cấu hình trong Hardware Configuration)
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Slide 6: Factory Case Study
          if (currentSlide === 6) {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1px solid #cbd5e1', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ width: 4, height: 16, background: '#0072BD', borderRadius: 2 }} />
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase' }}>
                      {TOPIC_SLIDES[6].category}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.25 }}>
                    Tình Huống Ứng Dụng Nhà Máy Thực Tế: {currentTopic.title}
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: '22px', flex: 1, alignItems: 'stretch', margin: '14px 0' }}>
                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '20px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px', display: 'block' }}>
                        Hiện Trường Ứng Dụng:
                      </span>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                        {caseStudy?.caseTitle || `Dây chuyền tự động hóa công nghiệp: ${currentTopic.title}`}
                      </h3>
                      <p style={{ fontSize: '15px', color: '#1e293b', lineHeight: 1.65, margin: 0 }}>
                        {caseStudy?.industryApplication || section?.content}
                      </p>
                    </div>

                    <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '12px 14px', marginTop: '12px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase', display: 'block', marginBottom: '3px' }}>
                        Chỉ Số Vận Hành Trọng Yếu:
                      </span>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', fontFamily: 'Consolas, monospace' }}>
                        {caseStudy?.keyFormulaOrMetric || 'Giảm thời gian dừng máy > 90% | MTBF > 80,000 giờ vận hành'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'space-between' }}>
                    <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '14px 16px' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                        Quy Chuẩn An Toàn & Lắp Đặt:
                      </span>
                      <div style={{ fontSize: '13px', color: '#334155', lineHeight: 1.55 }}>
                        Tuân thủ tiêu chuẩn an toàn thiết bị IEC 61131-2, cách ly điện áp &gt;500 VAC và phân chia máng cáp độc lập giữa nguồn động lực 400VAC và tín hiệu điều khiển 24VDC.
                      </div>
                    </div>

                    <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '14px 16px' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                        Phần Cứng Hiện Trường Triển Khai:
                      </span>
                      <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12.5px', color: '#475569', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        {(caseStudy?.fieldHardware || [
                          'CPU: Siemens SIMATIC S7-1200 1214C DC/DC/DC',
                          'Tín hiệu: 24VDC PNP, 4–20 mA Analog, PROFINET RT',
                        ]).map((hw, hIdx) => (
                          <li key={hIdx}>{hw}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '12px 14px', fontSize: '12.5px', color: '#334155', lineHeight: 1.5 }}>
                      <strong style={{ color: '#0f172a' }}>Bài học hiện trường:</strong> {caseStudy?.commonPitfall || 'Luôn đảm bảo điện trở nối đất bảo vệ (PE) < 10 ohm và tách biệt mass DC điều khiển M.'}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Slide 7: Virtual Simulation Bench (HANDS-ON INTERACTIVE LAB)
          if (currentSlide === 7) {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1px solid #cbd5e1', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ width: 4, height: 16, background: '#0072BD', borderRadius: 2 }} />
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase' }}>
                      {TOPIC_SLIDES[7].category}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.25 }}>
                    Bàn Mô Phỏng Tương Tác: {currentTopic.title}
                  </h2>
                </div>

                <div style={{ width: '100%', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '8px 0' }}>
                  <div style={{ width: '100%', maxHeight: '100%' }}>
                    {simulatorNode}
                  </div>
                </div>
              </div>
            );
          }

          // Slide 8: Commissioning SOP & Fault Diagnostics Matrix
          if (currentSlide === 8) {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1px solid #cbd5e1', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ width: 4, height: 16, background: '#0072BD', borderRadius: 2 }} />
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase' }}>
                      {TOPIC_SLIDES[8].category}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.25 }}>
                    Quy Trình Nghiệm Thu (SOP) & Ma Trận Xử Lý Sự Cố Hiện Trường
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '22px', flex: 1, alignContent: 'center', margin: '14px 0' }}>
                  {/* Left: 4-Step Commissioning SOP */}
                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '16px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase', marginBottom: '10px' }}>
                      Quy Trình Nghiệm Thu 4 Bước (Commissioning SOP):
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '3px', padding: '12px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '3px' }}>1. Đo nguội (Cold Test)</div>
                        <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.45 }}>Cắt nguồn toàn bộ tủ. Đo kiểm tra thông mạch tiếp địa PE &lt; 10Ω và siết ốc chân domino.</div>
                      </div>
                      <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '3px', padding: '12px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '3px' }}>2. Cấp nguồn 24VDC</div>
                        <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.45 }}>Đo điện áp bus DC (20.4–28.8V), kiểm tra LED báo nguồn và diode chống ngược cực.</div>
                      </div>
                      <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '3px', padding: '12px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '3px' }}>3. Thử vòng lặp I/O</div>
                        <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.45 }}>Force thử từng ngõ ra DO, kích cảm biến DI tại chỗ, xác nhận đèn LED cổng sáng đúng.</div>
                      </div>
                      <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '3px', padding: '12px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#15803d', marginBottom: '3px' }}>4. Chạy RUN online</div>
                        <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.45 }}>Nạp chương trình từ TIA Portal, chuyển CPU sang RUN và kiểm tra thời gian quét cycle time.</div>
                      </div>
                    </div>
                  </div>

                  {/* Right: 3-Point Fault Diagnostics */}
                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '16px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', marginBottom: '10px' }}>
                      Ma Trận Sự Cố & Giải Pháp Sửa Chữa:
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ padding: '10px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '3px' }}>
                        <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#b91c1c' }}>Rung tiếp điểm cơ khí (Contact Bounce)</div>
                        <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>Cài đặt bộ lọc phần mềm DI (6.4 ms mặc định) trong cấu hình phần cứng TIA Portal.</div>
                      </div>
                      <div style={{ padding: '10px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '3px' }}>
                        <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#b45309' }}>Nhiễu vòng lặp mass (Ground Loop 50Hz)</div>
                        <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>Chỉ nối vỏ bọc chống nhiễu tại một đầu tủ điện PLC, thả nổi đầu cảm biến.</div>
                      </div>
                      <div style={{ padding: '10px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '3px' }}>
                        <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0072BD' }}>Quá chu kỳ Watchdog (Lỗi OB80)</div>
                        <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>Xóa bỏ vòng lặp vô tận trong OB1; chuyển hàm tính toán nặng vào ngắt chu kỳ OB30.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Slide 9: Executive Summary
          if (currentSlide === 9) {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1px solid #cbd5e1', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ width: 4, height: 16, background: '#0072BD', borderRadius: 2 }} />
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase' }}>
                      {TOPIC_SLIDES[9].category}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.25 }}>
                    Tổng Kết Chuyên Đề & Khuyến Nghị Vận Hành: {currentTopic.title}
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '22px', flex: 1, alignItems: 'stretch', margin: '14px 0' }}>
                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '20px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#15803d', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                        Năng Lực Kỹ Thuật Đạt Được:
                      </span>
                      <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '14.5px', color: '#1e293b', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <li>Hiểu rõ 5 thành phần cốt lõi của cấu trúc điều khiển tự động hóa.</li>
                        <li>Phân tích nguyên lý cách ly điện và luồng tín hiệu số qua ngõ I/O của S7-1200.</li>
                        <li>Áp dụng chu kỳ quét xác định để triệt tiêu hiện tượng tranh chấp tín hiệu.</li>
                        <li>Nghiệm thu, đo kiểm và xử lý sự cố đấu nối hiện trường theo tiêu chuẩn IEC 61131.</li>
                      </ul>
                    </div>

                    <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '12px 14px', fontSize: '13px', color: '#15803d', marginTop: '14px' }}>
                      <strong>Tiến độ môn học:</strong> Chuyên đề {currentIndex + 1} / {topics.length} đã hoàn thành. Sẵn sàng tiếp tục chuyên đề tiếp theo.
                    </div>
                  </div>

                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px' }}>
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase' }}>
                      Tiêu Chuẩn Công Nghiệp Áp Dụng:
                    </div>
                    <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.65 }}>
                      <div>• <strong>IEC 61131-2:</strong> Yêu cầu kỹ thuật và thử nghiệm phần cứng thiết bị</div>
                      <div>• <strong>IEC 61131-3:</strong> Quy chuẩn các ngôn ngữ lập trình PLC</div>
                      <div>• <strong>NEMA ICS 3:</strong> Quy chuẩn hệ thống điều khiển công nghiệp</div>
                      <div>• <strong>NFPA 79:</strong> Tiêu chuẩn an toàn điện cho máy công cụ công nghiệp</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return null;
        })()}

        {/* ════════════════════════════════════════════════════════════════════
           B. FULL CHAPTER DECK MODE
        ════════════════════════════════════════════════════════════════════ */}
        {deckMode === 'chapter' && (() => {
          // Slide 0: Chapter Overview & CLO
          if (currentSlide === 0) {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1px solid #cbd5e1', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ width: 4, height: 16, background: '#0072BD', borderRadius: 2 }} />
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase' }}>
                      CHƯƠNG TRÌNH ĐÀO TẠO KỸ THUẬT · TỔNG QUAN TOÀN CHƯƠNG
                    </span>
                  </div>
                  <h1 style={{ fontSize: isFullscreen ? '28px' : '25px', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.25 }}>
                    {lessonTitle}
                  </h1>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '22px', flex: 1, alignItems: 'stretch', margin: '14px 0' }}>
                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '20px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                        Mục Tiêu Trọng Tâm Toàn Chương:
                      </span>
                      <p style={{ margin: 0, fontSize: '15.5px', color: '#1e293b', lineHeight: 1.65 }}>
                        {chapterOverview || 'Chương này cung cấp kiến thức nền tảng và phương pháp thực hành chuyên sâu về kỹ thuật điều khiển tự động hóa bằng PLC, từ đấu nối mạch vật lý đến thuật toán điều khiển số.'}
                      </p>
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', marginBottom: '10px' }}>
                      Các Chuẩn Đầu Ra Cốt Lõi:
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '14px', color: '#334155', lineHeight: 1.65, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {(chapterObjectives.length > 0 ? chapterObjectives : [
                        'Làm chủ kiến trúc vi điều khiển của PLC Siemens SIMATIC S7-1200.',
                        'Thiết kế sơ đồ đấu nối cách ly I/O theo tiêu chuẩn công nghiệp.',
                        'Triển khai các khối hàm điều khiển thời gian thực qua TIA Portal.',
                        'Chẩn đoán, khắc phục sự cố và bảo trì hệ thống điều khiển tự động.',
                      ]).map((obj, oIdx) => (
                        <li key={oIdx}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          }

          // Slide 1..N: Curriculum Sections (DYNAMIC BALANCED 2-COLUMN PRESENTATION)
          if (currentSlide >= 1 && currentSlide <= chapterSections.length) {
            const secIndex = currentSlide - 1;
            const sec = chapterSections[secIndex];
            const secDiagram = getSectionDiagram(secIndex, sec.title);
            const hasDiagram = !!secDiagram;
            const keyPoints = sec.keyPoints || [];

            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                {/* Section Header */}
                <div style={{ borderBottom: '1px solid #cbd5e1', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ width: 4, height: 16, background: '#0072BD', borderRadius: 2 }} />
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      NỘI DUNG CHUYÊN ĐỀ {String(currentSlide).padStart(2, '0')} / {String(chapterSections.length).padStart(2, '0')}
                    </span>
                  </div>
                  <h2 style={{ fontSize: isFullscreen ? '26px' : '23px', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.25 }}>
                    {sec.title}
                  </h2>
                </div>

                {/* Main Content Area: Stretched 2 Columns */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: hasDiagram ? '1.15fr 1fr' : (keyPoints.length > 0 ? '1.1fr 1fr' : '1fr'),
                  gap: '22px',
                  flex: 1,
                  alignItems: 'stretch',
                  margin: '14px 0',
                  minHeight: 0,
                }}>
                  {/* Left Column: Core Formulation & Definition */}
                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    padding: '18px 22px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}>
                    <div>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                        Định Nghĩa Tiêu Chuẩn & Nguyên Lý Hoạt Động:
                      </span>
                      <p style={{ margin: 0, fontSize: '15.5px', color: '#1e293b', lineHeight: 1.65 }}>
                        {sec.content}
                      </p>
                    </div>

                    {hasDiagram && keyPoints.length > 0 && (
                      <div style={{ marginTop: '14px', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                          Đặc Tính Kỹ Thuật Trọng Tâm:
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          {keyPoints.slice(0, 3).map((kp, kIdx) => (
                            <div key={kIdx} style={{ fontSize: '13px', color: '#334155', display: 'flex', gap: '6px', lineHeight: 1.45 }}>
                              <span style={{ color: '#0072BD', fontWeight: 700 }}>•</span>
                              <span>{kp}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {sec.note && (
                      <div style={{ marginTop: '12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '10px 14px', fontSize: '13px', color: '#475569' }}>
                        <strong style={{ color: '#0f172a' }}>Lưu ý kỹ thuật:</strong> {sec.note}
                      </div>
                    )}
                  </div>

                  {/* Right Column: High-Resolution Technical Diagram OR Structured Cards */}
                  {hasDiagram ? (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      padding: '14px',
                      height: '100%',
                    }}>
                      <div
                        onClick={() => setZoomImage(secDiagram.src)}
                        style={{ width: '100%', height: '88%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-in', background: '#ffffff', borderRadius: '4px', border: '1px solid #e2e8f0', overflow: 'hidden' }}
                        title="Nhấp để phóng to toàn màn hình sơ đồ kỹ thuật"
                      >
                        <img
                          src={asset(secDiagram.src)}
                          alt={secDiagram.caption}
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                      </div>
                      <p style={{ fontSize: '12px', color: '#475569', marginTop: '8px', textAlign: 'center', lineHeight: 1.35, fontWeight: 500, margin: '8px 0 0 0' }}>
                        {secDiagram.caption}
                      </p>
                    </div>
                  ) : (
                    <div style={{
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      padding: '18px 20px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}>
                      <div>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                          Các Tiêu Chuẩn & Yêu Cầu Kỹ Thuật:
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {keyPoints.length > 0 ? (
                            keyPoints.map((kp, kIdx) => {
                              const parts = kp.split(':');
                              const kpTitle = parts[0];
                              const kpDesc = parts.slice(1).join(':').trim();
                              return (
                                <div key={kIdx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '10px 12px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                                    <span style={{ width: 22, height: 22, borderRadius: '2px', background: '#0072BD', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>
                                      {String(kIdx + 1).padStart(2, '0')}
                                    </span>
                                    <strong style={{ fontSize: '13.5px', color: '#0f172a' }}>{kpTitle}</strong>
                                  </div>
                                  {kpDesc && (
                                    <div style={{ fontSize: '12.5px', color: '#334155', paddingLeft: '30px', lineHeight: 1.5 }}>
                                      {kpDesc}
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <div style={{ fontSize: '13px', color: '#64748b' }}>Tiêu chuẩn công nghiệp theo IEC 61131.</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          }

          // Slide N+1: Virtual Simulation Bench
          if (currentSlide === chapterSections.length + 1) {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1px solid #cbd5e1', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ width: 4, height: 16, background: '#0072BD', borderRadius: 2 }} />
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase' }}>
                      BÀN MÔ PHỎNG TƯƠNG TÁC
                    </span>
                  </div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.25 }}>
                    Mô Phỏng Quá Trình Thời Gian Thực: {lessonTitle}
                  </h2>
                </div>

                <div style={{ width: '100%', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '8px 0' }}>
                  <div style={{ width: '100%', maxHeight: '100%' }}>
                    {simulatorNode}
                  </div>
                </div>
              </div>
            );
          }

          // Slide N+2: Master Commissioning Checklist
          if (currentSlide === chapterSections.length + 2) {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1px solid #cbd5e1', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ width: 4, height: 16, background: '#0072BD', borderRadius: 2 }} />
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase' }}>
                      QUY TRÌNH NGHIỆM THU HIỆN TRƯỜNG
                    </span>
                  </div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.25 }}>
                    Bảng Kiểm Nghiệm Thu & An Toàn: {lessonTitle}
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', flex: 1, alignContent: 'center', margin: '14px 0' }}>
                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '16px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#0072BD', marginBottom: '4px' }}>1. Đo nguội</div>
                    <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>Đo kiểm tra thông mạch tiếp địa PE &lt; 10Ω và siết ốc chân domino.</div>
                  </div>
                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '16px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#0072BD', marginBottom: '4px' }}>2. Cấp nguồn 24VDC</div>
                    <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>Đo điện áp bus DC (20.4–28.8V) và kiểm tra LED nguồn CPU.</div>
                  </div>
                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '16px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#0072BD', marginBottom: '4px' }}>3. Thử vòng lặp I/O</div>
                    <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>Force ngõ ra DO, kích cảm biến DI tại chỗ, kiểm tra dòng 4–20 mA.</div>
                  </div>
                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '16px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#15803d', marginBottom: '4px' }}>4. Vận hành RUN</div>
                    <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>Nạp chương trình từ TIA Portal, kiểm tra scan time và interlock dừng khẩn.</div>
                  </div>
                </div>
              </div>
            );
          }

          // Slide N+3: Fault Diagnostics Matrix
          if (currentSlide === chapterSections.length + 3) {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1px solid #cbd5e1', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ width: 4, height: 16, background: '#0072BD', borderRadius: 2 }} />
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase' }}>
                      CHẨN ĐOÁN LỖI & SỰ CỐ
                    </span>
                  </div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.25 }}>
                    Ma Trận Chẩn Đoán Lỗi Phần Cứng & Phần Mềm: {lessonTitle}
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', flex: 1, alignContent: 'center', margin: '14px 0' }}>
                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '16px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#b91c1c', marginBottom: '4px' }}>Rung tiếp điểm DI</div>
                    <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>Tiếp điểm cơ học dao động 2–5 ms khi đóng, tạo xung giả vào bộ đếm tốc độ cao HSC.</p>
                    <div style={{ fontSize: '11.5px', color: '#15803d', fontWeight: 600 }}>Khắc phục: Cài đặt lọc DI 6.4 ms trong TIA Portal.</div>
                  </div>
                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '16px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#b45309', marginBottom: '4px' }}>Vòng lặp mass Analog (AI)</div>
                    <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>Nối vỏ bọc ở cả hai đầu sinh dòng tuần hoàn 50Hz, làm sai lệch giá trị đo &gt;15%.</p>
                    <div style={{ fontSize: '11.5px', color: '#15803d', fontWeight: 600 }}>Khắc phục: Chỉ nối mass vỏ bọc tại tủ điện PLC.</div>
                  </div>
                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '16px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#0072BD', marginBottom: '4px' }}>Quá thời gian quét OB80</div>
                    <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>Vòng lặp tính toán trong OB1 vượt quá 150 ms dẫn đến CPU chuyển STOP khẩn.</p>
                    <div style={{ fontSize: '11.5px', color: '#15803d', fontWeight: 600 }}>Khắc phục: Chuyển tác vụ tính toán vào ngắt OB30.</div>
                  </div>
                </div>
              </div>
            );
          }

          // Slide N+4: Chapter Summary
          if (currentSlide === chapterSections.length + 4) {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1px solid #cbd5e1', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ width: 4, height: 16, background: '#0072BD', borderRadius: 2 }} />
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase' }}>
                      TỔNG KẾT TOÀN BỘ CHƯƠNG
                    </span>
                  </div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.25 }}>
                    Tổng Kết Nội Dung Chương & Hướng Phát Triển: {lessonTitle}
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '22px', flex: 1, alignItems: 'stretch', margin: '14px 0' }}>
                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '20px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#15803d', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                        Các Điểm Cốt Lõi Cần Nhớ:
                      </span>
                      <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '14px', color: '#334155', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <li>Hiểu nguyên lý hoạt động của các đối tượng công nghệ điều khiển PLC.</li>
                        <li>Nắm vững phương pháp bảo vệ chống bão hòa và chuyển đổi không giật bumpless.</li>
                        <li>Tuân thủ tuyệt đối quy định an toàn điện và tiếp địa công nghiệp.</li>
                      </ul>
                    </div>
                  </div>

                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Định Hướng Thực Hành Tiếp Theo:
                    </div>
                    <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.65 }}>
                      Hoàn thiện chương trình PLC trên TIA Portal, kết nối mô phỏng với PLCSIM và kiểm tra đáp ứng quá trình với bộ thông số đã tính toán.
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return null;
        })()}
      </div>

      {/* ── PowerPoint Floating Bottom Navigation Bar (Non-Shifting Absolute Overlay in Fullscreen) ── */}
      <div
        style={{
          position: isFullscreen ? 'absolute' : 'relative',
          bottom: isFullscreen ? '16px' : 'auto',
          left: isFullscreen ? '50%' : 'auto',
          transform: isFullscreen ? 'translateX(-50%)' : 'none',
          zIndex: 60,
          opacity: isFullscreen ? (controlsVisible ? 1 : 0) : 1,
          pointerEvents: isFullscreen && !controlsVisible ? 'none' : 'auto',
          transition: 'opacity 0.25s ease',
          background: isFullscreen ? 'rgba(15, 23, 42, 0.92)' : '#f8fafc',
          backdropFilter: isFullscreen ? 'blur(8px)' : 'none',
          color: isFullscreen ? '#ffffff' : '#0f172a',
          border: isFullscreen ? '1px solid rgba(255,255,255,0.15)' : 'none',
          borderTop: isFullscreen ? 'none' : '1px solid #cbd5e1',
          borderRadius: isFullscreen ? '6px' : '0px',
          padding: isFullscreen ? '8px 16px' : '8px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          boxShadow: isFullscreen ? '0 10px 25px rgba(0,0,0,0.3)' : 'none',
          flexShrink: 0,
        }}
      >
        <button
          onClick={handlePrev}
          disabled={currentSlide === 0}
          style={{
            padding: '5px 12px',
            borderRadius: '4px',
            border: isFullscreen ? '1px solid rgba(255,255,255,0.2)' : '1px solid #cbd5e1',
            background: currentSlide === 0 ? (isFullscreen ? 'rgba(255,255,255,0.05)' : '#f1f5f9') : (isFullscreen ? 'rgba(255,255,255,0.15)' : '#ffffff'),
            color: currentSlide === 0 ? (isFullscreen ? '#64748b' : '#94a3b8') : (isFullscreen ? '#ffffff' : '#0f172a'),
            fontSize: '11.5px',
            fontWeight: 600,
            cursor: currentSlide === 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <IconChevronLeft size={14} />
          <span>Trang trước</span>
        </button>

        {/* Slide Counter & Dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11.5px', fontWeight: 700, fontFamily: 'Consolas, monospace', color: isFullscreen ? '#38bdf8' : '#0072BD' }}>
            {String(currentSlide + 1).padStart(2, '0')} / {String(currentTotalSlides).padStart(2, '0')}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            {Array.from({ length: currentTotalSlides }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                title={`Nhảy đến slide ${idx + 1}`}
                style={{
                  width: idx === currentSlide ? 14 : 4,
                  height: 4,
                  borderRadius: '1px',
                  border: 'none',
                  background: idx === currentSlide ? (isFullscreen ? '#38bdf8' : '#0072BD') : (isFullscreen ? 'rgba(255,255,255,0.3)' : '#cbd5e1'),
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'width 0.15s ease',
                }}
              />
            ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={currentSlide === currentTotalSlides - 1}
          style={{
            padding: '5px 14px',
            borderRadius: '4px',
            border: 'none',
            background: currentSlide === currentTotalSlides - 1 ? (isFullscreen ? 'rgba(255,255,255,0.1)' : '#cbd5e1') : '#0072BD',
            color: '#ffffff',
            fontSize: '11.5px',
            fontWeight: 700,
            cursor: currentSlide === currentTotalSlides - 1 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span>Trang tiếp</span>
          <IconChevronRight size={14} />
        </button>
      </div>

      {/* ── Table of Contents / Outline Drawer ── */}
      {drawerOpen && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '320px',
            height: '100%',
            background: '#ffffff',
            boxShadow: '4px 0 20px rgba(0,0,0,0.12)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid #cbd5e1',
          }}
        >
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc' }}>
            <div>
              <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase' }}>Mục Lục Trình Chiếu</div>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f172a' }}>{currentTopic.title}</div>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', color: '#64748b' }}
            >
              ✕
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
            <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '4px' }}>
              Danh Sách Slide ({TOPIC_SLIDES.length} slide):
            </div>
            {TOPIC_SLIDES.map((ts, idx) => {
              const isActive = currentSlide === ts.id;
              return (
                <button
                  key={ts.id}
                  onClick={() => {
                    setCurrentSlide(ts.id);
                    setDrawerOpen(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '4px',
                    border: isActive ? '1px solid #0072BD' : '1px solid transparent',
                    background: isActive ? '#eff6ff' : 'transparent',
                    color: isActive ? '#0072BD' : '#334155',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '12px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '3px',
                  }}
                >
                  <span style={{
                    width: 20,
                    height: 20,
                    borderRadius: '2px',
                    background: isActive ? '#0072BD' : '#e2e8f0',
                    color: isActive ? '#ffffff' : '#64748b',
                    fontSize: '10.5px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div>{ts.label}</div>
                  </div>
                </button>
              );
            })}

            <div style={{ margin: '14px 0 8px 0', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
              <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '4px' }}>
                Chuyển Chuyên Đề Trong Chương:
              </div>
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
                      padding: '8px 10px',
                      borderRadius: '4px',
                      border: isCurrent ? '1px solid #cbd5e1' : '1px solid transparent',
                      background: isCurrent ? '#f1f5f9' : 'transparent',
                      color: isCurrent ? '#0f172a' : '#475569',
                      fontWeight: isCurrent ? 700 : 500,
                      fontSize: '11.5px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '2px',
                    }}
                  >
                    <span>{idx + 1}.</span>
                    <span style={{ flex: 1 }}>{t.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Speaker Notes Drawer (Ghi chú giảng viên - Key: N) ── */}
      {notesOpen && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '360px',
            height: '100%',
            background: '#ffffff',
            boxShadow: '-4px 0 20px rgba(0,0,0,0.12)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            borderLeft: '1px solid #cbd5e1',
          }}
        >
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc' }}>
            <div>
              <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase' }}>Ghi Chú Giảng Viên</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>Slide {currentSlide + 1}: {currentSlideMeta.label}</div>
            </div>
            <button
              onClick={() => setNotesOpen(false)}
              style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', color: '#64748b' }}
            >
              ✕
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '12px 14px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase', marginBottom: '6px' }}>
                Gợi Ý Giảng Giải (Speaking Cue):
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: '#334155', lineHeight: 1.6 }}>
                {caseStudy?.speakingCue || 'Nhấn mạnh cho sinh viên nguyên lý vật lý của đối tượng điều khiển, liên kết trực tiếp giữa mô hình toán học và phần cứng thực tế.'}
              </p>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '12px 14px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', marginBottom: '6px' }}>
                Lưu Ý Trọng Tâm Lớp Học:
              </div>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12.5px', color: '#475569', lineHeight: 1.55, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>Nhắc lại định luật Kirchhoff và dòng rò trong mạch cách ly quang.</li>
                <li>Phân biệt giữa thời gian trễ phần cứng (hardware delay) và chu kỳ lấy mẫu phần mềm.</li>
                <li>Hướng dẫn sinh viên cách tra cứu Diagnostic Buffer khi CPU báo lỗi STOP.</li>
              </ul>
            </div>

            {caseStudy?.commonPitfall && (
              <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '12px 14px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#b91c1c', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Lỗi Hiện Trường Hay Gặp:
                </div>
                <div style={{ fontSize: '12.5px', color: '#334155', lineHeight: 1.5 }}>
                  {caseStudy.commonPitfall}
                </div>
              </div>
            )}

            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '12px 14px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', marginBottom: '6px' }}>
                Bảng Phím Tắt Trình Chiếu:
              </div>
              <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
                <div>• <strong>Space / →:</strong> Chuyển bước / Slide tiếp</div>
                <div>• <strong>←:</strong> Lùi slide trước</div>
                <div>• <strong>Home / End:</strong> Về slide đầu / cuối</div>
                <div>• <strong>F:</strong> Bật / tắt chế độ toàn màn hình</div>
                <div>• <strong>N:</strong> Ẩn / hiện bảng ghi chú này</div>
                <div>• <strong>M:</strong> Mở mục lục slide</div>
                <div>• <strong>Esc:</strong> Đóng cửa sổ / Thoát toàn màn hình</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Lightbox Zoom Modal ── */}
      {zoomImage && (
        <div
          onClick={() => setZoomImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.85)',
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
              borderRadius: '4px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
              <button
                onClick={() => setZoomImage(null)}
                style={{ background: 'none', border: 'none', fontSize: '14px', cursor: 'pointer', fontWeight: 700, color: '#0f172a' }}
              >
                Đóng (Esc) ✕
              </button>
            </div>
            <img
              src={asset(zoomImage)}
              alt="Sơ đồ kỹ thuật phóng to"
              style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
