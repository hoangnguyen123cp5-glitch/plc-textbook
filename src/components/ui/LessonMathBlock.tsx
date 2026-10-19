'use client';

import dynamic from 'next/dynamic';

const PIDFormula       = dynamic(() => import('./MathBlock').then(m => m.PIDFormula),       { ssr: false });
const NORMXFormula     = dynamic(() => import('./MathBlock').then(m => m.NORMXFormula),     { ssr: false });
const PWMFormula       = dynamic(() => import('./MathBlock').then(m => m.PWMFormula),       { ssr: false });
const HSCFormula       = dynamic(() => import('./MathBlock').then(m => m.HSCFormula),       { ssr: false });
const ScanTimeFormula  = dynamic(() => import('./MathBlock').then(m => m.ScanTimeFormula),  { ssr: false });
const OhmLawFormula    = dynamic(() => import('./MathBlock').then(m => m.OhmLawFormula),    { ssr: false });

const mathMap: Record<string, React.ReactElement> = {
  '01-programmable-control':  <ScanTimeFormula />,
  '02-s7-1200-tia-portal':    <OhmLawFormula />,
  '03-binary-operations':     <ScanTimeFormula />,
  '05-analog-signals':        <NORMXFormula />,
  '09-high-speed-counting':   <><PWMFormula /><HSCFormula /></>,
  '10-closed-loop-pid':       <PIDFormula />,
  '11-communication':         <OhmLawFormula />,
};


export default function LessonMathBlock({ slug }: { slug: string }) {
  const math = mathMap[slug];
  if (!math) return null;

  return (
    <div style={{ marginBottom: '28px' }}>
      <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#a3a3a3', textTransform: 'uppercase', marginBottom: '4px' }}>
        📐 Key Formulas
      </p>
      {math}
    </div>
  );
}
