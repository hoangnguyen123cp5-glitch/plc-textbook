'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const LessonSectionAnimation = dynamic(() => import('@/components/animations/LessonSectionAnimation'), { ssr: false });
const S7RackExplorer = dynamic(() => import('@/components/animations/S7RackExplorer'), { ssr: false });
const TIALadderAnimation = dynamic(() => import('@/components/animations/TIALadderAnimation'), { ssr: false });
const DataTypeExplorer = dynamic(() => import('@/components/animations/LessonAnimationsNew').then(m => m.DataTypeExplorer), { ssr: false });
const AnalogScaleAnimation = dynamic(() => import('@/components/animations/LessonAnimationsNew').then(m => m.AnalogScaleAnimation), { ssr: false });
const FCFBVisualizer = dynamic(() => import('@/components/animations/LessonAnimationsNew').then(m => m.FCFBVisualizer), { ssr: false });
const PWMVisualizer = dynamic(() => import('@/components/animations/LessonAnimationsNew').then(m => m.PWMVisualizer), { ssr: false });
const PIDVisualizer = dynamic(() => import('@/components/animations/LessonAnimationsNew').then(m => m.PIDVisualizer), { ssr: false });
const ProfinetDemo = dynamic(() => import('@/components/animations/LessonAnimationsNew').then(m => m.ProfinetDemo), { ssr: false });
const DiagnosticPanel = dynamic(() => import('@/components/animations/LessonAnimationsNew').then(m => m.DiagnosticPanel), { ssr: false });
const CapstoneArchitecture = dynamic(() => import('@/components/animations/LessonAnimationsNew').then(m => m.CapstoneArchitecture), { ssr: false });

interface Props {
  lessonSlug: string;
  topicSlug: string;
  topicIndex: number;
  topicTitle: string;
}

