'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { asset } from '@/lib/asset';
import type { TopicContent, LessonContentFile, TopicFigure } from '@/types/content';
import { getTopic, topicNumber } from '@/content';
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
  kind: 'topicIntro' | 'concept' | 'diagram' | 'practice' | 'caseStudy' | 'simulator' | 'quiz';
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

/**
 * Helper to build the slide deck for any topic in the lesson,
 * always starting with the auto-generated Topic Intro slide:
 * "x.y <Topic title>" + up to 3 objectives (if present).
 */
function buildSlidesForTopic(
  tc: TopicContent,
  secNum: string,
  includeSimulator: boolean
): DeckSlide[] {
  const list: DeckSlide[] = [];
  const cleanTopicTitle = tc.title.replace(/^\d+\.\d+\s*/, '');

  // Auto-generated Topic Intro slide at index 0 of every topic
  list.push({
    id: `topic-intro-${tc.slug}`,
    category: 'TOPIC INTRODUCTION',
    title: `${secNum} ${cleanTopicTitle}`,
    kind: 'topicIntro',
    points: tc.objectives && tc.objectives.length > 0 ? tc.objectives.slice(0, 3) : undefined,
    explain: tc.summary,
  });

  // 1. If topic has explicit slides[], use them directly
  if (tc.slides && tc.slides.length > 0) {
    tc.slides.forEach((sl, idx) => {
      if (sl.kind === 'concept') {
        list.push({
          id: `concept-${idx}`,
          category: 'CORE CONCEPT',
          title: sl.title,
          kind: 'concept',
          points: sl.points,
          figure: sl.figure,
          explain: sl.explain,
        });
      } else if (sl.kind === 'diagram') {
        list.push({
          id: `diagram-${idx}`,
          category: 'TECHNICAL DIAGRAM',
          title: sl.title,
          kind: 'diagram',
          figure: sl.figure,
          explain: sl.explain,
        });
      } else if (sl.kind === 'practice') {
        list.push({
          id: `practice-${idx}`,
          category: 'INDUSTRIAL PRACTICE',
          title: sl.title,
          kind: 'practice',
          steps: sl.steps,
          explain: sl.explain,
        });
      } else if (sl.kind === 'quiz') {
        const cleanTitle =
          !sl.title || sl.title === 'Kiểm tra nhanh'
            ? 'Quick Check'
            : sl.title;
        list.push({
          id: `quiz-${idx}`,
          category: 'QUICK CHECK',
          title: cleanTitle,
          kind: 'quiz',
          quizIndex: sl.questionIndex,
        });
      }
    });
  } else {
    // 2. Otherwise build slides from body + figures + quiz
    (tc.body || []).forEach((sec, idx) => {
      const fig = tc.figures && tc.figures[idx];
      list.push({
        id: `concept-${idx}`,
        category: 'CORE CONCEPT',
        title: (sec.heading || tc.title).replace(/^\d+\.\d+\s*/, ''),
        kind: 'concept',
        points: sec.keyPoints,
        figure: fig,
        explain: sec.text,
      });
    });

    // Extra figures not bound to a body section
    if (tc.figures && tc.figures.length > (tc.body?.length || 0)) {
      for (let i = tc.body?.length || 0; i < tc.figures.length; i++) {
        const fig = tc.figures[i];
        list.push({
          id: `diagram-${i}`,
          category: 'SYSTEM DIAGRAM',
          title: fig.caption,
          kind: 'diagram',
          figure: fig,
        });
      }
    }

    // Quiz slides
    (tc.quiz || []).forEach((_, qIdx) => {
      list.push({
        id: `quiz-${qIdx}`,
        category: 'QUICK CHECK',
        title: 'Quick Check',
        kind: 'quiz',
        quizIndex: qIdx,
      });
    });
  }

  // 3. Field Case Study slide (only if present in data)
  if (tc.caseStudy) {
    list.push({
      id: 'case-study',
      category: 'FIELD CASE STUDY',
      title: tc.caseStudy.title,
      kind: 'caseStudy',
      explain: tc.caseStudy.context,
    });
  }

  // 4. Interactive Simulator slide (only if simulator component exists)
  if (includeSimulator) {
    list.push({
      id: 'simulator',
      category: 'INTERACTIVE SIMULATOR',
      title: `Interactive Simulation: ${cleanTopicTitle}`,
      kind: 'simulator',
    });
  }

  return list;
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
  const [diagramNaturalSizes, setDiagramNaturalSizes] = useState<Record<string, { w: number; h: number }>>({});
  const [jumpBuffer, setJumpBuffer] = useState('');
  const jumpTimerRef = useRef<NodeJS.Timeout | null>(null);

  const lessonNum = useMemo(() => {
    if (lessonFile?.id) return lessonFile.id;
    const m = lessonSlug.match(/^0*(\d+)/);
    return m ? parseInt(m[1], 10) : 1;
  }, [lessonFile, lessonSlug]);

  const currentSecNum = useMemo(() => {
    if (lessonFile) {
      const n = topicNumber(lessonFile, currentTopicSlug);
      if (n) return n;
    }
    return `${lessonNum}.${currentIndex + 1}`;
  }, [lessonFile, currentTopicSlug, lessonNum, currentIndex]);

  const cleanCurrentTopicTitle = useMemo(
    () => topicContent.title.replace(/^\d+\.\d+\s*/, ''),
    [topicContent.title]
  );

  // Build slides for the active topic
  const topicSlides: DeckSlide[] = useMemo(
    () => buildSlidesForTopic(topicContent, currentSecNum, Boolean(simulatorNode)),
    [topicContent, currentSecNum, simulatorNode]
  );

  // Topics list and per-topic slide counts/offsets across the entire lesson
  const chapterTopicsMeta = useMemo(() => {
    const order = lessonFile?.topicOrder || topics.map(t => t.slug);
    const rawItems = order
      .map((slug, idx) => {
        const tc = slug === currentTopicSlug ? topicContent : getTopic(lessonSlug, slug);
        if (!tc) return null;
        const secNum = (lessonFile && topicNumber(lessonFile, slug)) || `${lessonNum}.${idx + 1}`;
        const cleanTitle = tc.title.replace(/^\d+\.\d+\s*/, '');
        const slides =
          slug === currentTopicSlug
            ? topicSlides
            : buildSlidesForTopic(tc, secNum, Boolean(simulatorNode));
        return {
          idx,
          slug,
          secNum,
          cleanTitle,
          topicContent: tc,
          slideCount: slides.length,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    return rawItems.map((item, i) => {
      const startSlide = rawItems.slice(0, i).reduce((sum, prev) => sum + prev.slideCount, 1);
      return {
        ...item,
        startSlide,
        endSlide: startSlide + item.slideCount - 1,
      };
    });
  }, [lessonFile, topics, currentTopicSlug, topicContent, lessonSlug, lessonNum, topicSlides, simulatorNode]);

  // Total slides across the entire lesson (K)
  const totalLessonSlidesK = useMemo(
    () => chapterTopicsMeta.reduce((sum, item) => sum + item.slideCount, 0),
    [chapterTopicsMeta]
  );

  const currentTopicMeta = useMemo(
    () => chapterTopicsMeta.find(m => m.slug === currentTopicSlug) || chapterTopicsMeta[currentIndex] || chapterTopicsMeta[0],
    [chapterTopicsMeta, currentTopicSlug, currentIndex]
  );

  const totalChapterSlides = chapterTopicsMeta.length + 1; // Slide 0: TOC + N topic slides
  const currentTotalSlides = deckMode === 'topic' ? topicSlides.length : totalChapterSlides;

  // Global slide index k / K and section indicator x.y · i/n
  const activeChapterTopicMeta =
    deckMode === 'chapter' && currentSlide > 0
      ? chapterTopicsMeta[currentSlide - 1]
      : currentTopicMeta;

  const headerSecNum = activeChapterTopicMeta?.secNum || currentSecNum;
  const headerTopicTitle = activeChapterTopicMeta?.cleanTitle || cleanCurrentTopicTitle;

  const footerSectionTag =
    deckMode === 'topic'
      ? `${currentSecNum} · ${currentSlide + 1}/${topicSlides.length}`
      : currentSlide === 0
      ? `${lessonNum}.0 · TOC`
      : `${headerSecNum} · 1/${activeChapterTopicMeta?.slideCount || 1}`;

  const globalSlideK =
    deckMode === 'topic'
      ? (currentTopicMeta ? currentTopicMeta.startSlide + currentSlide : currentSlide + 1)
      : currentSlide === 0
      ? 1
      : activeChapterTopicMeta?.startSlide || currentSlide;

  // Reset currentSlide when topic or mode changes during render
  const slideResetKey = `${currentTopicSlug}|${deckMode}`;
  const [prevSlideResetKey, setPrevSlideResetKey] = useState(slideResetKey);
  if (prevSlideResetKey !== slideResetKey) {
    setPrevSlideResetKey(slideResetKey);
    setCurrentSlide(0);
  }

  // Navigate to a specific topic (or jump directly to its start)
  const handleSelectTopic = useCallback(
    (targetSlug: string) => {
      if (targetSlug === currentTopicSlug) {
        setDeckMode('topic');
        setCurrentSlide(0);
      } else {
        router.push(`/lessons/${lessonSlug}/${targetSlug}`);
      }
    },
    [currentTopicSlug, lessonSlug, router]
  );

  // Jump to 1-based slide number (supports both local slide and global lesson slide K)
  const handleJumpToNumber = useCallback(
    (num: number) => {
      if (!Number.isFinite(num) || num < 1) return;
      if (deckMode === 'chapter') {
        // In chapter mode, check if num matches a topic's startSlide first, otherwise clamp to chapter slides
        const byStart = chapterTopicsMeta.find(m => m.startSlide === num);
        if (byStart) {
          handleSelectTopic(byStart.slug);
          return;
        }
        const target = Math.min(Math.max(1, num), currentTotalSlides) - 1;
        setCurrentSlide(target);
        return;
      }

      // In topic mode: if num <= topicSlides.length, jump within current topic
      if (num <= topicSlides.length) {
        setCurrentSlide(num - 1);
        return;
      }

      // If num is a global slide index k (up to K), locate the corresponding topic
      const targetTopic = chapterTopicsMeta.find(m => num >= m.startSlide && num <= m.endSlide);
      if (targetTopic) {
        if (targetTopic.slug === currentTopicSlug) {
          setCurrentSlide(num - targetTopic.startSlide);
        } else {
          router.push(`/lessons/${lessonSlug}/${targetTopic.slug}`);
        }
      } else {
        setCurrentSlide(topicSlides.length - 1);
      }
    },
    [deckMode, chapterTopicsMeta, currentTotalSlides, topicSlides.length, handleSelectTopic, currentTopicSlug, router, lessonSlug]
  );

  // Keyboard shortcuts & Fullscreen
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => {
      const next = !prev;
      if (next && !document.fullscreenElement) {
        slideRef.current?.requestFullscreen().catch(() => {});
      } else if (!next && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      return next;
    });
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

      // Numeric buffer + Enter to jump to page
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        setJumpBuffer(prev => {
          const next = (prev + e.key).slice(0, 3);
          return next;
        });
        if (jumpTimerRef.current) clearTimeout(jumpTimerRef.current);
        jumpTimerRef.current = setTimeout(() => {
          setJumpBuffer('');
        }, 2500);
        return;
      }

      if (e.key === 'Backspace' && jumpBuffer.length > 0) {
        e.preventDefault();
        setJumpBuffer(prev => prev.slice(0, -1));
        return;
      }

      if (e.key === 'Enter' && jumpBuffer.length > 0) {
        e.preventDefault();
        const pageNum = parseInt(jumpBuffer, 10);
        setJumpBuffer('');
        if (jumpTimerRef.current) clearTimeout(jumpTimerRef.current);
        handleJumpToNumber(pageNum);
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
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setNotesOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setIsFullscreen(false);
        setJumpBuffer('');
        setDrawerOpen(false);
        setZoomImage(null);
        setNotesOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, currentTotalSlides, toggleFullscreen, jumpBuffer, handleJumpToNumber]);

  // Quiz state for quiz slides
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<number, boolean>>({});

  const activeSlide = topicSlides[currentSlide];

  // Reusable Slide Top Line: "Lesson N › x.y <Topic title>" + Category badge + Slide Title
  const renderSlideHeader = (categoryLabel: string, slideTitle: string) => (
    <div style={{ borderBottom: '1px solid #cbd5e1', paddingBottom: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '3px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: 4, height: 16, background: color, borderRadius: 2 }} />
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
            Lesson {lessonNum} › {headerSecNum} {headerTopicTitle}
          </span>
        </div>
        <span style={{ fontSize: '11px', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {categoryLabel}
        </span>
      </div>
      <h2 style={{ fontSize: isFullscreen ? '26px' : '23px', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.25 }}>
        {slideTitle}
      </h2>
    </div>
  );

  return (
    <div
      ref={slideRef}
      style={{
        width: '100%',
        height: isFullscreen ? '100vh' : 'calc(100vh - 64px)',
        minHeight: '600px',
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        position: isFullscreen ? 'fixed' : 'relative',
        inset: isFullscreen ? 0 : undefined,
        zIndex: isFullscreen ? 9999 : undefined,
        overflow: 'hidden',
        fontFamily: 'Be Vietnam Pro, system-ui, -apple-system, sans-serif',
      }}
    >
      {/* ── 1. ENGINEERING TOP TOOLBAR ── */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <span style={{ fontFamily: 'Consolas, monospace', fontWeight: 700, color: '#0072BD', fontSize: '12px', flexShrink: 0 }}>
            {courseCode}
          </span>
          <span style={{ color: '#94a3b8' }}>/</span>
          <span style={{ fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' }}>
            Lesson {lessonNum}: {lessonTitle}
          </span>
          <span style={{ color: '#94a3b8' }}>›</span>
          <span style={{ color: '#334155', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {deckMode === 'topic' ? `${currentSecNum} ${cleanCurrentTopicTitle}` : 'Chapter Overview'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Mode Switcher: Topic / Chapter Overview */}
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
              Topic ({topicSlides.length} {topicSlides.length === 1 ? 'slide' : 'slides'})
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
              Chapter Overview ({chapterTopicsMeta.length} {chapterTopicsMeta.length === 1 ? 'topic' : 'topics'})
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
            title="Toggle speaker notes (Key: N)"
          >
            Notes (N)
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
            Outline
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
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen (F)'}
          >
            {isFullscreen ? <IconMinimize2 size={14} /> : <IconMaximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Numeric Jump Indicator Toast */}
      {jumpBuffer && (
        <div style={{
          position: 'absolute',
          top: '56px',
          right: '24px',
          background: '#0f172a',
          color: '#ffffff',
          padding: '6px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'Consolas, monospace',
          fontWeight: 700,
          zIndex: 60,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        }}>
          Go to slide: {jumpBuffer} (Press Enter)
        </div>
      )}

      {/* ── 2. SLIDE VIEWPORT CANVAS ── */}
      <div style={{
        flex: 1,
        padding: isFullscreen ? '24px 48px 68px 48px' : '18px 32px 62px 32px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxSizing: 'border-box',
      }}>
        {/* A. TOPIC DECK MODE */}
        {deckMode === 'topic' && activeSlide && (() => {
          // Slide 0: Auto-generated Topic Intro Slide ("x.y <Topic title>" + up to 3 objectives)
          if (activeSlide.kind === 'topicIntro') {
            const topicObjectives = (
              activeSlide.points && activeSlide.points.length > 0
                ? activeSlide.points
                : lessonFile?.objectives || []
            ).slice(0, 3);

            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                {renderSlideHeader(activeSlide.category, activeSlide.title)}

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: topicObjectives.length > 0 ? '1.15fr 1fr' : '1fr',
                  gap: '22px',
                  flex: 1,
                  alignItems: 'stretch',
                  margin: '14px 0',
                  minHeight: 0,
                }}>
                  {/* Left: Topic Overview & Engineering Scope */}
                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '24px 26px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      alignSelf: 'flex-start',
                      background: `${color}15`,
                      color,
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 800,
                      fontFamily: 'Consolas, monospace',
                      marginBottom: '12px',
                    }}>
                      SECTION {currentSecNum} · ~{topicContent.durationMinutes} MIN
                    </div>
                    <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '0 0 12px 0', lineHeight: 1.3 }}>
                      {activeSlide.title}
                    </h3>
                    <p style={{ margin: 0, fontSize: '18px', color: '#1e293b', lineHeight: 1.7 }}>
                      {activeSlide.explain || topicContent.summary}
                    </p>
                  </div>

                  {/* Right: Up to 3 Objectives */}
                  {topicObjectives.length > 0 && (
                    <div style={{
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      padding: '22px 24px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '14px' }}>
                        {topicContent.objectives && topicContent.objectives.length > 0
                          ? 'Topic Learning Objectives:'
                          : 'Key Learning Objectives:'}
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {topicObjectives.map((obj, oIdx) => (
                          <div
                            key={oIdx}
                            style={{
                              background: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              borderRadius: '5px',
                              padding: '12px 14px',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '12px',
                            }}
                          >
                            <span style={{
                              width: 24,
                              height: 24,
                              borderRadius: '3px',
                              background: color,
                              color: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '11px',
                              fontWeight: 700,
                              flexShrink: 0,
                              marginTop: '1px',
                            }}>
                              {String(oIdx + 1).padStart(2, '0')}
                            </span>
                            <span style={{ fontSize: '14px', color: '#1e293b', lineHeight: 1.55, fontWeight: 500 }}>
                              {obj}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          }

          // Slide 1: Concept / Core Theory
          if (activeSlide.kind === 'concept') {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                {renderSlideHeader(activeSlide.category, activeSlide.title)}

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: activeSlide.figure ? '1.15fr 1fr' : (activeSlide.points?.length ? '1.1fr 1fr' : '1fr'),
                  gap: '22px',
                  flex: 1,
                  alignItems: 'stretch',
                  margin: '14px 0',
                  minHeight: 0,
                }}>
                  {/* Left Column: Text (& Points only when figure is present) */}
                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    padding: '18px 22px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: activeSlide.figure ? 'space-between' : 'flex-start',
                  }}>
                    <div>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                        Engineering Principles & Operation:
                      </span>
                      <p style={{
                        margin: 0,
                        fontSize: activeSlide.figure ? '15.5px' : '19px',
                        color: '#1e293b',
                        lineHeight: activeSlide.figure ? 1.65 : 1.7,
                      }}>
                        {activeSlide.explain || topicContent.summary}
                      </p>
                    </div>

                    {activeSlide.figure && activeSlide.points && activeSlide.points.length > 0 && (
                      <div style={{ marginTop: '14px', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                          Key Technical Points:
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
                        title="Click to enlarge diagram"
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
                        justifyContent: 'center',
                      }}>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
                          Specifications & Implementation Standards:
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {activeSlide.points.map((pt, ptIdx) => {
                            const parts = pt.split(':');
                            const ptTitle = parts[0];
                            const ptDesc = parts.slice(1).join(':').trim();
                            return (
                              <div key={ptIdx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '12px 14px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: ptDesc ? '3px' : 0 }}>
                                  <span style={{ width: 22, height: 22, borderRadius: '2px', background: color, color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>
                                    {String(ptIdx + 1).padStart(2, '0')}
                                  </span>
                                  <strong style={{ fontSize: '14px', color: '#0f172a' }}>{ptTitle}</strong>
                                </div>
                                {ptDesc && (
                                  <div style={{ fontSize: '13px', color: '#334155', paddingLeft: '30px', lineHeight: 1.5 }}>
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

          // Slide 2: Technical Diagram
          if (activeSlide.kind === 'diagram') {
            const figSrc = activeSlide.figure?.src || '';
            const natSize = figSrc ? diagramNaturalSizes[figSrc] : undefined;
            const isSmallImage = natSize !== undefined && natSize.w > 0 && natSize.w < 600;

            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                {renderSlideHeader(activeSlide.category, activeSlide.title)}

                <div style={{
                  flex: 1,
                  display: activeSlide.explain ? 'grid' : 'flex',
                  gridTemplateColumns: activeSlide.explain ? '1.35fr 1fr' : undefined,
                  gap: activeSlide.explain ? '22px' : undefined,
                  flexDirection: activeSlide.explain ? undefined : 'column',
                  alignItems: activeSlide.explain ? 'stretch' : 'center',
                  justifyContent: activeSlide.explain ? undefined : 'center',
                  margin: '14px 0',
                  minHeight: 0,
                }}>
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 0,
                  }}>
                    {activeSlide.figure && (
                      <div
                        onClick={() => setZoomImage(activeSlide.figure!.src)}
                        style={{
                          width: '100%',
                          flex: 1,
                          minHeight: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'zoom-in',
                          background: '#f8fafc',
                          borderRadius: '4px',
                          border: '1px solid #cbd5e1',
                          padding: '16px',
                          overflow: 'hidden',
                        }}
                        title="Click to enlarge diagram"
                      >
                        <img
                          src={asset(activeSlide.figure.src)}
                          alt={activeSlide.figure.alt || activeSlide.figure.caption}
                          onLoad={e => {
                            const img = e.currentTarget;
                            if (img.naturalWidth > 0 && !diagramNaturalSizes[figSrc]) {
                              setDiagramNaturalSizes(prev => ({
                                ...prev,
                                [figSrc]: { w: img.naturalWidth, h: img.naturalHeight },
                              }));
                            }
                          }}
                          style={{
                            width: isSmallImage ? `${natSize.w * 2}px` : undefined,
                            minWidth: isSmallImage ? `${natSize.w * 2}px` : undefined,
                            maxWidth: isSmallImage ? '80%' : '100%',
                            maxHeight: isSmallImage ? '80%' : '100%',
                            objectFit: 'contain',
                            imageRendering: 'auto',
                          }}
                        />
                      </div>
                    )}
                    {activeSlide.figure && (
                      <p style={{ fontSize: '13px', color: '#475569', marginTop: '10px', marginBottom: 0, textAlign: 'center', lineHeight: 1.4, fontWeight: 500 }}>
                        {activeSlide.figure.caption}
                      </p>
                    )}
                  </div>

                  {activeSlide.explain && (
                    <div style={{
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      padding: '20px 22px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color, textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                        Diagram Analysis & Operation:
                      </span>
                      <p style={{ margin: 0, fontSize: '18px', color: '#1e293b', lineHeight: 1.7 }}>
                        {activeSlide.explain}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          }

          // Slide 3: Field Case Study (no empty right box; render hardware below context when <= 5 items)
          if (activeSlide.kind === 'caseStudy' && topicContent.caseStudy) {
            const cs = topicContent.caseStudy;
            const hwCount = cs.hardware?.length || 0;
            const useTwoColumns = hwCount >= 6;

            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                {renderSlideHeader(activeSlide.category, cs.title)}

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: useTwoColumns ? '1.2fr 1fr' : '1fr',
                  gap: '22px',
                  flex: 1,
                  alignItems: 'stretch',
                  margin: '14px 0',
                  minHeight: 0,
                }}>
                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    padding: '20px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    gap: '16px',
                  }}>
                    <div>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                        Industrial Context & Application:
                      </span>
                      <p style={{ margin: 0, fontSize: '16px', color: '#1e293b', lineHeight: 1.65 }}>
                        {cs.context}
                      </p>
                    </div>

                    {!useTwoColumns && cs.hardware && cs.hardware.length > 0 && (
                      <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '14px 18px' }}>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                          Field Hardware & Interfaces:
                        </span>
                        <div style={{ display: 'grid', gridTemplateColumns: cs.hardware.length > 2 ? '1fr 1fr' : '1fr', gap: '8px 18px' }}>
                          {cs.hardware.map((hw, hIdx) => (
                            <div key={hIdx} style={{ fontSize: '13.5px', color: '#334155', display: 'flex', gap: '8px', lineHeight: 1.5 }}>
                              <span style={{ color, fontWeight: 700 }}>•</span>
                              <span>{hw}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {cs.pitfall && (
                      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '4px', padding: '12px 16px', fontSize: '13.5px', color: '#78350f', lineHeight: 1.55 }}>
                        <strong style={{ color: '#92400e' }}>Engineering Pitfall:</strong> {cs.pitfall}
                      </div>
                    )}
                  </div>

                  {useTwoColumns && cs.hardware && (
                    <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                        Field Hardware & Interfaces:
                      </span>
                      <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13.5px', color: '#334155', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {cs.hardware.map((hw, hIdx) => (
                          <li key={hIdx}>{hw}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          }

          // Slide 4: Interactive Simulator
          if (activeSlide.kind === 'simulator') {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                {renderSlideHeader(activeSlide.category, activeSlide.title)}

                <div style={{ width: '100%', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '10px 0' }}>
                  <div style={{ width: '100%', maxHeight: '100%' }}>
                    {simulatorNode}
                  </div>
                </div>
              </div>
            );
          }

          // Slide 5: Quick Check (Quiz)
          if (activeSlide.kind === 'quiz' && topicContent.quiz && activeSlide.quizIndex !== undefined) {
            const q = topicContent.quiz[activeSlide.quizIndex];
            if (!q) return null;

            const qIdx = activeSlide.quizIndex;
            const userChoice = quizAnswers[qIdx];
            const isSubmitted = quizSubmitted[qIdx];
            const isCorrect = userChoice === q.answer;

            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-start' }}>
                {renderSlideHeader(`${activeSlide.category} (QUESTION ${qIdx + 1}/${topicContent.quiz.length})`, q.q)}

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '22px', flex: 1, alignItems: 'stretch', margin: '14px 0', minHeight: 0 }}>
                  {/* Left: Options */}
                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '20px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: '10px' }}>
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
                        Check Answer
                      </button>
                    )}
                  </div>

                  {/* Right: Explanation */}
                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '20px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                    {isSubmitted ? (
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: isCorrect ? '#16a34a' : '#dc2626', marginBottom: '8px' }}>
                          {isCorrect ? '✓ Correct Answer!' : '✗ Not quite right'}
                        </div>
                        <p style={{ fontSize: '14px', color: '#334155', lineHeight: 1.6, margin: 0 }}>
                          <strong>Technical Explanation:</strong> {q.explain}
                        </p>
                      </div>
                    ) : (
                      <div style={{ color: '#64748b', fontSize: '13.5px', lineHeight: 1.6 }}>
                        Select an option on the left and click <strong>Check Answer</strong> to verify your understanding of this topic.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          return null;
        })()}

        {/* B. CHAPTER OVERVIEW DECK MODE */}
        {deckMode === 'chapter' && (() => {
          // Slide 0: Interactive Table of Contents (TOC) with section x.y, title, and starting slide
          if (currentSlide === 0) {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1px solid #cbd5e1', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '3px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: 4, height: 16, background: color, borderRadius: 2 }} />
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                        Lesson {lessonNum} › {currentSecNum} {cleanCurrentTopicTitle}
                      </span>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      CHAPTER TABLE OF CONTENTS · COURSE {courseCode}
                    </span>
                  </div>
                  <h1 style={{ fontSize: isFullscreen ? '26px' : '23px', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.25 }}>
                    Lesson {lessonNum}: {lessonTitle}
                  </h1>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: '22px', flex: 1, alignItems: 'stretch', margin: '14px 0', minHeight: 0 }}>
                  {/* Left: Interactive Table of Contents (Section x.y + Title + Starting Slide) */}
                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '16px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 0,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 800, color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Chapter Topics & Starting Slides (Click to Jump):
                      </span>
                      <span style={{ fontSize: '11px', fontFamily: 'Consolas, monospace', color: '#64748b', fontWeight: 600 }}>
                        Total: {totalLessonSlidesK} slides
                      </span>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: chapterTopicsMeta.length > 6 ? '1fr 1fr' : '1fr',
                      gap: '8px',
                      overflowY: 'auto',
                      flex: 1,
                      alignContent: 'start',
                    }}>
                      {chapterTopicsMeta.map(meta => {
                        const isCurrent = meta.slug === currentTopicSlug;
                        return (
                          <button
                            key={meta.slug}
                            onClick={() => handleSelectTopic(meta.slug)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '10px',
                              padding: '10px 12px',
                              borderRadius: '5px',
                              border: `1.5px solid ${isCurrent ? color : '#cbd5e1'}`,
                              background: isCurrent ? `${color}12` : '#ffffff',
                              cursor: 'pointer',
                              textAlign: 'left',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                              <span style={{
                                padding: '3px 7px',
                                borderRadius: '3px',
                                background: isCurrent ? color : '#e2e8f0',
                                color: isCurrent ? '#ffffff' : '#0f172a',
                                fontFamily: 'Consolas, monospace',
                                fontSize: '11.5px',
                                fontWeight: 800,
                                flexShrink: 0,
                              }}>
                                {meta.secNum}
                              </span>
                              <span style={{
                                fontSize: '13.5px',
                                fontWeight: isCurrent ? 700 : 600,
                                color: '#0f172a',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}>
                                {meta.cleanTitle}
                              </span>
                            </div>

                            <span style={{
                              fontFamily: 'Consolas, monospace',
                              fontSize: '11px',
                              fontWeight: 700,
                              color: isCurrent ? color : '#475569',
                              background: '#f1f5f9',
                              padding: '3px 8px',
                              borderRadius: '3px',
                              border: '1px solid #e2e8f0',
                              flexShrink: 0,
                            }}>
                              Slide {meta.startSlide}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right: Chapter Overview & CLO */}
                  <div style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '18px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    overflowY: 'auto',
                  }}>
                    <div>
                      <span style={{ fontSize: '11.5px', fontWeight: 800, color, textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                        Chapter Overview:
                      </span>
                      <p style={{ margin: '0 0 14px 0', fontSize: '14px', color: '#1e293b', lineHeight: 1.6 }}>
                        {lessonFile?.overview}
                      </p>
                    </div>

                    {lessonFile?.objectives && lessonFile.objectives.length > 0 && (
                      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                        <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', marginBottom: '8px' }}>
                          Course Learning Objectives (CLO):
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#334155', lineHeight: 1.55, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          {lessonFile.objectives.slice(0, 4).map((obj, oIdx) => (
                            <li key={oIdx}>{obj}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          // Slide 1..N: Each Topic in Chapter
          const topicIdx = currentSlide - 1;
          const chMeta = chapterTopicsMeta[topicIdx];
          if (!chMeta) return null;
          const chTopic = chMeta.topicContent;

          const chFig = chTopic.figures && chTopic.figures[0];
          const chBody = chTopic.body && chTopic.body[0];

          return (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              {renderSlideHeader(
                `TOPIC ${String(currentSlide).padStart(2, '0')} / ${String(chapterTopicsMeta.length).padStart(2, '0')} · STARTS AT SLIDE ${chMeta.startSlide}`,
                `${chMeta.secNum} ${chMeta.cleanTitle}`
              )}

              <div style={{ display: 'grid', gridTemplateColumns: chFig ? '1.15fr 1fr' : '1fr', gap: '22px', flex: 1, alignItems: 'stretch', margin: '14px 0', minHeight: 0 }}>
                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '18px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                      Core Concept & Principle of Operation:
                    </span>
                    <p style={{ margin: 0, fontSize: '15.5px', color: '#1e293b', lineHeight: 1.65 }}>
                      {chBody?.text || chTopic.summary}
                    </p>
                  </div>

                  <div style={{ marginTop: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    {chBody?.keyPoints && chBody.keyPoints.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                          Key Points:
                        </span>
                        {chBody.keyPoints.slice(0, 3).map((kp, kIdx) => (
                          <div key={kIdx} style={{ fontSize: '12.5px', color: '#334155', display: 'flex', gap: '6px' }}>
                            <span style={{ color, fontWeight: 700 }}>•</span>
                            <span>{kp}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <button
                      onClick={() => handleSelectTopic(chMeta.slug)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '4px',
                        border: 'none',
                        background: color,
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    >
                      Open {chMeta.secNum} ({chMeta.slideCount} slides) →
                    </button>
                  </div>
                </div>

                {chFig && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '14px', height: '100%' }}>
                    <div
                      onClick={() => setZoomImage(chFig.src)}
                      style={{ width: '100%', height: '88%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-in', background: '#ffffff', borderRadius: '4px', border: '1px solid #e2e8f0', overflow: 'hidden' }}
                      title="Click to enlarge diagram"
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

      {/* ── 3. PERSISTENT BOTTOM NAVIGATION (VISIBLE IN FULLSCREEN F AS WELL) ── */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50px',
        background: '#f8fafc',
        borderTop: '1px solid #cbd5e1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        gap: '16px',
        opacity: 1,
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
            flexShrink: 0,
          }}
        >
          <IconChevronLeft size={16} />
          Previous
        </button>

        {/* Center: Section counter "x.y · i/n", Segmented Topic Progress Bar, and "Slide k / K" */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, maxWidth: '860px', justifyContent: 'center' }}>
          {/* Section slide indicator: "x.y · i/n" */}
          <span style={{
            fontFamily: 'Consolas, monospace',
            fontSize: '12.5px',
            fontWeight: 800,
            color: '#0f172a',
            background: '#e2e8f0',
            padding: '3px 9px',
            borderRadius: '4px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            {footerSectionTag}
          </span>

          {/* Segmented Progress Bar by Topic (hover shows topic name, active topic highlighted) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, minWidth: '160px', maxWidth: '460px' }}>
            {chapterTopicsMeta.map(meta => {
              const isCurrentTopic =
                deckMode === 'topic'
                  ? meta.slug === currentTopicSlug
                  : currentSlide > 0 && chapterTopicsMeta[currentSlide - 1]?.slug === meta.slug;
              const fillRatio =
                deckMode === 'topic' && meta.slug === currentTopicSlug
                  ? (currentSlide + 1) / meta.slideCount
                  : isCurrentTopic
                  ? 1
                  : 0;

              return (
                <div
                  key={meta.slug}
                  onClick={() => handleSelectTopic(meta.slug)}
                  title={`${meta.secNum} ${meta.cleanTitle} (Slides ${meta.startSlide}–${meta.endSlide})`}
                  style={{
                    flex: meta.slideCount,
                    height: isCurrentTopic ? '10px' : '7px',
                    background: isCurrentTopic ? `${color}30` : '#cbd5e1',
                    borderRadius: '3px',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: isCurrentTopic ? `1px solid ${color}` : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {isCurrentTopic && (
                    <div
                      style={{
                        width: `${Math.min(100, Math.max(15, fillRatio * 100))}%`,
                        height: '100%',
                        background: color,
                        transition: 'width 0.2s ease',
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Slide dots within current topic */}
          {deckMode === 'topic' && (
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexShrink: 0 }}>
              {topicSlides.map((sl, i) => (
                <span
                  key={sl.id}
                  onClick={() => setCurrentSlide(i)}
                  title={`${i + 1}. ${sl.title}`}
                  style={{
                    width: i === currentSlide ? 14 : 6,
                    height: 6,
                    borderRadius: 3,
                    background: i === currentSlide ? color : '#cbd5e1',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                />
              ))}
            </div>
          )}

          {/* Global lesson slide indicator: "Slide k / K" */}
          <span style={{
            fontFamily: 'Consolas, monospace',
            fontSize: '12.5px',
            fontWeight: 700,
            color: '#334155',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            Slide {globalSlideK} / {totalLessonSlidesK}
          </span>
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
            flexShrink: 0,
          }}
        >
          Next
          <IconChevronRight size={16} />
        </button>
      </div>

      {/* ── 4. SLIDE OUTLINE DRAWER ── */}
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
              width: '340px',
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
                {deckMode === 'topic' ? `Topic ${currentSecNum} Outline` : 'Chapter Slide Outline'}
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
                    00. Chapter Table of Contents & CLO
                  </button>
                  {chapterTopicsMeta.map((meta, idx) => (
                    <button
                      key={meta.slug}
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
                        justifyContent: 'space-between',
                        gap: '8px',
                      }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {meta.secNum} {meta.cleanTitle}
                      </span>
                      <span style={{ fontFamily: 'Consolas, monospace', fontSize: '11px', color: '#94a3b8', flexShrink: 0 }}>
                        p.{meta.startSlide}
                      </span>
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 5. SPEAKER NOTES DRAWER ── */}
      {notesOpen && (
        <div style={{
          position: 'absolute',
          bottom: '50px',
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
              Instructor Notes
            </span>
            <button
              onClick={() => setNotesOpen(false)}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', color: '#64748b' }}
            >
              ✕
            </button>
          </div>
          <p style={{ margin: 0, fontSize: '13.5px', color: '#334155', lineHeight: 1.6 }}>
            {topicContent.summary || topicContent.body?.[0]?.text || ''}
          </p>
        </div>
      )}

      {/* ── 6. DIAGRAM ZOOM MODAL ── */}
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
            alt="Detailed Engineering Diagram"
            style={{ maxWidth: '95%', maxHeight: '95%', objectFit: 'contain', borderRadius: '4px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
          />
        </div>
      )}
    </div>
  );
}
