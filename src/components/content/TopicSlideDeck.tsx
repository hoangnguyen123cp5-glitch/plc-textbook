'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { asset } from '@/lib/asset';
import { TopicCaseStudy } from '@/data/topic-case-studies';
import TopicVideoLabSlide from './TopicVideoLabSlide';

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

// 13 Pedagogical Topic Slide Tabs
const TOPIC_SLIDES = [
  { id: 0, label: 'CLO & Objectives', short: '1. CLO', icon: '🎯', category: 'CURRICULUM SPECIFICATION' },
  { id: 1, label: 'Industrial Motivation', short: '2. Motivation', icon: '🏭', category: 'ENGINEERING CONTEXT' },
  { id: 2, label: 'Core Theoretical Principle', short: '3. Core Theory', icon: '📖', category: 'FUNDAMENTAL THEORY' },
  { id: 3, label: 'System Schematics & Wiring', short: '4. Schematics', icon: '📊', category: 'PHYSICAL ARCHITECTURE' },
  { id: 4, label: 'Key Technical Principles', short: '5. Principles', icon: '💡', category: 'GOVERNING PRINCIPLES' },
  { id: 5, label: 'Mathematical Formulation', short: '6. Math Model', icon: '📐', category: 'ANALYTICAL FORMULATION' },
  { id: 6, label: 'Factory Case Study', short: '7. Case Study', icon: '🏢', category: 'INDUSTRIAL FIELD APPLICATION' },
  { id: 7, label: 'Video Lab Demonstration', short: '8. Video Lab', icon: '🎬', category: 'INTERLEAVED VIDEO DEMO' },
  { id: 8, label: 'Virtual Simulation Bench', short: '9. Virtual Lab', icon: '⚡', category: 'HANDS-ON SIMULATION' },
  { id: 9, label: 'Commissioning SOP', short: '10. SOP Checklist', icon: '📋', category: 'FIELD COMMISSIONING' },
  { id: 10, label: 'Fault Diagnostics', short: '11. Diagnostics', icon: '🔍', category: 'TROUBLESHOOTING & REPAIR' },
  { id: 11, label: 'Formative Micro-Quiz', short: '12. Micro-Quiz', icon: '📝', category: 'FORMATIVE ASSESSMENT' },
  { id: 12, label: 'Executive Summary', short: '13. Summary', icon: '🎓', category: 'COMPETENCY MASTERY' },
];

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
  const [deckMode, setDeckMode] = useState<'topic' | 'chapter'>('topic'); // Default to structured 13-slide topic deck
  const [currentSlide, setCurrentSlide] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [simulatorLayout, setSimulatorLayout] = useState<'split' | 'full'>('split');

  // Chapter Deck Slides count:
  // Slide 0: Cover & Course Learning Outcomes (CLO)
  // Slide 1..N: Curriculum Sections (1.1, 1.2, 1.3...)
  // Slide N+1: Practical Video Lab Walkthrough
  // Slide N+2: Interactive Virtual Simulation Bench
  // Slide N+3: Field Commissioning & Safety Checklist
  // Slide N+4: Fault Diagnostics & Troubleshooting Guide
  // Slide N+5: Formative Micro-Quiz Assessment
  // Slide N+6: Module Summary & Certification Checklist
  const chapterSections = allSections.length > 0 ? allSections : (section ? [section] : []);
  const totalChapterSlides = chapterSections.length + 7; // Cover + N Sections + Video Lab + Virtual Bench + SOP + Diag + Quiz + Summary

  const currentTotalSlides = deckMode === 'topic' ? TOPIC_SLIDES.length : totalChapterSlides;

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
      } else if (deckMode === 'topic') {
        const keyNum = parseInt(e.key);
        if (!isNaN(keyNum) && keyNum >= 1 && keyNum <= 9) {
          setCurrentSlide(keyNum - 1);
        } else if (e.key === '0') {
          setCurrentSlide(9);
        } else if (e.key === '-') {
          setCurrentSlide(10);
        } else if (e.key === '=') {
          setCurrentSlide(11);
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
              {lessonTitle} · {deckMode === 'topic' ? `Topic Focus (${currentSlide + 1}/${TOPIC_SLIDES.length}): ${currentTopic.title}` : `Full Chapter Deck (${currentSlide + 1}/${totalChapterSlides})`}
            </div>
          </div>
        </div>

        {/* Right: Mode Switcher, Instructor Configuration, Studio & Fullscreen */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Deck Mode Toggle: Topic Focus Deck (13 Slides) vs Chapter Master Deck */}
          <div style={{ display: 'flex', background: isLMSDisplay ? '#1e293b' : '#f1f5f9', padding: '2px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <button
              onClick={() => {
                setDeckMode('topic');
                setCurrentSlide(0);
              }}
              title="13-Slide in-depth focused deck with interleaved video lab & virtual bench"
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
              🎯 Topic Deck (13 Slides)
            </button>
            <button
              onClick={() => {
                setDeckMode('chapter');
                setCurrentSlide(0);
              }}
              title="Full module lecture deck sequencing across all curriculum topics (Broadcast master deck)"
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

      {/* ── Sub-Tabs Bar: Interactive Slide Navigation Strip ── */}
      {deckMode === 'topic' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 20px',
            background: isLMSDisplay ? '#f1f5f9' : '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            gap: '6px',
            overflowX: 'auto',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'nowrap' }}>
            {TOPIC_SLIDES.map(tab => {
              const isActive = currentSlide === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentSlide(tab.id)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: isActive ? `1.5px solid ${color}` : '1px solid #e2e8f0',
                    background: isActive ? `${color}18` : '#ffffff',
                    color: isActive ? color : '#475569',
                    fontSize: '11.5px',
                    fontWeight: isActive ? 800 : 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap',
                    boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ fontSize: '13px' }}>{tab.icon}</span>
                  <span>{tab.short}</span>
                </button>
              );
            })}
          </div>

          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, whiteSpace: 'nowrap', marginLeft: '8px' }}>
            Keys: <strong>1..9</strong>, <strong>0, -, =</strong> · <strong>← / →</strong> · <strong>P</strong> (Instructor)
          </div>
        </div>
      )}

      {/* ── Main Slide Stage (ZERO VERTICAL SCROLLBAR: Fits 100% into the 16:9 frame) ── */}
      <div
        style={{
          flex: 1,
          padding: isLMSDisplay ? '20px 32px' : '16px 24px',
          overflow: 'hidden',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* ════════════════════════════════════════════════════════════════════
           A. TOPIC FOCUS DECK MODE (13 STRUCTURED INTERACTIVE SLIDES)
        ════════════════════════════════════════════════════════════════════ */}
        {deckMode === 'topic' && (() => {
          // Slide 0: CLO & Objectives
          if (currentSlide === 0) {
            return (
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', alignItems: 'center', height: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: 4, height: 22, background: color, borderRadius: 99 }} />
                    <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {TOPIC_SLIDES[0].category} · TOPIC {currentIndex + 1} OF {topics.length}
                    </span>
                  </div>

                  <h1 style={{ fontSize: isLMSDisplay ? '30px' : '24px', fontWeight: 900, color: '#0f172a', margin: 0, lineHeight: 1.25 }}>
                    {currentTopic.title}
                  </h1>

                  <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '16px 20px', borderLeft: `5px solid ${color}` }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', marginBottom: '6px' }}>
                      🎯 Targeted Course Learning Outcomes (CLO):
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: '#334155', lineHeight: 1.65 }}>
                      Upon completion of this topic, engineering students will master the physical signal transduction, programming constraints, and commissioning protocols for <strong>{currentTopic.title}</strong> in compliance with industrial automation standards.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', background: '#f1f5f9', border: '1px solid #cbd5e1' }}>
                      ⏱️ Duration: ~{currentTopic.durationMinutes} Mins
                    </span>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', background: '#f1f5f9', border: '1px solid #cbd5e1' }}>
                      ⚡ Virtual Bench Lab
                    </span>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', background: '#f1f5f9', border: '1px solid #cbd5e1' }}>
                      🎬 Practical Video Walkthrough
                    </span>
                  </div>
                </div>

                {/* Right: Competency Roadmap */}
                <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '18px 22px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
                    📋 13-Slide Pedagogical Sequence:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', maxHeight: '380px', overflowY: 'auto' }}>
                    {TOPIC_SLIDES.map((ts) => (
                      <div
                        key={ts.id}
                        onClick={() => setCurrentSlide(ts.id)}
                        style={{
                          padding: '7px 10px',
                          borderRadius: '8px',
                          background: currentSlide === ts.id ? `${color}18` : '#ffffff',
                          border: currentSlide === ts.id ? `1.5px solid ${color}` : '1px solid #e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                        }}
                      >
                        <span style={{ fontSize: '14px' }}>{ts.icon}</span>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a' }}>{ts.short}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          }

          // Slide 1: Industrial Motivation & Background
          if (currentSlide === 1) {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ width: 4, height: 16, background: color, borderRadius: 99 }} />
                    <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase' }}>
                      {TOPIC_SLIDES[1].category}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Engineering Motivation & Historical Industry Drivers: {currentTopic.title}
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', flex: 1, alignItems: 'stretch', margin: '12px 0' }}>
                  <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '18px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                        🏭 The Industrial Challenge:
                      </span>
                      <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0' }}>
                        Overcoming Rigid Hardware Constraints & Plant Downtime
                      </h3>
                      <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.65, margin: 0 }}>
                        {section?.content ? section.content.split('. ').slice(0, 3).join('. ') + '.' : 'Before software-driven automation, industrial plants incurred massive economic losses and extensive downtime due to hardwired electromechanical fatigue and lack of real-time diagnostic visibility.'}
                      </p>
                    </div>

                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 14px' }}>
                      <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                        💡 Industrial Value Creation:
                      </span>
                      <div style={{ fontSize: '12px', color: '#334155', lineHeight: 1.5 }}>
                        Eliminates hardwired relays, reduces panel footprint by &gt;80%, guarantees deterministic microsecond execution, and integrates seamlessly with enterprise SCADA / MES networks.
                      </div>
                    </div>
                  </div>

                  <div style={{ background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: '12px', padding: '18px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase', marginBottom: '8px' }}>
                      ⚡ Benchmark Comparison:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ background: '#ffffff', border: '1px solid #dbeafe', borderRadius: '8px', padding: '10px 12px' }}>
                        <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#991b1b', marginBottom: '2px' }}>❌ Legacy Approach</div>
                        <div style={{ fontSize: '11px', color: '#475569' }}>Mechanical relay interlocks, manual copper rewiring, high downtime, zero digital telemetry.</div>
                      </div>
                      <div style={{ background: '#ffffff', border: '1px solid #dbeafe', borderRadius: '8px', padding: '10px 12px' }}>
                        <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#16a34a', marginBottom: '2px' }}>✅ Modern PLC Architecture</div>
                        <div style={{ fontSize: '11px', color: '#475569' }}>Solid-state microprocessor logic, online program modification, PROFINET connectivity, automated fail-safe.</div>
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
                <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ width: 4, height: 16, background: color, borderRadius: 99 }} />
                    <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase' }}>
                      {TOPIC_SLIDES[2].category}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Theoretical Foundation: {currentTopic.title}
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', flex: 1, alignItems: 'stretch', margin: '12px 0' }}>
                  <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '18px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                        📖 Scientific & Engineering Formulation:
                      </span>
                      <p style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.7, margin: 0 }}>
                        {section?.content || 'Comprehensive engineering theory governing signal acquisition, deterministic processing, and output driver actuation.'}
                      </p>
                    </div>

                    {section?.note && (
                      <div style={{ padding: '10px 14px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', fontSize: '12px', color: '#92400e', lineHeight: 1.5 }}>
                        💡 <strong>Engineering Note:</strong> {section.note}
                      </div>
                    )}
                  </div>

                  <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', marginBottom: '8px' }}>
                      ⚡ Signal Transduction Path:
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'monospace', fontSize: '11.5px' }}>
                      <div style={{ padding: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                        1. Physical Variable ➔ Sensor Transducer
                      </div>
                      <div style={{ padding: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                        2. 24VDC / 4–20 mA ➔ Optocoupler Isolation
                      </div>
                      <div style={{ padding: '8px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', color: '#1d4ed8', fontWeight: 700 }}>
                        3. Process Image Register (PII) ➔ CPU OB1
                      </div>
                      <div style={{ padding: '8px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', color: '#15803d', fontWeight: 700 }}>
                        4. Output Memory (PIQ) ➔ Transistor / Relay Load
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Slide 3: System Schematics & Wiring
          if (currentSlide === 3) {
            return (
              <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: isLMSDisplay ? '36px' : '24px', alignItems: 'center', height: '100%', overflow: 'hidden' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', justifyContent: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <span style={{ width: 4, height: 16, background: color, borderRadius: 99 }} />
                      <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase' }}>
                        {TOPIC_SLIDES[3].category}
                      </span>
                    </div>
                    <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      Electrical Wiring & Hardware Schematics: {currentTopic.title}
                    </h2>
                  </div>

                  <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '16px 20px', borderLeft: `5px solid ${color}` }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', marginBottom: '6px' }}>
                      ⚡ Field Terminal Architecture:
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: '#334155', lineHeight: 1.65 }}>
                      Industrial discrete inputs utilize 24VDC PNP sinking/sourcing circuits isolated via high-speed 500V optocouplers. Analog channels feature shielded twisted-pair routing with 0–10V or 4–20 mA current loops.
                    </p>
                  </div>

                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 14px', fontSize: '11.5px', color: '#475569' }}>
                    🔍 <strong>Wiring Rule:</strong> Always strap terminal 1M to power supply 0VDC for standard European Type 1 sinking inputs.
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '16px', height: '100%', maxHeight: isLMSDisplay ? '62vh' : '440px' }}>
                  {diagram ? (
                    <>
                      <div onClick={() => setZoomImage(diagram.src)} style={{ width: '100%', height: '85%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-in' }} title="Click to zoom schematic">
                        <img src={asset(diagram.src)} alt={diagram.caption} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }} />
                      </div>
                      <p style={{ fontSize: '11.5px', color: '#475569', marginTop: '8px', fontStyle: 'italic', textAlign: 'center', lineHeight: 1.35, fontWeight: 500 }}>
                        {diagram.caption}
                      </p>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', color: '#64748b' }}>
                      <span style={{ fontSize: '38px', display: 'block', marginBottom: '8px' }}>📊</span>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>Technical Schematic Diagram</span>
                    </div>
                  )}
                </div>
              </div>
            );
          }

          // Slide 4: Key Technical Principles
          if (currentSlide === 4) {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ width: 4, height: 16, background: color, borderRadius: 99 }} />
                    <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase' }}>
                      {TOPIC_SLIDES[4].category}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Core Engineering Principles · {currentTopic.title}
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
                            <strong style={{ color: '#0f172a', fontSize: '13.5px' }}>{title}</strong>
                          </div>
                          {desc && (
                            <div style={{ color: '#334155', fontSize: '12px', lineHeight: 1.55, paddingLeft: '34px' }}>{desc}</div>
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

          // Slide 5: Mathematical Formulation
          if (currentSlide === 5) {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ width: 4, height: 16, background: color, borderRadius: 99 }} />
                    <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase' }}>
                      {TOPIC_SLIDES[5].category}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Analytical Formulations & Constraints: {currentTopic.title}
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', flex: 1, alignItems: 'stretch', margin: '12px 0' }}>
                  <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '18px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                        📐 Primary Governing Equation:
                      </span>
                      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px 18px', fontFamily: 'Consolas, monospace', fontSize: '14px', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
                        {caseStudy?.keyFormulaOrMetric || 'e(t) = SP(t) − PV(t) | Scan Cycle T_scan = T_input + T_logic + T_diag + T_output <= 10 ms'}
                      </div>
                      <p style={{ fontSize: '12.5px', color: '#334155', lineHeight: 1.6, margin: 0 }}>
                        Deterministic execution requires that the worst-case cycle time $T_{'{scan}'}$ remains strictly below the maximum watchdog threshold (typically 150 ms default in TIA Portal, engineered for &lt; 10 ms in real-time control).
                      </p>
                    </div>

                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 14px', fontSize: '11.5px', color: '#475569' }}>
                      📊 <strong>Nyquist Sampling Criterion:</strong> Input sampling frequency must exceed $2 \times f_{'{max}'}$ of physical process dynamics to prevent signal aliasing.
                    </div>
                  </div>

                  <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>
                      ⚡ Real-Time Parameter Constraints:
                    </span>
                    <div style={{ padding: '8px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '11.5px' }}>
                      • <strong>Cycle Scan Jitter:</strong> &lt; 100 μs on Siemens S7-1200 CPU
                    </div>
                    <div style={{ padding: '8px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '11.5px' }}>
                      • <strong>Analog Resolution:</strong> 12-bit to 16-bit (0..27648 raw counts)
                    </div>
                    <div style={{ padding: '8px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '11.5px' }}>
                      • <strong>Optocoupler Propagation Delay:</strong> 0.2 ms to 12.8 ms (configurable RC filter)
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
                <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ width: 4, height: 16, background: color, borderRadius: 99 }} />
                    <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase' }}>
                      {TOPIC_SLIDES[6].category}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Factory Implementation: {currentTopic.title}
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: '20px', flex: 1, alignItems: 'stretch', margin: '12px 0' }}>
                  <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '18px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px', display: 'block' }}>
                        🏭 Authentic Field Case Study:
                      </span>
                      <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                        {caseStudy?.caseTitle || `Industrial Plant Application: ${currentTopic.title}`}
                      </h3>
                      <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.65, margin: 0 }}>
                        {caseStudy?.industryApplication || section?.content}
                      </p>
                    </div>

                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 14px' }}>
                      <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                        📐 Primary Plant Metric:
                      </span>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', fontFamily: 'monospace' }}>
                        {caseStudy?.keyFormulaOrMetric || 'Downtime Reduction: > 92% | MTBF: > 100,000 Operating Hours'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'space-between' }}>
                    {isInstructorMode ? (
                      <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <span style={{ fontSize: '16px' }}>🎙️</span>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>
                            Lecturer Speaking Cue (LMS Video Prompt):
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#1e3a8a', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '10px 12px', lineHeight: 1.6 }}>
                          "{caseStudy?.speakingCue || `Explain the operational mechanics of ${currentTopic.title}, emphasizing the signal transduction path, deterministic cycle, and contrast with legacy hardwired relay logic.`}"
                        </p>
                      </div>
                    ) : (
                      <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                          🛡️ Commissioning Standards & Best Practices:
                        </span>
                        <div style={{ fontSize: '12px', color: '#334155', lineHeight: 1.6 }}>
                          Compliant with IEC 61131-2 industrial equipment safety standards, galvanic signal isolation (&gt;500 VAC), and physical segregation between 24VDC logic and 400VAC actuator loads.
                        </div>
                      </div>
                    )}

                    <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                        ⚡ Deployed Field Hardware Specifications:
                      </span>
                      <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11.5px', color: '#475569', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        {(caseStudy?.fieldHardware || [
                          'CPU: Siemens SIMATIC S7-1200 1214C DC/DC/DC',
                          'Signal Standard: 24VDC PNP, 4–20 mA Analog, PROFINET RT',
                        ]).map((hw, hIdx) => (
                          <li key={hIdx}>{hw}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '10px 14px', fontSize: '11.5px', color: '#92400e', lineHeight: 1.5 }}>
                      ⚠️ <strong>Field Commissioning Lesson:</strong> {caseStudy?.commonPitfall || 'Always ensure protective earth (PE) grounding impedance is < 10 ohms and isolated from DC control common M.'}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Slide 7: 🎬 INTERLEAVED PRACTICAL VIDEO LAB DEMONSTRATION
          if (currentSlide === 7) {
            return (
              <TopicVideoLabSlide
                lessonSlug={lessonSlug}
                topicSlug={currentTopic.slug}
                topicTitle={currentTopic.title}
                color={color}
                caseStudy={caseStudy}
                isInstructorMode={isInstructorMode}
              />
            );
          }

          // Slide 8: ⚡ HANDS-ON VIRTUAL LAB BENCH (Interactive Simulator)
          if (currentSlide === 8) {
            const showStudioWing = isInstructorMode && simulatorLayout === 'split';

            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      <span style={{ width: 4, height: 16, background: color, borderRadius: 99 }} />
                      <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase' }}>
                        {TOPIC_SLIDES[8].category}
                      </span>
                    </div>
                    <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      Interactive Virtual Bench: {currentTopic.title}
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

          // Slide 9: Commissioning SOP Checklist
          if (currentSlide === 9) {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ width: 4, height: 16, background: color, borderRadius: 99 }} />
                    <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase' }}>
                      {TOPIC_SLIDES[9].category}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Standard Operating Procedure (SOP) & Commissioning Protocol
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', flex: 1, alignContent: 'center', margin: '14px 0' }}>
                  <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#0284c7', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, marginBottom: '8px' }}>1</div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Cold Inspection</div>
                      <p style={{ margin: 0, fontSize: '11.5px', color: '#475569', lineHeight: 1.5 }}>
                        De-energized continuity test. Verify PE impedance &lt; 10Ω, torque screw terminals, check cable shields.
                      </p>
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#0284c7' }}>STATUS: PASS</span>
                  </div>

                  <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#0284c7', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, marginBottom: '8px' }}>2</div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Power Energization</div>
                      <p style={{ margin: 0, fontSize: '11.5px', color: '#475569', lineHeight: 1.5 }}>
                        Apply 24VDC control voltage. Measure bus voltage (20.4–28.8 VDC tolerance) and verify CPU internal regulator.
                      </p>
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#0284c7' }}>STATUS: PASS</span>
                  </div>

                  <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#0284c7', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, marginBottom: '8px' }}>3</div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>I/O Point Loop Check</div>
                      <p style={{ margin: 0, fontSize: '11.5px', color: '#475569', lineHeight: 1.5 }}>
                        Force individual outputs, trigger physical limit switches, confirm DI/DO LED illumination, check 4mA zero offset.
                      </p>
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#0284c7' }}>STATUS: PASS</span>
                  </div>

                  <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#16a34a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, marginBottom: '8px' }}>4</div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Online Program Run</div>
                      <p style={{ margin: 0, fontSize: '11.5px', color: '#475569', lineHeight: 1.5 }}>
                        Download TIA Portal user blocks, set CPU to RUN, monitor scan time in Diagnostic Buffer, verify E-Stop interlock.
                      </p>
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#16a34a' }}>STATUS: READY</span>
                  </div>
                </div>
              </div>
            );
          }

          // Slide 10: Fault Diagnostics & Troubleshooting
          if (currentSlide === 10) {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ width: 4, height: 16, background: color, borderRadius: 99 }} />
                    <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase' }}>
                      {TOPIC_SLIDES[10].category}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Industrial Fault Diagnostics & Root-Cause Matrix
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', flex: 1, alignContent: 'center', margin: '12px 0' }}>
                  <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: '10px', padding: '14px 16px' }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#991b1b', marginBottom: '6px' }}>
                      ⚠️ Contact Bounce & False Triggers
                    </div>
                    <p style={{ margin: '0 0 8px 0', fontSize: '11.5px', color: '#7f1d1d', lineHeight: 1.5 }}>
                      Mechanical contacts oscillate for 2–5 ms upon closure, causing high-speed counters to miscount spurious pulses.
                    </p>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#15803d', background: '#ffffff', padding: '6px 8px', borderRadius: '4px', border: '1px solid #86efac' }}>
                      🔧 Fix: Configure TIA Portal DI input filter time (6.4 ms default) or use hardware debouncing.
                    </div>
                  </div>

                  <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: '10px', padding: '14px 16px' }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#b45309', marginBottom: '6px' }}>
                      ⚠️ Ground Loop 50Hz Hum on Analog (AI)
                    </div>
                    <p style={{ margin: '0 0 8px 0', fontSize: '11.5px', color: '#78350f', lineHeight: 1.5 }}>
                      Multiple ground ties at sensor and panel create circulating current in cable shields, skewing 4–20 mA readings by &gt; 15%.
                    </p>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#15803d', background: '#ffffff', padding: '6px 8px', borderRadius: '4px', border: '1px solid #86efac' }}>
                      🔧 Fix: Ground cable shield at PLC cabinet end ONLY; float sensor-side shield.
                    </div>
                  </div>

                  <div style={{ background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: '10px', padding: '14px 16px' }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#1d4ed8', marginBottom: '6px' }}>
                      ⚠️ Watchdog Timeout Error (OB80)
                    </div>
                    <p style={{ margin: '0 0 8px 0', fontSize: '11.5px', color: '#1e3a8a', lineHeight: 1.5 }}>
                      Infinite WHILE loops or slow communication blocks in OB1 exceed the 150 ms watchdog, triggering a CPU STOP fault.
                    </p>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#15803d', background: '#ffffff', padding: '6px 8px', borderRadius: '4px', border: '1px solid #86efac' }}>
                      🔧 Fix: Remove blocking loops; offload heavy computations to cyclic OB30 interrupts.
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Slide 11: Formative Micro-Quiz
          if (currentSlide === 11) {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ width: 4, height: 16, background: color, borderRadius: 99 }} />
                    <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase' }}>
                      {TOPIC_SLIDES[11].category}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Mastery Verification: {currentTopic.title}
                  </h2>
                </div>

                <div style={{ width: '100%', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '10px 0' }}>
                  <div style={{ width: '100%' }}>{quizNode}</div>
                </div>
              </div>
            );
          }

          // Slide 12: Executive Summary & Learning Mastery
          if (currentSlide === 12) {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ width: 4, height: 16, background: color, borderRadius: 99 }} />
                    <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase' }}>
                      {TOPIC_SLIDES[12].category}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Summary & Industrial Action Checklist: {currentTopic.title}
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', flex: 1, alignItems: 'stretch', margin: '12px 0' }}>
                  <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '12px', padding: '18px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#166534', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                        ✅ Verified Competencies (Bloom Level 4 - Analysis):
                      </span>
                      <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12.5px', color: '#14532d', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <li>• Explain the 5 fundamental elements of automated control architectures.</li>
                        <li>• Analyze the electrical isolation and physical signal flow across S7-1200 I/O.</li>
                        <li>• Apply deterministic scan cycle principles to eliminate race conditions.</li>
                        <li>• Commission, troubleshoot, and verify field wiring according to IEC 61131 standards.</li>
                      </ul>
                    </div>

                    <div style={{ background: '#ffffff', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px 14px', fontSize: '11.5px', color: '#166534' }}>
                      🎓 <strong>Course Progress:</strong> Topic {currentIndex + 1} of {topics.length} completed. Ready for subsequent curriculum module.
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '18px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>
                      📚 Industrial Compliance Standards:
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#475569', lineHeight: 1.6 }}>
                      <div>• <strong>IEC 61131-2:</strong> Equipment requirements and tests</div>
                      <div>• <strong>IEC 61131-3:</strong> Programming languages standard</div>
                      <div>• <strong>NEMA ICS 3:</strong> Industrial systems and controllers</div>
                      <div>• <strong>NFPA 79:</strong> Electrical standard for industrial machinery</div>
                    </div>

                    {isInstructorMode && (
                      <div style={{ padding: '8px 12px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', fontSize: '11px', color: '#1d4ed8' }}>
                        🎥 <strong>Instructor LMS Status:</strong> Full 13-slide topic deck ready for video recording.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          return null;
        })()}

        {/* ════════════════════════════════════════════════════════════════════
           B. FULL CHAPTER MASTER LECTURE DECK MODE (16-20 SLIDES CONTINUOUS)
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
                      🎬 Practical Video Demonstration
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 700, padding: '4px 12px', borderRadius: '6px', background: '#f1f5f9', border: '1px solid #cbd5e1' }}>
                      ⚡ Interactive Virtual Bench
                    </span>
                  </div>
                </div>

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

                  <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '16px 20px', borderLeft: `5px solid ${color}` }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', marginBottom: '6px' }}>
                      📌 Core Engineering Principles:
                    </div>
                    <p style={{ margin: 0, fontSize: isLMSDisplay ? '14px' : '13px', color: '#334155', lineHeight: 1.65 }}>
                      {currentSec.content}
                    </p>
                  </div>

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

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '16px', height: '100%', maxHeight: isLMSDisplay ? '62vh' : '440px' }}>
                  {secDiagram ? (
                    <>
                      <div onClick={() => setZoomImage(secDiagram.src)} style={{ width: '100%', height: '85%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-in' }} title="Click to zoom schematic">
                        <img src={asset(secDiagram.src)} alt={secDiagram.caption} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }} />
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

          // Slide N+1: Practical Video Lab Walkthrough
          if (currentSlide === chapterSections.length + 1) {
            return (
              <TopicVideoLabSlide
                lessonSlug={lessonSlug}
                topicSlug={currentTopic.slug}
                topicTitle={lessonTitle}
                color={color}
                caseStudy={caseStudy}
                isInstructorMode={isInstructorMode}
              />
            );
          }

          // Slide N+2: Interactive Virtual Simulation Bench
          if (currentSlide === chapterSections.length + 2) {
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

          // Slide N+3: Field Commissioning & Safety Checklist
          if (currentSlide === chapterSections.length + 3) {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ width: 4, height: 16, background: color, borderRadius: 99 }} />
                    <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase' }}>
                      FIELD COMMISSIONING & SAFETY PROCEDURE
                    </span>
                  </div>
                  <h2 style={{ fontSize: isLMSDisplay ? '22px' : '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Master Commissioning Checklist: {lessonTitle}
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', flex: 1, alignContent: 'center', margin: '14px 0' }}>
                  <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '16px' }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#0284c7', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, marginBottom: '8px' }}>1</div>
                    <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Cold Isolation</div>
                    <div style={{ fontSize: '11px', color: '#475569', lineHeight: 1.5 }}>Verify 24VDC zero voltage, PE continuity &lt; 10Ω, and check screw torque.</div>
                  </div>
                  <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '16px' }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#0284c7', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, marginBottom: '8px' }}>2</div>
                    <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Power Energization</div>
                    <div style={{ fontSize: '11px', color: '#475569', lineHeight: 1.5 }}>Apply 24VDC power, verify SITOP PSU stability, and check CPU status LEDs.</div>
                  </div>
                  <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '16px' }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#0284c7', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, marginBottom: '8px' }}>3</div>
                    <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>I/O Point Check</div>
                    <div style={{ fontSize: '11px', color: '#475569', lineHeight: 1.5 }}>Test discrete switches, force outputs in TIA Portal, calibrate 4–20 mA loops.</div>
                  </div>
                  <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '16px' }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#16a34a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, marginBottom: '8px' }}>4</div>
                    <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Logic RUN Mode</div>
                    <div style={{ fontSize: '11px', color: '#475569', lineHeight: 1.5 }}>Download OB1 blocks, set CPU to RUN, monitor scan cycle, test emergency stop.</div>
                  </div>
                </div>
              </div>
            );
          }

          // Slide N+4: Fault Diagnostics & Troubleshooting Guide
          if (currentSlide === chapterSections.length + 4) {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ width: 4, height: 16, background: color, borderRadius: 99 }} />
                    <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase' }}>
                      FAULT DIAGNOSTICS & TROUBLESHOOTING GUIDE
                    </span>
                  </div>
                  <h2 style={{ fontSize: isLMSDisplay ? '22px' : '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Diagnostic Protocols & CPU Error Handling: {lessonTitle}
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', flex: 1, alignContent: 'center', margin: '14px 0' }}>
                  <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: '10px', padding: '14px 16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#991b1b', marginBottom: '6px' }}>
                      🚨 Hardware Diagnostic Interrupt (OB82)
                    </div>
                    <div style={{ fontSize: '11px', color: '#7f1d1d', lineHeight: 1.5 }}>
                      Triggered automatically upon wire break, supply undervoltage, or short-circuit on analog and diagnostic-capable discrete channels.
                    </div>
                  </div>
                  <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: '10px', padding: '14px 16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#b45309', marginBottom: '6px' }}>
                      ⚠️ Cycle Time Fault (OB80)
                    </div>
                    <div style={{ fontSize: '11px', color: '#78350f', lineHeight: 1.5 }}>
                      Generated when user logic execution exceeds the configured scan cycle watchdog (150 ms default), preventing infinite loops.
                    </div>
                  </div>
                  <div style={{ background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: '10px', padding: '14px 16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#1d4ed8', marginBottom: '6px' }}>
                      🛡️ PROFINET Station Failure (OB86)
                    </div>
                    <div style={{ fontSize: '11px', color: '#1e3a8a', lineHeight: 1.5 }}>
                      Fires when a distributed I/O station (ET 200SP, VFD, or HMI) drops communication packets on the industrial Ethernet ring.
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Slide N+5: Formative Micro-Quiz Assessment
          if (currentSlide === chapterSections.length + 5) {
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

          // Slide N+6: Module Summary & Action Takeaways
          if (currentSlide === chapterSections.length + 6) {
            return (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ width: 4, height: 16, background: color, borderRadius: 99 }} />
                    <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase' }}>
                      MODULE SYNTHESIS & COMPETENCY MASTERY
                    </span>
                  </div>
                  <h2 style={{ fontSize: isLMSDisplay ? '22px' : '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Chapter Summary & Action Checklist: {lessonTitle}
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', flex: 1, alignItems: 'stretch', margin: '14px 0' }}>
                  <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '12px', padding: '18px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#166534', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                        🎓 Comprehensive Module Competencies:
                      </span>
                      <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12.5px', color: '#14532d', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <li>• Complete coverage of all {chapterSections.length} core curriculum topics.</li>
                        <li>• Hands-on proficiency verified via interactive simulation benches.</li>
                        <li>• Wiring, diagnostic, and programming compliance with IEC 61131 standards.</li>
                        <li>• Prepared for practical industrial deployment and professional laboratory evaluation.</li>
                      </ul>
                    </div>

                    <div style={{ background: '#ffffff', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px 14px', fontSize: '11.5px', color: '#166534' }}>
                      🏆 <strong>Module Status:</strong> All curriculum sections synthesized. Broadcast deck complete.
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '18px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>
                      ⚡ Next Learning Milestones:
                    </div>
                    <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
                      Proceed to the subsequent course module in TIA Portal or explore advanced high-speed counter (HSC) and closed-loop PID control architectures.
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return null;
        })()}

        {/* ── Slide Footer Hint ── */}
        <div style={{ fontSize: '11.5px', color: '#64748b', textAlign: 'right', fontWeight: 600, borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {Array.from({ length: currentTotalSlides }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                style={{
                  width: idx === currentSlide ? 18 : 6,
                  height: 6,
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
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>~{t.durationMinutes} mins · 13 Slides</div>
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