export default function TopicAnimationWrapper({ lessonSlug, topicSlug, topicIndex, topicTitle }: Props) {
  // Lesson 1 specific section animations
  if (lessonSlug === '01-programmable-control') {
    if (topicSlug === 'control-system-basics' || topicIndex === 0) {
      return (
        <div style={{ marginTop: '24px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#a3a3a3', textTransform: 'uppercase', marginBottom: '10px' }}>
            🎬 Interactive Architecture Simulator
          </p>
          <LessonSectionAnimation slug={lessonSlug} sectionIndex={0} sectionTitle={topicTitle} />
        </div>
      );
    }
    if (topicSlug === 'loop-types' || topicIndex === 1) {
      return (
        <div style={{ marginTop: '24px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#a3a3a3', textTransform: 'uppercase', marginBottom: '10px' }}>
            🎬 Interactive Closed-Loop Simulator
          </p>
          <LessonSectionAnimation slug={lessonSlug} sectionIndex={1} sectionTitle={topicTitle} />
        </div>
      );
    }
    if (topicSlug === 'hardwired-vs-programmable' || topicIndex === 2) {
      return (
        <div style={{ marginTop: '24px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#a3a3a3', textTransform: 'uppercase', marginBottom: '10px' }}>
            🎬 Relay vs PLC Hardware Comparison
          </p>
          <LessonSectionAnimation slug={lessonSlug} sectionIndex={2} sectionTitle={topicTitle} />
        </div>
      );
    }
    if (topicSlug === 'scan-cycle' || topicIndex === 7) {
      return (
        <div style={{ marginTop: '24px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#a3a3a3', textTransform: 'uppercase', marginBottom: '10px' }}>
            🎬 4-Phase PLC Scan Cycle Simulator
          </p>
          <LessonSectionAnimation slug={lessonSlug} sectionIndex={7} sectionTitle={topicTitle} />
        </div>
      );
    }
    if (topicSlug === 'plc-structure' || topicSlug === 'memory-and-leds' || topicIndex === 5 || topicIndex === 6) {
      return (
        <div style={{ marginTop: '24px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#a3a3a3', textTransform: 'uppercase', marginBottom: '10px' }}>
            🖥️ S7-1200 Hardware Anatomy & Diagnostic LEDs
          </p>
          <S7RackExplorer />
        </div>
      );
    }
  }

  // Lesson 2: S7-1200 Hardware and Wiring
  if (lessonSlug === '02-s7-1200-tia-portal') {
    return (
      <div style={{ marginTop: '24px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#a3a3a3', textTransform: 'uppercase', marginBottom: '10px' }}>
          🖥️ SIMATIC S7-1200 Modular Rack Explorer
        </p>
        <S7RackExplorer />
      </div>
    );
  }

  // Lesson 3: Ladder Logic
  if (lessonSlug === '03-binary-operations') {
    return (
      <div style={{ marginTop: '24px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#a3a3a3', textTransform: 'uppercase', marginBottom: '10px' }}>
          ⚡ TIA Portal Ladder Logic Simulator
        </p>
        <TIALadderAnimation />
      </div>
    );
  }

  // Lesson 4: Data types
  if (lessonSlug === '04-numeric-operations') {
    return (
      <div style={{ marginTop: '24px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#a3a3a3', textTransform: 'uppercase', marginBottom: '10px' }}>
          📊 PLC Numeric Data Types Explorer
        </p>
        <DataTypeExplorer />
      </div>
    );
  }

  // Lesson 5: Analog
  if (lessonSlug === '05-analog-signals') {
    return (
      <div style={{ marginTop: '24px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#a3a3a3', textTransform: 'uppercase', marginBottom: '10px' }}>
          📐 NORM_X & SCALE_X Analog Converter
        </p>
        <AnalogScaleAnimation />
      </div>
    );
  }

  // Lesson 8: Functions & FBs
  if (lessonSlug === '08-advanced-instructions') {
    return (
      <div style={{ marginTop: '24px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#a3a3a3', textTransform: 'uppercase', marginBottom: '10px' }}>
          📦 FC vs FB Instance DB Architecture
        </p>
        <FCFBVisualizer />
      </div>
    );
  }

  // Lesson 9: High-Speed Counter & PWM
  if (lessonSlug === '09-high-speed-counting') {
    return (
      <div style={{ marginTop: '24px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#a3a3a3', textTransform: 'uppercase', marginBottom: '10px' }}>
          📈 High-Speed Counting & PWM Pulse Generator
        </p>
        <PWMVisualizer />
      </div>
    );
  }

  // Lesson 10: Closed Loop PID
  if (lessonSlug === '10-closed-loop-pid') {
    return (
      <div style={{ marginTop: '24px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#a3a3a3', textTransform: 'uppercase', marginBottom: '10px' }}>
          🔄 PID_Compact Tuning & Transient Response Simulator
        </p>
        <PIDVisualizer />
      </div>
    );
  }

  // Lesson 11: PROFINET
  if (lessonSlug === '11-communication') {
    return (
      <div style={{ marginTop: '24px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#a3a3a3', textTransform: 'uppercase', marginBottom: '10px' }}>
          🌐 PROFINET Industrial Ethernet Topology
        </p>
        <ProfinetDemo />
      </div>
    );
  }

  // Lesson 12: Fault Diagnostics
  if (lessonSlug === '12-fault-diagnostics') {
    return (
      <div style={{ marginTop: '24px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#a3a3a3', textTransform: 'uppercase', marginBottom: '10px' }}>
          🔍 TIA Portal Diagnostic Buffer & Watch Tables
        </p>
        <DiagnosticPanel />
      </div>
    );
  }

  // Lesson 15: Capstone System Integration
  if (lessonSlug === '15-system-integration') {
    return (
      <div style={{ marginTop: '24px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#a3a3a3', textTransform: 'uppercase', marginBottom: '10px' }}>
          🏭 Automation Pyramid & SCADA Integration
        </p>
        <CapstoneArchitecture />
      </div>
    );
  }

  return null;
}
