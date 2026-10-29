'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { asset } from '@/lib/asset';
import type { TopicContent, Slide as ContentSlide, LessonContentFile, TopicFigure } from '@/types/content';
import { getTopic } from '@/content';
import {
  IconChevronLeft,
  IconChevronRight,
  IconList,
  IconMaximize2,
  IconMinimize2,
} from '@/components/ui/TechnicalIcons';

export interface DeckSlide {
  id: string;
  category: string;
  title: string;
  kind: 'concept' | 'diagram' | 'practice' | 'caseStudy' | 'simulator' | 'quiz';
  points?: string[];
  figure?: TopicFigure;
  explain?: string;
  quizIndex?: number;
  steps?: string[];
}

interface Props {
  lessonSlug: string;
  lessonTitle: string;
  courseCode: string;
  color?: string;
  currentTopicSlug: string;
  topicContent: TopicContent;
  lessonFile?: LessonContentFile;
  topics: { slug: string; title: string; number?: string }[];
  currentIndex: number;
  simulatorNode?: React.ReactNode;
}

export default function TopicSlideDeck({
  lessonSlug,
  lessonTitle,
  courseCode,
  color = '#0072BD',
  currentTopicSlug,
  topicContent,
  lessonFile,
  topics,
  currentIndex,
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

  // ── XÂY DỰNG DANH SÁCH SLIDE ĐỘNG TỪ DỮ LIỆU THỰC ──
  const topicSlides: DeckSlide[] = useMemo(() => {
    const list: DeckSlide[] = [];

    // 1. Nếu topic có slides[] (từ GĐ1b), dùng trực tiếp
    if (topicContent.slides && topicContent.slides.length > 0) {
      topicContent.slides.forEach((sl, idx) => {
        if (sl.kind === 'concept') {
          list.push({
            id: `concept-${idx}`,
            category: 'LÝ THUYẾT CỐT LÕI',
            title: sl.title,
            kind: 'concept',
            points: sl.points,
            figure: sl.figure,
            explain: sl.explain,
          });
        } else if (sl.kind === 'diagram') {
          list.push({
            id: `diagram-${idx}`,
            category: 'SƠ ĐỒ KỸ THUẬT',
            title: sl.title,
            kind: 'diagram',
            figure: sl.figure,
            explain: sl.explain,
          });
        } else if (sl.kind === 'practice') {
          list.push({
            id: `practice-${idx}`,
            category: 'THỰC HÀNH CÔNG NGHIỆP',
            title: sl.title,
            kind: 'practice',
            steps: sl.steps,
            explain: sl.explain,
          });
        } else if (sl.kind === 'quiz') {
          list.push({
            id: `quiz-${idx}`,
            category: 'KIỂM TRA NHANH',
            title: sl.title || 'Kiểm Tra Nhanh Kiến Thức',
            kind: 'quiz',
            quizIndex: sl.questionIndex,
          });
        }
      });
    } else {
      // 2. Tự động dựng từ body nếu chưa có slides[]
      (topicContent.body || []).forEach((sec, idx) => {
        const fig = topicContent.figures && topicContent.figures[idx];
        list.push({
          id: `concept-${idx}`,
          category: 'LÝ THUYẾT CỐT LÕI',
          title: (sec.heading || topicContent.title).replace(/^\d+\.\d+\s*/, ''),
          kind: 'concept',
          points: sec.keyPoints,
          figure: fig,
          explain: sec.text,
        });
      });

      // Figure dư không gắn vào body
      if (topicContent.figures && topicContent.figures.length > (topicContent.body?.length || 0)) {
        for (let i = topicContent.body?.length || 0; i < topicContent.figures.length; i++) {
          const fig = topicContent.figures[i];
          list.push({
            id: `diagram-${i}`,
            category: 'SƠ ĐỒ HỆ THỐNG',
            title: fig.caption,
            kind: 'diagram',
            figure: fig,
          });
        }
      }

      // Quiz slides
      (topicContent.quiz || []).forEach((_, qIdx) => {
        list.push({
          id: `quiz-${qIdx}`,
          category: 'KIỂM TRA NHANH',
          title: 'Kiểm Tra Nhanh Kiến Thức',
          kind: 'quiz',
          quizIndex: qIdx,
        });
      });
    }

    // 3. Slide Case Study (nếu có dữ liệu thực)
    if (topicContent.caseStudy) {
      list.push({
        id: 'case-study',
        category: 'TÌNH HUỐNG HIỆN TRƯỜNG',
        title: topicContent.caseStudy.title,
        kind: 'caseStudy',
        explain: topicContent.caseStudy.context,
      });
    }

    // 4. Slide Simulator (nếu có component mô phỏng)
    if (simulatorNode) {
      list.push({
        id: 'simulator',
        category: 'MÔ PHỎNG TƯƠNG TÁC',
        title: `Mô Phỏng Thực Nghiệm: ${topicContent.title}`,
        kind: 'simulator',
      });
    }

    return list;
  }, [topicContent, simulatorNode]);

  // Danh sách chuyên đề cho Chế độ Toàn chương
  const chapterTopics = useMemo(() => {
    if (!lessonFile) return [];
    return lessonFile.topicOrder.map(slug => getTopic(lessonSlug, slug)).filter(Boolean) as TopicContent[];
  }, [lessonFile, lessonSlug]);

  const totalChapterSlides = chapterTopics.length + 1; // Slide 0: Overview + N topic slides
  const currentTotalSlides = deckMode === 'topic' ? topicSlides.length : totalChapterSlides;

  // Giữ currentSlide trong giới hạn khi đổi topic
  useEffect(() => {
    setCurrentSlide(0);
  }, [currentTopicSlug, deckMode]);

  // ── XỬ LÝ PHÍM TẮT & TOÀN MÀN HÌNH ──
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      slideRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handlePrev = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    } else if (deckMode === 'topic' && currentIndex > 0) {
      router.push(`/lessons/${lessonSlug}/${topics[currentIndex - 1].slug}`);
    }
  }, [currentSlide, deckMode, currentIndex, lessonSlug, topics, router]);

  const handleNext = useCallback(() => {
    if (currentSlide < currentTotalSlides - 1) {
      setCurrentSlide(prev => prev + 1);
    } else if (deckMode === 'topic' && currentIndex < topics.length - 1) {
      router.push(`/lessons/${lessonSlug}/${topics[currentIndex + 1].slug}`);
    }
  }, [currentSlide, currentTotalSlides, deckMode, currentIndex, topics, lessonSlug, router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName) || target?.isContentEditable) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === ' ' && ['BUTTON', 'A', 'SUMMARY'].includes(target?.tagName)) return;

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
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setNotesOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setDrawerOpen(false);
        setZoomImage(null);
        setNotesOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, currentTotalSlides, toggleFullscreen]);

  // Tự động ẩn thanh điều khiển khi fullscreen
  const showControlsTemporarily = useCallback(() => {
    setControlsVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (isFullscreen) {
      hideTimerRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, 3500);
    }
  }, [isFullscreen]);

  useEffect(() => {
    if (!isFullscreen) {
      setControlsVisible(true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    } else {
      showControlsTemporarily();
    }
  }, [isFullscreen, showControlsTemporarily]);

  // Quiz state cho các slide quiz
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<number, boolean>>({});

  const activeSlide = topicSlides[currentSlide];

  return (
    <div
      ref={slideRef}
      onMouseMove={showControlsTemporarily}
      style={{
        width: '100%',
        height: isFullscreen ? '100vh' : 'calc(100vh - 64px)',
        minHeight: '600px',
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Be Vietnam Pro, system-ui, -apple-system, sans-serif',
      }}
    >
      {/* ── 1. THANH CÔNG CỤ TRÊN (ENGINEERING TOOLBAR) ── */}
      <div style={{
        height: '46px',
        borderBottom: '1px solid #cbd5e1',
        background: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 18px',
        fontSize: '13px',
        color: '#334155',
        flexShrink: 0,
        zIndex: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontFamily: 'Consolas, monospace', fontWeight: 700, color: '#0072BD', fontSize: '12px' }}>
            {courseCode}
          </span>
          <span style={{ color: '#94a3b8' }}>/</span>
          <span style={{ fontWeight: 600, color: '#0f172a' }}>
            {lessonTitle}
          </span>
          <span style={{ color: '#94a3b8' }}>—</span>
          <span style={{ color: '#475569' }}>
            {deckMode === 'topic' ? topicContent.title : 'Tổng quan toàn chương'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Chuyển chế độ: Chuyên đề / Toàn chương */}
          <div style={{ display: 'flex', background: '#e2e8f0', borderRadius: '4px', padding: '2px', gap: '2px' }}>
            <button
              onClick={() => { setDeckMode('topic'); setCurrentSlide(0); }}
              style={{
                padding: '4px 10px',
                borderRadius: '3px',
                border: 'none',
                background: deckMode === 'topic' ? '#ffffff' : 'transparent',
                color: deckMode === 'topic' ? '#0072BD' : '#64748b',
                fontWeight: deckMode === 'topic' ? 700 : 500,
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Chuyên đề ({topicSlides.length} slide)
            </button>
            <button
              onClick={() => { setDeckMode('chapter'); setCurrentSlide(0); }}
              style={{
                padding: '4px 10px',
                borderRadius: '3px',
                border: 'none',
                background: deckMode === 'chapter' ? '#ffffff' : 'transparent',
                color: deckMode === 'chapter' ? '#0072BD' : '#64748b',
                fontWeight: deckMode === 'chapter' ? 700 : 500,
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Toàn chương ({totalChapterSlides} slide)
            </button>
          </div>

          <button
            onClick={() => setNotesOpen(prev => !prev)}
            style={{
              padding: '4px 10px',
              borderRadius: '3px',
              border: '1px solid #cbd5e1',
              background: notesOpen ? '#eff6ff' : '#ffffff',
              color: notesOpen ? '#0072BD' : '#475569',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            title="Bật/tắt ghi chú giảng viên (Phím N)"
          >
            Ghi chú (N)
          </button>

          <button
            onClick={() => setDrawerOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              borderRadius: '3px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#475569',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <IconList size={14} />
            Mục lục
          </button>

          <button
            onClick={toggleFullscreen}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: '3px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#475569',
              cursor: 'pointer',
            }}
            title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình (F)'}
          >
            {isFullscreen ? <IconMinimize2 size={14} /> : <IconMaximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* ── 2. KHÔNG GIAN NỘI DUNG SLIDE (16:9 VIEWPORT CANVAS) ── */}
      <div style={{
        flex: 1,
        padding: isFullscreen ? '28px 48px 72px 48px' : '20px 32px 64px 32px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxSizing: 'border-box',
      }}>
        {/* A. CHẾ ĐỘ CHUYÊN ĐỀ (TOPIC SLIDES) */}
        {deckMode === 'topic' && activeSlide && (() => {
          // Slide 1: Concept / Lý thuyết cốt lõi
          if (activeSlide.kind === 'concept') {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1px solid #cbd5e1', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ width: 4, height: 16, background: color, borderRadius: 2 }} />
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color, textTransform: 'uppercase' }}>
                      {activeSlide.category}
                    </span>
                  </div>
                  <h2 style={{ fontSize: isFullscreen ? '26px' : '23px', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.25 }}>
                    {activeSlide.title}
                  </h2>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: activeSlide.figure ? '1.15fr 1fr' : (activeSlide.points?.length ? '1.1fr 1fr' : '1fr'),
                  gap: '22px',
                  flex: 1,
                  alignItems: 'stretch',
                  margin: '14px 0',
                  minHeight: 0,
                }}>
                  {/* Left Column: Text & Points */}
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
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                        Cơ Sở Lý Thuyết & Luồng Xử Lý:
                      </span>
                      <p style={{ margin: 0, fontSize: '15.5px', color: '#1e293b', lineHeight: 1.65 }}>
                        {activeSlide.explain || topicContent.summary}
                      </p>
                    </div>

                    {activeSlide.points && activeSlide.points.length > 0 && (
                      <div style={{ marginTop: '14px', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                          Điểm Kỹ Thuật Then Chốt:
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          {activeSlide.points.slice(0, 4).map((pt, pIdx) => (
                            <div key={pIdx} style={{ fontSize: '13px', color: '#334155', display: 'flex', gap: '6px', lineHeight: 1.45 }}>
                              <span style={{ color, fontWeight: 700 }}>•</span>
                              <span>{pt}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Figure or Cards */}
                  {activeSlide.figure ? (
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
                        onClick={() => setZoomImage(activeSlide.figure!.src)}
                        style={{ width: '100%', height: '88%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-in', background: '#ffffff', borderRadius: '4px', border: '1px solid #e2e8f0', overflow: 'hidden' }}
                        title="Nhấp để phóng to toàn màn hình sơ đồ"
                      >
                        <img
                          src={asset(activeSlide.figure.src)}
                          alt={activeSlide.figure.alt || activeSlide.figure.caption}
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                      </div>
                      <p style={{ fontSize: '12px', color: '#475569', marginTop: '8px', textAlign: 'center', lineHeight: 1.35, fontWeight: 500, margin: '8px 0 0 0' }}>
                        {activeSlide.figure.caption}
                      </p>
                    </div>
                  ) : (
                    activeSlide.points && activeSlide.points.length > 0 && (
                      <div style={{
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '4px',
                        padding: '18px 20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                          Thông Số & Tiêu Chuẩn Thực Thi:
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {activeSlide.points.map((pt, ptIdx) => {
                            const parts = pt.split(':');
                            const ptTitle = parts[0];
                            const ptDesc = parts.slice(1).join(':').trim();
                            return (
                              <div key={ptIdx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '10px 12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                                  <span style={{ width: 22, height: 22, borderRadius: '2px', background: color, color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>
                                    {String(ptIdx + 1).padStart(2, '0')}
                                  </span>
                                  <strong style={{ fontSize: '13.5px', color: '#0f172a' }}>{ptTitle}</strong>
                                </div>
                                {ptDesc && (
                                  <div style={{ fontSize: '12.5px', color: '#334155', paddingLeft: '30px', lineHeight: 1.5 }}>
                                    {ptDesc}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            );
          }

          // Slide 2: Diagram / Sơ đồ kỹ thuật độc lập
          if (activeSlide.kind === 'diagram') {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1px solid #cbd5e1', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ width: 4, height: 16, background: color, borderRadius: 2 }} />
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color, textTransform: 'uppercase' }}>
                      {activeSlide.category}
                    </span>
                  </div>
                  <h2 style={{ fontSize: isFullscreen ? '26px' : '23px', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.25 }}>
                    {activeSlide.title}
                  </h2>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '14px 0', minHeight: 0 }}>
                  {activeSlide.figure && (
                    <div
                      onClick={() => setZoomImage(activeSlide.figure!.src)}
                      style={{ width: '100%', height: '88%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-in', background: '#f8fafc', borderRadius: '4px', border: '1px solid #cbd5e1', padding: '16px', overflow: 'hidden' }}
                      title="Nhấp để phóng to toàn màn hình"
                    >
                      <img
                        src={asset(activeSlide.figure.src)}
                        alt={activeSlide.figure.alt || activeSlide.figure.caption}
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      />
                    </div>
                  )}
                  {activeSlide.figure && (
                    <p style={{ fontSize: '13px', color: '#475569', marginTop: '10px', textAlign: 'center', lineHeight: 1.4, fontWeight: 500 }}>
                      {activeSlide.figure.caption}
                    </p>
                  )}
                </div>
              </div>
            );
          }

          // Slide 3: Case Study hiện trường
          if (activeSlide.kind === 'caseStudy' && topicContent.caseStudy) {
            const cs = topicContent.caseStudy;
            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1px solid #cbd5e1', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ width: 4, height: 16, background: color, borderRadius: 2 }} />
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color, textTransform: 'uppercase' }}>
                      {activeSlide.category}
                    </span>
                  </div>
                  <h2 style={{ fontSize: isFullscreen ? '26px' : '23px', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.25 }}>
                    {cs.title}
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '22px', flex: 1, alignItems: 'stretch', margin: '14px 0', minHeight: 0 }}>
                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '20px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                        Bối Cảnh Nhà Máy & Ứng Dụng:
                      </span>
                      <p style={{ margin: 0, fontSize: '15px', color: '#1e293b', lineHeight: 1.65 }}>
                        {cs.context}
                      </p>
                    </div>

                    {cs.pitfall && (
                      <div style={{ marginTop: '14px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '12px 14px', fontSize: '13px', color: '#475569' }}>
                        <strong style={{ color: '#0f172a' }}>Lưu ý vận hành:</strong> {cs.pitfall}
                      </div>
                    )}
                  </div>

                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                        Phần Cứng & Giao Tiếp Triển Khai:
                      </span>
                      {cs.hardware && (
                        <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#334155', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {cs.hardware.map((hw, hIdx) => (
                            <li key={hIdx}>{hw}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Slide 4: Bàn mô phỏng thực nghiệm
          if (activeSlide.kind === 'simulator') {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1px solid #cbd5e1', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ width: 4, height: 16, background: color, borderRadius: 2 }} />
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color, textTransform: 'uppercase' }}>
                      {activeSlide.category}
                    </span>
                  </div>
                  <h2 style={{ fontSize: isFullscreen ? '26px' : '23px', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.25 }}>
                    {activeSlide.title}
                  </h2>
                </div>

                <div style={{ width: '100%', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '10px 0' }}>
                  <div style={{ width: '100%', maxHeight: '100%' }}>
                    {simulatorNode}
                  </div>
                </div>
              </div>
            );
          }

          // Slide 5: Kiểm tra nhanh (Quiz)
          if (activeSlide.kind === 'quiz' && topicContent.quiz && activeSlide.quizIndex !== undefined) {
            const q = topicContent.quiz[activeSlide.quizIndex];
            if (!q) return null;

            const qIdx = activeSlide.quizIndex;
            const userChoice = quizAnswers[qIdx];
            const isSubmitted = quizSubmitted[qIdx];
            const isCorrect = userChoice === q.answer;

            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1px solid #cbd5e1', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ width: 4, height: 16, background: color, borderRadius: 2 }} />
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color, textTransform: 'uppercase' }}>
                      {activeSlide.category} (CÂU {qIdx + 1}/{topicContent.quiz.length})
                    </span>
                  </div>
                  <h2 style={{ fontSize: isFullscreen ? '26px' : '23px', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.25 }}>
                    {q.q}
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '22px', flex: 1, alignItems: 'stretch', margin: '14px 0', minHeight: 0 }}>
                  {/* Left: Options */}
                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '20px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px' }}>
                    {q.options.map((opt, oIdx) => {
                      const isSelected = userChoice === oIdx;
                      const isAns = oIdx === q.answer;

                      let bg = '#ffffff';
                      let bColor = '#cbd5e1';
                      let txtColor = '#1e293b';

                      if (isSubmitted) {
                        if (isAns) {
                          bg = '#f0fdf4';
                          bColor = '#16a34a';
                          txtColor = '#15803d';
                        } else if (isSelected && !isCorrect) {
                          bg = '#fef2f2';
                          bColor = '#dc2626';
                          txtColor = '#b91c1c';
                        }
                      } else if (isSelected) {
                        bg = `${color}15`;
                        bColor = color;
                        txtColor = color;
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => {
                            if (!isSubmitted) {
                              setQuizAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
                            }
                          }}
                          disabled={isSubmitted}
                          style={{
                            textAlign: 'left',
                            padding: '12px 16px',
                            borderRadius: '4px',
                            border: `1px solid ${bColor}`,
                            background: bg,
                            color: txtColor,
                            fontSize: '14px',
                            cursor: isSubmitted ? 'default' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <span style={{
                            width: 24,
                            height: 24,
                            borderRadius: '2px',
                            border: `1px solid ${isSelected ? color : '#cbd5e1'}`,
                            background: isSelected ? color : '#ffffff',
                            color: isSelected ? '#ffffff' : '#64748b',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: 700,
                            flexShrink: 0,
                          }}>
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span style={{ fontWeight: isSelected ? 600 : 400 }}>{opt}</span>
                        </button>
                      );
                    })}

                    {!isSubmitted && (
                      <button
                        onClick={() => {
                          if (userChoice !== undefined) {
                            setQuizSubmitted(prev => ({ ...prev, [qIdx]: true }));
                          }
                        }}
                        disabled={userChoice === undefined}
                        style={{
                          marginTop: '10px',
                          padding: '10px 20px',
                          borderRadius: '3px',
                          border: 'none',
                          background: userChoice !== undefined ? color : '#cbd5e1',
                          color: '#ffffff',
                          fontSize: '13px',
                          fontWeight: 700,
                          cursor: userChoice !== undefined ? 'pointer' : 'not-allowed',
                          alignSelf: 'flex-start',
                        }}
                      >
                        Xác nhận đáp án
                      </button>
                    )}
                  </div>

                  {/* Right: Explanation */}
                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '20px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    {isSubmitted ? (
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: isCorrect ? '#16a34a' : '#dc2626', marginBottom: '8px' }}>
                          {isCorrect ? '✓ Đáp án chính xác!' : '✗ Chưa chính xác!'}
                        </div>
                        <p style={{ fontSize: '14px', color: '#334155', lineHeight: 1.6, margin: 0 }}>
                          <strong>Giải thích kỹ thuật:</strong> {q.explain}
                        </p>
                      </div>
                    ) : (
                      <div style={{ color: '#64748b', fontSize: '13.5px', lineHeight: 1.6 }}>
                        Chọn một phương án bên trái và bấm <strong>Xác nhận đáp án</strong> để kiểm tra mức độ thấu hiểu của bạn về chuyên đề này.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          return null;
        })()}

        {/* B. CHẾ ĐỘ TOÀN CHƯƠNG (CHAPTER DECK) */}
        {deckMode === 'chapter' && (() => {
          // Slide 0: Overview & CLO
          if (currentSlide === 0) {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1px solid #cbd5e1', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ width: 4, height: 16, background: color, borderRadius: 2 }} />
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color, textTransform: 'uppercase' }}>
                      TỔNG QUAN TOÀN CHƯƠNG · MÃ MÔN {courseCode}
                    </span>
                  </div>
                  <h1 style={{ fontSize: isFullscreen ? '28px' : '25px', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.25 }}>
                    {lessonTitle}
                  </h1>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '22px', flex: 1, alignItems: 'stretch', margin: '14px 0', minHeight: 0 }}>
                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '20px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color, textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                        Mục Tiêu Trọng Tâm Toàn Bài:
                      </span>
                      <p style={{ margin: 0, fontSize: '15.5px', color: '#1e293b', lineHeight: 1.65 }}>
                        {lessonFile?.overview || 'Bài học cung cấp kiến thức nền tảng và phương pháp thực hành chuyên sâu về kỹ thuật tự động hóa với PLC.'}
                      </p>
                    </div>
                  </div>

                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', marginBottom: '10px' }}>
                      Chuẩn Đầu Ra Môn Học (CLO):
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13.5px', color: '#334155', lineHeight: 1.65, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {(lessonFile?.objectives || [
                        'Làm chủ kiến trúc phần cứng và chu trình quét của PLC S7-1200.',
                        'Thiết kế sơ đồ đấu nối cách ly I/O chuẩn công nghiệp.',
                        'Triển khai các khối hàm điều khiển thời gian thực qua TIA Portal.',
                      ]).map((obj, oIdx) => (
                        <li key={oIdx}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          }

          // Slide 1..N: Từng chuyên đề trong chương
          const topicIdx = currentSlide - 1;
          const chTopic = chapterTopics[topicIdx];
          if (!chTopic) return null;

          const chFig = chTopic.figures && chTopic.figures[0];
          const chBody = chTopic.body && chTopic.body[0];

          return (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <div style={{ borderBottom: '1px solid #cbd5e1', paddingBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <span style={{ width: 4, height: 16, background: color, borderRadius: 2 }} />
                  <span style={{ fontSize: '11.5px', fontWeight: 700, color, textTransform: 'uppercase' }}>
                    NỘI DUNG CHUYÊN ĐỀ {String(currentSlide).padStart(2, '0')} / {String(chapterTopics.length).padStart(2, '0')}
                  </span>
                </div>
                <h2 style={{ fontSize: isFullscreen ? '26px' : '23px', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.25 }}>
                  {chTopic.title}
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: chFig ? '1.15fr 1fr' : '1fr', gap: '22px', flex: 1, alignItems: 'stretch', margin: '14px 0', minHeight: 0 }}>
                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '18px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                      Khái Niệm Cốt Lõi & Nguyên Lý Hoạt Động:
                    </span>
                    <p style={{ margin: 0, fontSize: '15.5px', color: '#1e293b', lineHeight: 1.65 }}>
                      {chBody?.text || chTopic.summary}
                    </p>
                  </div>

                  {chBody?.keyPoints && chBody.keyPoints.length > 0 && (
                    <div style={{ marginTop: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                        Điểm Then Chốt:
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {chBody.keyPoints.slice(0, 3).map((kp, kIdx) => (
                          <div key={kIdx} style={{ fontSize: '13px', color: '#334155', display: 'flex', gap: '6px' }}>
                            <span style={{ color, fontWeight: 700 }}>•</span>
                            <span>{kp}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {chFig && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '14px', height: '100%' }}>
                    <div
                      onClick={() => setZoomImage(chFig.src)}
                      style={{ width: '100%', height: '88%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-in', background: '#ffffff', borderRadius: '4px', border: '1px solid #e2e8f0', overflow: 'hidden' }}
                      title="Nhấp để phóng to toàn màn hình"
                    >
                      <img
                        src={asset(chFig.src)}
                        alt={chFig.alt || chFig.caption}
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      />
                    </div>
                    <p style={{ fontSize: '12px', color: '#475569', marginTop: '8px', textAlign: 'center', lineHeight: 1.35, fontWeight: 500, margin: '8px 0 0 0' }}>
                      {chFig.caption}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </div>

      {/* ── 3. THANH ĐIỀU HƯỚNG DƯỚI ĐÁY (PERSISTENT BOTTOM NAVIGATION) ── */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '48px',
        background: '#f8fafc',
        borderTop: '1px solid #cbd5e1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        opacity: controlsVisible ? 1 : 0,
        transition: 'opacity 0.25s ease',
        zIndex: 30,
      }}>
        <button
          onClick={handlePrev}
          disabled={currentSlide === 0 && (deckMode === 'chapter' || currentIndex === 0)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '3px',
            border: '1px solid #cbd5e1',
            background: '#ffffff',
            color: currentSlide === 0 && (deckMode === 'chapter' || currentIndex === 0) ? '#94a3b8' : '#0f172a',
            fontSize: '12.5px',
            fontWeight: 600,
            cursor: currentSlide === 0 && (deckMode === 'chapter' || currentIndex === 0) ? 'not-allowed' : 'pointer',
          }}
        >
          <IconChevronLeft size={16} />
          Trang trước
        </button>

        {/* Số slide / tiến độ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Consolas, monospace', fontSize: '12px', color: '#475569' }}>
          <span style={{ fontWeight: 700, color: '#0f172a' }}>
            {String(currentSlide + 1).padStart(2, '0')}
          </span>
          <span>/</span>
          <span>{String(currentTotalSlides).padStart(2, '0')}</span>

          <div style={{ display: 'flex', gap: '4px', marginLeft: '8px' }}>
            {Array.from({ length: currentTotalSlides }).map((_, i) => (
              <span
                key={i}
                onClick={() => setCurrentSlide(i)}
                style={{
                  width: i === currentSlide ? 16 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: i === currentSlide ? color : '#cbd5e1',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              />
            ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={currentSlide === currentTotalSlides - 1 && (deckMode === 'chapter' || currentIndex === topics.length - 1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '3px',
            border: 'none',
            background: currentSlide === currentTotalSlides - 1 && (deckMode === 'chapter' || currentIndex === topics.length - 1) ? '#cbd5e1' : color,
            color: '#ffffff',
            fontSize: '12.5px',
            fontWeight: 700,
            cursor: currentSlide === currentTotalSlides - 1 && (deckMode === 'chapter' || currentIndex === topics.length - 1) ? 'not-allowed' : 'pointer',
          }}
        >
          Trang tiếp
          <IconChevronRight size={16} />
        </button>
      </div>

      {/* ── 4. DRAWER MỤC LỤC NHẢY NHANH ── */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.4)',
            zIndex: 100,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '320px',
              height: '100%',
              background: '#ffffff',
              boxShadow: '-4px 0 16px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              padding: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #cbd5e1', paddingBottom: '12px', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                {deckMode === 'topic' ? 'Mục Lục Slide Chuyên Đề' : 'Mục Lục Toàn Chương'}
              </h3>
              <button
                onClick={() => setDrawerOpen(false)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '16px', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {deckMode === 'topic' ? (
                topicSlides.map((sl, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setCurrentSlide(idx); setDrawerOpen(false); }}
                    style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      borderRadius: '3px',
                      border: `1px solid ${currentSlide === idx ? color : '#e2e8f0'}`,
                      background: currentSlide === idx ? `${color}10` : '#f8fafc',
                      color: currentSlide === idx ? color : '#334155',
                      fontSize: '12.5px',
                      fontWeight: currentSlide === idx ? 700 : 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span style={{ fontFamily: 'Consolas, monospace', fontSize: '11px', color: '#94a3b8' }}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {sl.title}
                    </span>
                  </button>
                ))
              ) : (
                <>
                  <button
                    onClick={() => { setCurrentSlide(0); setDrawerOpen(false); }}
                    style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      borderRadius: '3px',
                      border: `1px solid ${currentSlide === 0 ? color : '#e2e8f0'}`,
                      background: currentSlide === 0 ? `${color}10` : '#f8fafc',
                      color: currentSlide === 0 ? color : '#334155',
                      fontSize: '12.5px',
                      fontWeight: currentSlide === 0 ? 700 : 500,
                      cursor: 'pointer',
                    }}
                  >
                    00. Tổng quan toàn bài & CLO
                  </button>
                  {chapterTopics.map((ct, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setCurrentSlide(idx + 1); setDrawerOpen(false); }}
                      style={{
                        textAlign: 'left',
                        padding: '8px 12px',
                        borderRadius: '3px',
                        border: `1px solid ${currentSlide === idx + 1 ? color : '#e2e8f0'}`,
                        background: currentSlide === idx + 1 ? `${color}10` : '#f8fafc',
                        color: currentSlide === idx + 1 ? color : '#334155',
                        fontSize: '12.5px',
                        fontWeight: currentSlide === idx + 1 ? 700 : 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span style={{ fontFamily: 'Consolas, monospace', fontSize: '11px', color: '#94a3b8' }}>
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {ct.title}
                      </span>
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 5. DRAWER GHI CHÚ GIẢNG VIÊN (SPEAKER NOTES) ── */}
      {notesOpen && (
        <div style={{
          position: 'absolute',
          bottom: '48px',
          left: 0,
          right: 0,
          maxHeight: '180px',
          background: '#ffffff',
          borderTop: '2px solid #0072BD',
          boxShadow: '0 -4px 16px rgba(0,0,0,0.08)',
          padding: '16px 24px',
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase' }}>
              Ghi Chú Giảng Dạy & Lời Thoại Thuyết Minh ({topicContent.narration?.durationSec || 30}s)
            </span>
            <button
              onClick={() => setNotesOpen(false)}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', color: '#64748b' }}
            >
              ✕
            </button>
          </div>
          <p style={{ margin: 0, fontSize: '13.5px', color: '#334155', lineHeight: 1.6 }}>
            {topicContent.narration?.vi || topicContent.summary || 'Trình bày theo thứ tự: Đặt vấn đề thực tế ➔ Phân tích sơ đồ ➔ Rút ra nguyên lý và kiểm tra nhanh.'}
          </p>
        </div>
      )}

      {/* ── 6. MODAL ZOOM PHÓNG TO SƠ ĐỒ ── */}
      {zoomImage && (
        <div
          onClick={() => setZoomImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.85)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '30px',
            cursor: 'zoom-out',
          }}
        >
          <img
            src={asset(zoomImage)}
            alt="Sơ đồ chi tiết"
            style={{ maxWidth: '95%', maxHeight: '95%', objectFit: 'contain', borderRadius: '4px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
          />
        </div>
      )}
    </div>
  );
}
