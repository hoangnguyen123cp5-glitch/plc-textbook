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
const PLCBrandTranslator = dynamic(() => import('@/components/animations/PLCBrandTranslator'), { ssr: false });
const PowerBudgetCalculator = dynamic(() => import('@/components/animations/PowerBudgetCalculator'), { ssr: false });
const S7300STLSimulator = dynamic(() => import('@/components/animations/S7300STLSimulator'), { ssr: false });
const MigrationDecisionMatrix = dynamic(() => import('@/components/animations/MigrationDecisionMatrix'), { ssr: false });

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
      return <LessonSectionAnimation slug={lessonSlug} sectionIndex={0} sectionTitle={topicTitle} />;
    }
    if (topicSlug === 'loop-types' || topicIndex === 1) {
      return <LessonSectionAnimation slug={lessonSlug} sectionIndex={1} sectionTitle={topicTitle} />;
    }
    if (topicSlug === 'hardwired-vs-programmable' || topicSlug === 'why-plc' || topicIndex === 2 || topicIndex === 3) {
      return <LessonSectionAnimation slug={lessonSlug} sectionIndex={2} sectionTitle={topicTitle} />;
    }
    if (topicSlug === 'scan-cycle' || topicIndex === 7) {
      return <LessonSectionAnimation slug={lessonSlug} sectionIndex={7} sectionTitle={topicTitle} />;
    }
    if (topicSlug === 'plc-structure' || topicSlug === 'memory-and-leds' || topicSlug === 'defining-plc' || topicIndex === 4 || topicIndex === 5 || topicIndex === 6) {
      return <S7RackExplorer />;
    }
    if (topicSlug === 'languages-structure' || topicIndex === 8) {
      return <TIALadderAnimation />;
    }
  }

  // Lesson 2: S7-1200 Hardware and Wiring
  if (lessonSlug === '02-s7-1200-tia-portal') {
    return <S7RackExplorer />;
  }

  // Lesson 3: Ladder Logic
  if (lessonSlug === '03-binary-operations') {
    return <TIALadderAnimation />;
  }

  // Lesson 4: Data types
  if (lessonSlug === '04-numeric-operations') {
    return <DataTypeExplorer />;
  }

  // Lesson 5: Analog
  if (lessonSlug === '05-analog-signals') {
    return <AnalogScaleAnimation />;
  }

  // Lesson 6: Other PLC Brands
  if (lessonSlug === '06-other-plc-brands') {
    return <PLCBrandTranslator />;
  }

  // Lesson 7: System Design
  if (lessonSlug === '07-system-design') {
    return <PowerBudgetCalculator />;
  }

  // Lesson 8: Functions & FBs
  if (lessonSlug === '08-advanced-instructions') {
    return <FCFBVisualizer />;
  }

  // Lesson 9: High-Speed Counter & PWM
  if (lessonSlug === '09-high-speed-counting') {
    return <PWMVisualizer />;
  }

  // Lesson 10: Closed Loop PID
  if (lessonSlug === '10-closed-loop-pid') {
    return <PIDVisualizer />;
  }

  // Lesson 11: PROFINET
  if (lessonSlug === '11-communication') {
    return <ProfinetDemo />;
  }

  // Lesson 12: Fault Diagnostics
  if (lessonSlug === '12-fault-diagnostics') {
    return <DiagnosticPanel />;
  }

  // Lesson 13: SIMATIC S7-300
  if (lessonSlug === '13-s7-300') {
    return <S7300STLSimulator />;
  }

  // Lesson 14: System Upgrade & Migration
  if (lessonSlug === '14-system-upgrade') {
    return <MigrationDecisionMatrix />;
  }

  // Lesson 15: Capstone System Integration
  if (lessonSlug === '15-system-integration') {
    return <CapstoneArchitecture />;
  }

  return null;
}
