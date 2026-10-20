'use client';

import dynamic from 'next/dynamic';

// next/dynamic requires options to be inline object literals (not variables)
const Lesson01InteractiveHub = dynamic(() => import('./Lesson01InteractiveHub'),                          { ssr: false });
const ScanCycleAnimation   = dynamic(() => import('./LessonAnimationsNew').then(m => m.ScanCycleAnimation),   { ssr: false });
const S7RackExplorer       = dynamic(() => import('./S7RackExplorer'),                                        { ssr: false });
const TIAProjectSteps      = dynamic(() => import('./LessonAnimationsNew').then(m => m.TIAProjectSteps),      { ssr: false });
const TIALadderAnimation   = dynamic(() => import('./TIALadderAnimation'),                                    { ssr: false });
const TimerTONAnimation    = dynamic(() => import('./LessonAnimationsNew').then(m => m.TimerTONAnimation),    { ssr: false });
const DataTypeExplorer     = dynamic(() => import('./LessonAnimationsNew').then(m => m.DataTypeExplorer),     { ssr: false });
const FCFBVisualizer       = dynamic(() => import('./LessonAnimationsNew').then(m => m.FCFBVisualizer),       { ssr: false });
const PWMVisualizer        = dynamic(() => import('./LessonAnimationsNew').then(m => m.PWMVisualizer),        { ssr: false });
const AnalogScaleAnimation = dynamic(() => import('./LessonAnimationsNew').then(m => m.AnalogScaleAnimation), { ssr: false });
const PIDVisualizer        = dynamic(() => import('./LessonAnimationsNew').then(m => m.PIDVisualizer),        { ssr: false });
const ProfinetDemo         = dynamic(() => import('./LessonAnimationsNew').then(m => m.ProfinetDemo),         { ssr: false });
const HMIScreenBuilder     = dynamic(() => import('./LessonAnimationsNew').then(m => m.HMIScreenBuilder),     { ssr: false });
const SCADAPyramid         = dynamic(() => import('./LessonAnimationsNew').then(m => m.SCADAPyramid),         { ssr: false });
const DiagnosticPanel      = dynamic(() => import('./LessonAnimationsNew').then(m => m.DiagnosticPanel),      { ssr: false });
const CapstoneArchitecture = dynamic(() => import('./LessonAnimationsNew').then(m => m.CapstoneArchitecture), { ssr: false });

const map: Record<string, React.ReactElement> = {
  '01-programmable-control':   <Lesson01InteractiveHub />,
  '02-s7-1200-tia-portal':     <S7RackExplorer />,
  // '03-tia-portal' → đã gộp vào '02-s7-1200-tia-portal' (<TIAProjectSteps /> chưa dùng)
  '03-binary-operations':      <TIALadderAnimation />,
  // '05-timer-counter' → đã gộp vào '03-binary-operations' (<TimerTONAnimation /> chưa dùng)
  '04-numeric-operations':     <DataTypeExplorer />,
  '08-advanced-instructions':  <FCFBVisualizer />,
  '09-high-speed-counting':    <PWMVisualizer />,
  '05-analog-signals':         <AnalogScaleAnimation />,
  '10-closed-loop-pid':        <PIDVisualizer />,
  '11-communication':          <ProfinetDemo />,
  // '12-hmi-design' — bỏ: không có slide nguồn, xem CONTENT-GAPS.md
  // '13-scada' — bỏ: không có slide nguồn, xem CONTENT-GAPS.md
  '12-fault-diagnostics':      <DiagnosticPanel />,
  '15-system-integration':     <CapstoneArchitecture />,
};

export default function LessonAnimationWrapper({ slug }: { slug: string }) {
  const anim = map[slug];
  if (!anim) return null;
  return (
    <div style={{ marginBottom: '28px' }}>
      <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#a3a3a3', textTransform: 'uppercase', marginBottom: '12px' }}>
        🎬 Interactive Demo
      </p>
      {anim}
    </div>
  );
}
