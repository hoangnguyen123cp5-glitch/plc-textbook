'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { asset } from '@/lib/asset';
import { TopicCaseStudy } from '@/data/topic-case-studies';

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
  allSections = [],
  chapterOverview = '',
  chapterObjectives = [],
  allDiagrams = {},
  caseStudy,
  simulatorNode,
  quizNode,
}: Props) {
  const router = useRouter();
  const slideRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isInstructorMode, setIsInstructorMode] = useState(false); // Lecturer / Instructor configuration mode
  const [studioMode, setStudioMode] = useState(false); // LMS Recording Mode (borderless 16:9 canvas)
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [deckMode, setDeckMode] = useState<'chapter' | 'topic'>('chapter'); // 'chapter' = All topics lecture deck, 'topic' = 5-slide deep-dive
  const [currentSlide, setCurrentSlide] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [simulatorLayout, setSimulatorLayout] = useState<'split' | 'full'>('split');

  // Chapter deck slides:
  // Slide 0: Cover & Course Learning Outcomes (CLO)
  // Slide 1..N: Curriculum Sections (1.1, 1.2, 1.3...)
  // Slide N+1: Interactive Virtual Lab Bench
  // Slide N+2: Formative Micro-Quiz Assessment
  const chapterSections = allSections.length > 0 ? allSections : (section ? [section] : []);
  const totalChapterSlides = chapterSections.length + 3; // Cover + Sections + Simulator + Quiz

  // Topic deck slides: 5 slides
  const TOPIC_TABS = [
    { id: 0, label: 'Schematic & Overview', shortLabel: '1. Schematic', icon: '📊' },
    { id: 1, label: 'Core Principles', shortLabel: '2. Principles', icon: '💡' },
    { id: 2, label: 'Industrial Case Study', shortLabel: '3. Case Study', icon: '🏭' },
    { id: 3, label: 'Interactive Virtual Bench', shortLabel: '4. Virtual Lab', icon: '⚡' },
    { id: 4, label: 'Formative Micro-Quiz', shortLabel: '5. Micro-Quiz', icon: '📝' },
  ];

  const currentTotalSlides = deckMode === 'chapter' ? totalChapterSlides : 5;

  // Handle slide navigation
  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentSlide < currentTotalSlides - 1) {
      setCurrentSlide(prev => prev + 1);
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
      } else if (e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setIsInstructorMode(prev => !prev);
      } else if (e.key.toLowerCase() === 'r') {
        if (isInstructorMode) {
          e.preventDefault();
          setStudioMode(prev => !prev);
        }
      } else if (e.key.toLowerCase() === 't') {
        e.preventDefault();
        setDrawerOpen(prev => !prev);
      } else if (e.key.toLowerCase() === 'c') {
        e.preventDefault();
        setDeckMode(prev => (prev === 'chapter' ? 'topic' : 'chapter'));
        setCurrentSlide(0);
      } else if (['1', '2', '3', '4', '5'].includes(e.key) && deckMode === 'topic') {
        const slideIdx = parseInt(e.key) - 1;
        if (slideIdx >= 0 && slideIdx < 5) {
          setCurrentSlide(slideIdx);
        }
      } else if (e.key === 'Escape') {
        if (zoomImage) {
          setZoomImage(null);
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
  }, [currentSlide, currentTotalSlides, deckMode, isFullscreen, studioMode, isInstructorMode, zoomImage, drawerOpen]);

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
        height: isLMSDisplay ? '100vh' : 'calc(100vh - 86px)',
        minHeight: '620px',
        maxHeight: isLMSDisplay ? '100vh' : '920px',
        background: '#ffffff',
        borderRadius: isLMSDisplay ? '0px' : '14px',
        border: isLMSDisplay ? 'none' : '1.5px solid #cbd5e1',
        boxShadow: isLMSDisplay ? 'none' : '0 10px 30px rgba(0, 0, 0, 0.06)',
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
      {/* ── Top 3.5px Progress Line ── */}
      <div style={{ height: '3.5px', width: '100%', background: '#e2e8f0', flexShrink: 0 }}>
        <div
          style={{
            height: '100%',
            width: `${((currentSlide + 1) / currentTotalSlides) * 100}%`,
            background: `linear-gradient(90deg, ${color}, #0284c7)`,
            transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </div>

      {/* ── Top Header Bar: University LMS Presentation Header ── */}
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
        }}
      >
        {/* Left: Branding & Course Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '22px' }}>{lessonIcon}</span>
          <div>
            <div style={{
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.06em',
              color: isLMSDisplay ? '#38bdf8' : color,
              textTransform: 'uppercase',
            }}>
              {courseCode} · VNU-IS · S7-1200 / S7-300 PLC ENGINEERING COURSEWARE
            </div>
            <div style={{
              fontSize: isLMSDisplay ? '15px' : '13.5px',
              fontWeight: 800,
              color: isLMSDisplay ? '#ffffff' : '#0f172a',
            }}>
              {lessonTitle} · {deckMode === 'chapter' ? `Full Chapter Lecture Deck (Slide ${currentSlide + 1}/${totalChapterSlides})` : `Topic Focus: ${currentTopic.title}`}
            </div>
          </div>
        </div>

        {/* Right: Mode Switcher, Instructor Configuration, Studio & Fullscreen */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Deck Mode Toggle: Chapter Deck vs Topic Deep-dive */}
          <div style={{ display: 'flex', background: isLMSDisplay ? '#1e293b' : '#f1f5f9', padding: '2px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <button
              onClick={() => {
                setDeckMode('chapter');
                setCurrentSlide(0);
              }}
              title="Sequential lecture presentation across all topics (Broadcast deck for complete module)"
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                border: 'none',
                background: deckMode === 'chapter' ? color : 'transparent',
                color: deckMode === 'chapter' ? '#ffffff' : isLMSDisplay ? '#94a3b8' : '#475569',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              🎬 Full Chapter Deck ({totalChapterSlides} Slides)
            </button>
            <button
              onClick={() => {
                setDeckMode('topic');
                setCurrentSlide(0);
              }}
              title="5-Slide in-depth focused deck for this specific topic"
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                border: 'none',
                background: deckMode === 'topic' ? color : 'transparent',
                color: deckMode === 'topic' ? '#ffffff' : isLMSDisplay ? '#94a3b8' : '#475569',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              🎯 Topic Focus Deck (5 Slides)
            </button>
          </div>

          {/* ── INSTRUCTOR CONFIGURATION SWITCH (Instructor Mode) ── */}
          <button
            onClick={() => setIsInstructorMode(prev => !prev)}
            title="Toggle Instructor Tools: Activates LMS recording controls, video narration prompts, and live telemetry notes (Key: P)"
            style={{
              padding: '6px 12px',
              borderRadius: '7px',
              border: isInstructorMode ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
              background: isInstructorMode ? '#eff6ff' : isLMSDisplay ? '#1e293b' : '#ffffff',
              color: isInstructorMode ? '#1d4ed8' : isLMSDisplay ? '#cbd5e1' : '#334155',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: isInstructorMode ? '0 0 0 2px rgba(37,99,235,0.15)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <span>👨‍🏫</span>
            <span>{isInstructorMode ? 'Instructor View: ON' : 'Instructor View: OFF'}</span>
            <span style={{ fontSize: '10px', opacity: 0.7 }}>(P)</span>
          </button>

          {/* ── LMS RECORDING CONTROLS (Only visible when Instructor Mode is ON) ── */}
          {isInstructorMode && (
            <button
              onClick={() => setStudioMode(prev => !prev)}
              title="Toggle LMS Recording Studio Mode (Borderless 16:9 Presentation Canvas - Key: R)"
              style={{
                padding: '6px 12px',
                borderRadius: '7px',
                border: studioMode ? '1.5px solid #38bdf8' : '1px solid #cbd5e1',
                background: studioMode ? '#0284c7' : isLMSDisplay ? '#1e293b' : '#f8fafc',
                color: studioMode ? '#ffffff' : isLMSDisplay ? '#f1f5f9' : '#0f172a',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                animation: studioMode ? 'pulse 2s infinite' : 'none',
              }}
            >
              <span>🎥</span>
              <span>{studioMode ? 'Exit LMS Studio' : 'Record LMS Deck'}</span>
              <span style={{ fontSize: '10px', opacity: 0.8 }}>(R)</span>
            </button>
          )}

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            style={{
              padding: '6px 12px',
              borderRadius: '7px',
              border: isFullscreen ? '1.5px solid #38bdf8' : '1px solid #cbd5e1',
              background: isFullscreen ? '#0284c7' : isLMSDisplay ? '#1e293b' : '#ffffff',
              color: isFullscreen ? '#ffffff' : isLMSDisplay ? '#f1f5f9' : '#334155',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>{isFullscreen ? '✕ Exit Fullscreen' : '⛶ Fullscreen (F)'}</span>
          </button>

          {!isLMSDisplay && (
            <button
              onClick={() => setDrawerOpen(prev => !prev)}
              style={{
                padding: '6px 12px',
                borderRadius: '7px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#0f172a',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>📋</span>
              <span>Outline ({topics.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Sub-Tabs Bar: Only in Topic Deep-Dive Mode ── */}
      {deckMode === 'topic' && (
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
            {TOPIC_TABS.map(tab => {
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

          <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>
            Shortcuts: <strong>1..5</strong> (Tabs) · <strong>← / →</strong> or <strong>Spacebar</strong> (Slide) · <strong>P</strong> (Instructor View)
          </div>
        </div>
      )}

      {/* ── Main Slide Stage (ZERO VERTICAL SCROLLBAR: Fits 100% into the 16:9 frame) ── */}
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
        {/* ════════════════════════════════════════════════════════════════════
           A. FULL CHAPTER LECTURE DECK MODE
        ════════════════════════════════════════════════════════════════════ */}
        {deckMode === 'chapter' && (() => {
          // Slide 0: Cover & Course Learning Outcomes (CLO)
          if (currentSlide === 0) {
            return (
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', alignItems: 'center', height: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: 4, height: 24, background: color, borderRadius: 99 }} />
                    <span style={{ fontSize: '12px', fontWeight: 800, color: color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      VNU-IS · {courseCode}: PROGRAMMABLE LOGIC CONTROLLERS
                    </span>
                  </div>

                  <h1 style={{ fontSize: isLMSDisplay ? '32px' : '26px', fontWeight: 900, color: '#0f172a', margin: 0, lineHeight: 1.2 }}>
                    {lessonTitle}
                  </h1>

                  <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '16px 20px', borderLeft: `5px solid ${color}` }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', marginBottom: '6px' }}>
                      🎯 Chapter Overview & Learning Outcomes (CLO):
                    </div>
                    <p style={{ margin: 0, fontSize: '13.5px', color: '#334155', lineHeight: 1.65 }}>
                      {chapterOverview || section?.content?.split('. ').slice(0, 3).join('. ') + '.'}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, padding: '4px 12px', borderRadius: '6px', background: '#f1f5f9', border: '1px solid #cbd5e1' }}>
                      📚 {chapterSections.length} Curriculum Topics
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 700, padding: '4px 12px', borderRadius: '6px', background: '#f1f5f9', border: '1px solid #cbd5e1' }}>
                      ⚡ Interactive Virtual Lab Bench
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 700, padding: '4px 12px', borderRadius: '6px', background: '#f1f5f9', border: '1px solid #cbd5e1' }}>
                      📝 Formative Micro-Quiz Assessment
                    </span>
                  </div>
                </div>

                {/* Right: Objectives & Topics Roadmap */}
                <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '20px 24px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>
                    📋 Lecture Outline & Agenda:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '380px', overflowY: 'auto' }}>
                    {chapterSections.map((sec, idx) => (
                      <div
                        key={idx}
                        onClick={() => setCurrentSlide(idx + 1)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <span style={{ width: 22, height: 22, borderRadius: '50%', background: `${color}18`, color: color, fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {idx + 1}
                        </span>
                        <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f172a' }}>
                          {sec.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          }

          // Slide 1..N: Each Section has its own dedicated slide
          const sectionIdx = currentSlide - 1;
          if (sectionIdx >= 0 && sectionIdx < chapterSections.length) {
            const currentSec = chapterSections[sectionIdx];
            const secTopicSlug = topics[sectionIdx]?.slug ?? currentTopic.slug;
            const secDiagram = allDiagrams[secTopicSlug] ?? diagram;

            return (
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', alignItems: 'center', height: '100%' }}>
                {/* Left: Section Content & Key Principles */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', justifyContent: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <span style={{ width: 4, height: 16, background: color, borderRadius: 99 }} />
                      <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        TOPIC {sectionIdx + 1} OF {chapterSections.length} · LECTURE PRESENTATION
                      </span>
                    </div>
                    <h2 style={{ fontSize: isLMSDisplay ? '24px' : '20px', fontWeight: 900, color: '#0f172a', margin: 0, lineHeight: 1.25 }}>
                      {currentSec.title}
                    </h2>
                  </div>

                  {/* Core Theory Card */}
                  <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '16px 20px', borderLeft: `5px solid ${color}` }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', marginBottom: '6px' }}>
                      📌 Core Engineering Principles:
                    </div>
                    <p style={{ margin: 0, fontSize: isLMSDisplay ? '14px' : '13px', color: '#334155', lineHeight: 1.65 }}>
                      {currentSec.content}
                    </p>
                  </div>

                  {/* Key Points Grid */}
                  {currentSec.keyPoints && currentSec.keyPoints.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {currentSec.keyPoints.slice(0, 4).map((kp, kIdx) => {
                        const parts = kp.split(':');
                        const kpTitle = parts[0];
                        const kpDesc = parts.slice(1).join(':').trim();
                        return (
                          <div key={kIdx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 14px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                            <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', marginBottom: '3px' }}>
                              • {kpTitle}
                            </div>
                            {kpDesc && (
                              <div style={{ fontSize: '11.5px', color: '#475569', lineHeight: 1.45 }}>
                                {kpDesc}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {currentSec.note && (
                    <div style={{ padding: '10px 14px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', fontSize: '12px', color: '#92400e', lineHeight: 1.5 }}>
                      💡 <strong>Engineering Note:</strong> {currentSec.note}
                    </div>
                  )}
                </div>

                {/* Right: Technical Diagram */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '16px', height: '100%', maxHeight: isLMSDisplay ? '62vh' : '440px' }}>
                  {secDiagram ? (
                    <>
                      <div
                        onClick={() => setZoomImage(secDiagram.src)}
                        style={{ width: '100%', height: '85%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-in' }}
                        title="Click to zoom schematic"
                      >
                        <img
                          src={asset(secDiagram.src)}
                          alt={secDiagram.caption}
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}
                        />
                      </div>
                      <p style={{ fontSize: '11.5px', color: '#475569', marginTop: '8px', fontStyle: 'italic', textAlign: 'center', lineHeight: 1.35, fontWeight: 500 }}>
                        {secDiagram.caption}
                      </p>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', color: '#64748b' }}>
                      <span style={{ fontSize: '38px', display: 'block', marginBottom: '8px' }}>📊</span>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>Schematic Diagram: {currentSec.title}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          }

          // Slide N+1: Interactive Virtual Lab Bench
          if (currentSlide === chapterSections.length + 1) {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ width: 4, height: 16, background: color, borderRadius: 99 }} />
                    <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase' }}>
                      INTERACTIVE VIRTUAL BENCH (LAB SIMULATION)
                    </span>
                  </div>
                  <h2 style={{ fontSize: isLMSDisplay ? '22px' : '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Process Simulation Bench: {lessonTitle}
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

          // Slide N+2: Formative Micro-Quiz Assessment
          if (currentSlide === chapterSections.length + 2) {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ width: 4, height: 16, background: color, borderRadius: 99 }} />
                    <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase' }}>
                      FORMATIVE MICRO-QUIZ ASSESSMENT
                    </span>
                  </div>
                  <h2 style={{ fontSize: isLMSDisplay ? '22px' : '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Knowledge Check & Concept Mastery: {lessonTitle}
                  </h2>
                </div>

                <div style={{ width: '100%', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '10px 0' }}>
                  <div style={{ width: '100%' }}>
                    {quizNode}
                  </div>
                </div>
              </div>
            );
          }

          return null;
        })()}

        {/* ════════════════════════════════════════════════════════════════════
           B. TOPIC FOCUS DECK MODE (5 SLIDES)
        ════════════════════════════════════════════════════════════════════ */}
        {deckMode === 'topic' && (() => {
          // Slide 1: Schematic & Overview
          if (currentSlide === 0) {
            return (
              <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: isLMSDisplay ? '36px' : '24px', alignItems: 'center', height: '100%', overflow: 'hidden' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', justifyContent: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ width: 4, height: 18, background: color, borderRadius: 99 }} />
                      <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', color: color, textTransform: 'uppercase' }}>
                        Curriculum Topic {currentIndex + 1} of {topics.length} · Est. Duration ~{currentTopic.durationMinutes} mins
                      </span>
                    </div>
                    <h2 style={{ fontSize: isLMSDisplay ? '26px' : '22px', fontWeight: 800, color: '#0f172a', lineHeight: 1.25, margin: 0 }}>
                      {currentTopic.title}
                    </h2>
                  </div>

                  <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '16px 20px', borderLeft: `5px solid ${color}` }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.06em', color: color, textTransform: 'uppercase', marginBottom: '8px' }}>
                      🎯 Core Engineering Concept & Principle:
                    </div>
                    <p style={{ fontSize: isLMSDisplay ? '15px' : '13.5px', color: '#334155', lineHeight: 1.65, margin: 0 }}>
                      {section?.content ? section.content.split('. ').slice(0, 3).join('. ') + '.' : 'Theoretical foundation and industrial engineering context for this curriculum topic.'}
                    </p>
                  </div>

                  {section?.note && (
                    <div style={{ padding: '12px 18px', background: '#fffbeb', border: '1px solid #fde68a', borderLeft: '4px solid #f59e0b', borderRadius: '8px', fontSize: isLMSDisplay ? '13px' : '12px', color: '#92400e', lineHeight: 1.55 }}>
                      💡 <strong>Engineering Note:</strong> {section.note}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '16px', height: '100%', maxHeight: isLMSDisplay ? '62vh' : '440px' }}>
                  {diagram ? (
                    <>
                      <div onClick={() => setZoomImage(diagram.src)} style={{ width: '100%', height: '85%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-in' }}>
                        <img src={asset(diagram.src)} alt={diagram.caption} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }} />
                      </div>
                      <p style={{ fontSize: '11.5px', color: '#475569', marginTop: '8px', fontStyle: 'italic', textAlign: 'center', lineHeight: 1.35, fontWeight: 500 }}>
                        {diagram.caption}
                      </p>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', color: '#64748b' }}>
                      <span style={{ fontSize: '38px', display: 'block', marginBottom: '8px' }}>📊</span>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>Technical Schematic: {currentTopic.title}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          }

          // Slide 2: Core Engineering Principles
          if (currentSlide === 1) {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span style={{ width: 4, height: 16, background: color, borderRadius: 99 }} />
                    <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase' }}>
                      Key Engineering Principles & Governing Laws
                    </span>
                  </div>
                  <h2 style={{ fontSize: isLMSDisplay ? '24px' : '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Core Principles · {currentTopic.title}
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', flex: 1, alignContent: 'center', margin: '12px 0' }}>
                  {section?.keyPoints && section.keyPoints.length > 0 ? (
                    section.keyPoints.slice(0, 6).map((kp, idx) => {
                      const parts = kp.split(':');
                      const title = parts[0];
                      const desc = parts.slice(1).join(':').trim();
                      return (
                        <div key={idx} style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '14px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                            <span style={{ width: 24, height: 24, borderRadius: '50%', background: `${color}18`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, flexShrink: 0 }}>
                              {idx + 1}
                            </span>
                            <strong style={{ color: '#0f172a', fontSize: isLMSDisplay ? '14.5px' : '13.5px' }}>{title}</strong>
                          </div>
                          {desc && (
                            <div style={{ color: '#334155', fontSize: isLMSDisplay ? '13px' : '12px', lineHeight: 1.55, paddingLeft: '34px' }}>{desc}</div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ color: '#64748b', fontSize: '13px' }}>Loading core engineering rules for this curriculum topic.</div>
                  )}
                </div>
              </div>
            );
          }

          // Slide 3: Industrial Field Case Study
          // If Instructor Mode is ON: provides Lecturer Speaking Cues and video prompts.
          // If Instructor Mode is OFF: provides clean, rigorous academic engineering specifications & standards.
          if (currentSlide === 2) {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span style={{ width: 4, height: 16, background: color, borderRadius: 99 }} />
                    <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase' }}>
                      INDUSTRIAL FIELD CASE STUDY & ENGINEERING ANALYSIS
                    </span>
                  </div>
                  <h2 style={{ fontSize: isLMSDisplay ? '22px' : '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Real-World Industrial Application: {currentTopic.title}
                  </h2>
                </div>

                {/* 2-Column Split: Case Study on Left, Deployed Spec / Lecturer Cue on Right */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: '20px', flex: 1, alignItems: 'stretch', margin: '12px 0' }}>
                  {/* Left Column: Industrial Application & Telemetry */}
                  <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '18px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                        🏭 Industrial Application & Problem Context:
                      </div>
                      <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                        {caseStudy?.caseTitle || `Automation System Application: ${currentTopic.title}`}
                      </h3>
                      <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.65, margin: '0 0 14px 0' }}>
                        {caseStudy?.industryApplication || section?.content}
                      </p>
                    </div>

                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 14px' }}>
                      <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                        📐 Governing Formula & Critical Constraints:
                      </span>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', fontFamily: 'Consolas, monospace' }}>
                        {caseStudy?.keyFormulaOrMetric || 'Deterministic Scan Cycle: 1–10 ms | Standard: IEC 61131-3'}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Clean Academic Spec OR Instructor Cue */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'space-between' }}>
                    {isInstructorMode ? (
                      /* Instructor View: Video Narration Cue for recording lectures */
                      <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <span style={{ fontSize: '16px' }}>🎙️</span>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            Lecturer Speaking Cue (Video Narration Script):
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '12.5px', color: '#1e3a8a', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '10px 12px', lineHeight: 1.6 }}>
                          "{caseStudy?.speakingCue || `Explain the operational mechanics of ${currentTopic.title}, emphasizing the signal transduction path, deterministic cycle, and contrast with legacy hardwired relay logic.`}"
                        </p>
                      </div>
                    ) : (
                      /* Student / Audience View: Industrial Architecture & Standards */
                      <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>
                          🛡️ Commissioning Standards & Best Practices:
                        </span>
                        <div style={{ fontSize: '12.5px', color: '#334155', lineHeight: 1.6 }}>
                          Compliant with IEC 61131-2 industrial equipment safety standards, galvanic signal isolation (&gt;500 VAC), and galvanic isolation between 24VDC logic and 230/400 VAC actuator loads.
                        </div>
                      </div>
                    )}

                    {/* Field Hardware Box */}
                    <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                        ⚡ Deployed Field Hardware Specifications:
                      </span>
                      <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11.5px', color: '#475569', lineHeight: 1.55, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        {(caseStudy?.fieldHardware || [
                          'CPU: Siemens SIMATIC S7-1200 1214C DC/DC/DC',
                          'Signal Standard: 24VDC PNP, 4–20 mA Analog, PROFINET RT',
                        ]).map((hw, hIdx) => (
                          <li key={hIdx}>{hw}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Operational Pitfall / Lesson */}
                    <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '10px 14px', fontSize: '11.5px', color: '#92400e', lineHeight: 1.5 }}>
                      ⚠️ <strong>Field Commissioning Lesson:</strong> {caseStudy?.commonPitfall || 'Always ensure protective earth (PE) grounding impedance is < 10 ohms and isolated from DC control common M.'}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Slide 4: Interactive Virtual Lab Bench
          // If Instructor Mode is ON: lecturer can choose Dual-Wing Studio (with notes) or Full Bench.
          // If Instructor Mode is OFF: renders 100% clean full bench for students and lecture presentations.
          if (currentSlide === 3) {
            const showStudioWing = isInstructorMode && simulatorLayout === 'split';

            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      <span style={{ width: 4, height: 16, background: color, borderRadius: 99 }} />
                      <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase' }}>
                        INTERACTIVE VIRTUAL BENCH & ONLINE SIMULATION
                      </span>
                    </div>
                    <h2 style={{ fontSize: isLMSDisplay ? '22px' : '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      Interactive Process Simulation: {currentTopic.title}
                    </h2>
                  </div>

                  {isInstructorMode && (
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
                        📊 Dual-Wing Studio
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
                        ⛶ Full Bench
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ width: '100%', flex: 1, display: 'flex', alignItems: 'stretch', overflow: 'hidden', padding: '10px 0', gap: '16px' }}>
                  <div style={{ flex: showStudioWing ? '1.35' : '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflowY: 'auto', maxHeight: '100%' }}>
                    {simulatorNode}
                  </div>

                  {showStudioWing && (
                    <div style={{ flex: '1', maxWidth: '420px', background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                          <span style={{ fontSize: '18px' }}>🎙️</span>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            Instructor Telemetry & Field Notes
                          </span>
                        </div>

                        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 12px', marginBottom: '10px' }}>
                          <span style={{ fontSize: '10.5px', fontWeight: 800, color: color, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                            🎯 Video Demonstration Focus:
                          </span>
                          <p style={{ margin: 0, fontSize: '12px', color: '#334155', lineHeight: 1.5 }}>
                            {caseStudy?.speakingCue || 'Guide students through toggling physical inputs, observing instantaneous signal response and deterministic PLC scan execution.'}
                          </p>
                        </div>

                        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 12px' }}>
                          <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                            ⚡ Industrial Signal & Hardware Telemetry:
                          </span>
                          <div style={{ fontSize: '11.5px', color: '#475569', lineHeight: 1.6 }}>
                            <div>• <strong>PLC:</strong> SIMATIC S7-1200 CPU 1214C DC/DC/DC</div>
                            <div>• <strong>I/O Standard:</strong> 24VDC PNP, 4–20 mA (AI), 0–10V (AO)</div>
                            <div>• <strong>Fieldbus:</strong> PROFINET RT (Deterministic 1 ms cycle)</div>
                          </div>
                        </div>
                      </div>

                      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '10px 12px', fontSize: '11.5px', color: '#92400e', lineHeight: 1.5 }}>
                        💡 <strong>Instructor Cue:</strong> {caseStudy?.commonPitfall || 'Highlight the critical difference between closed-loop disturbance rejection and open-loop static scheduling.'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          }

          // Slide 5: Formative Micro-Quiz Assessment
          if (currentSlide === 4) {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span style={{ width: 4, height: 16, background: color, borderRadius: 99 }} />
                    <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase' }}>
                      FORMATIVE MICRO-QUIZ ASSESSMENT
                    </span>
                  </div>
                  <h2 style={{ fontSize: isLMSDisplay ? '22px' : '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Mastery Verification: {currentTopic.title}
                  </h2>
                </div>

                <div style={{ width: '100%', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '10px 0' }}>
                  <div style={{ width: '100%' }}>{quizNode}</div>
                </div>
              </div>
            );
          }

          return null;
        })()}

        {/* ── Slide Footer Hint ── */}
        <div style={{ fontSize: '12px', color: '#64748b', textAlign: 'right', fontWeight: 600, borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
          Slide {currentSlide + 1} of {currentTotalSlides} · Press <strong>Spacebar</strong> or <strong>→</strong> to advance
        </div>
      </div>

      {/* ── Bottom Navigation Bar ── */}
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
        <button
          onClick={handlePrev}
          disabled={currentSlide === 0}
          style={{
            padding: '7px 16px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            background: currentSlide === 0 ? '#f1f5f9' : '#ffffff',
            color: currentSlide === 0 ? '#94a3b8' : '#0f172a',
            fontSize: '12px',
            fontWeight: 700,
            cursor: currentSlide === 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>◀ Prev Slide</span>
        </button>

        {/* Dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#334155' }}>
            Slide {currentSlide + 1} / {currentTotalSlides}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            {Array.from({ length: currentTotalSlides }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                style={{
                  width: idx === currentSlide ? 22 : 8,
                  height: 8,
                  borderRadius: 99,
                  border: 'none',
                  background: idx === currentSlide ? color : '#cbd5e1',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.2s ease',
                }}
              />
            ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={currentSlide === currentTotalSlides - 1}
          style={{
            padding: '7px 20px',
            borderRadius: '8px',
            border: 'none',
            background: currentSlide === currentTotalSlides - 1 ? '#94a3b8' : color,
            color: '#ffffff',
            fontSize: '12px',
            fontWeight: 800,
            cursor: currentSlide === currentTotalSlides - 1 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: currentSlide === currentTotalSlides - 1 ? 'none' : `0 2px 8px ${color}33`,
          }}
        >
          <span>Next Slide ▶</span>
        </button>
      </div>

      {/* ── Topics Drawer Sidebar ── */}
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
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase' }}>Course Outline & Agenda</div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{lessonTitle}</div>
            </div>
            <button onClick={() => setDrawerOpen(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748b' }}>✕</button>
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
                  }}
                >
                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: isCurrent ? color : '#e2e8f0', color: isCurrent ? '#ffffff' : '#64748b', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {idx + 1}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div>{t.title}</div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>~{t.durationMinutes} mins · 5 Slides</div>
                  </div>
                </button>
              );
            })}
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
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: '92vw', maxHeight: '92vh', background: '#ffffff', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
              <button onClick={() => setZoomImage(null)} style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', fontWeight: 700 }}>✕ Close (Esc)</button>
            </div>
            <img src={asset(zoomImage)} alt="Zoomed schematic diagram" style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }} />
          </div>
        </div>
      )}
    </div>
  );
}
