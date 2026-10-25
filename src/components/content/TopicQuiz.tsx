'use client';

import React, { useState } from 'react';

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

// Sample questions tailored to lesson topics
const QUIZ_DATABASE: Record<string, QuizQuestion[]> = {
  // Lesson 1
  'scan-cycle': [
    {
      question: 'During which phase of the PLC scan cycle are physical output screw terminals updated?',
      options: [
        'Phase 1: Input Scan',
        'Phase 2: Program Execution',
        'Phase 3: Housekeeping & Comms',
        'Phase 4: Output Scan (from PIQ table)',
      ],
      correct: 3,
      explanation: 'The CPU writes the entire contents of the Process Image Output (PIQ) table to the physical output hardware simultaneously during Phase 4.',
    },
    {
      question: 'What occurs if an input pulse duration is 0.5 ms while the PLC scan cycle time is 10 ms?',
      options: [
        'The CPU automatically stretches the pulse',
        'The input pulse may be completely missed unless a High-Speed Counter (HSC) or interrupt is used',
        'The CPU trips into STOP mode',
        'The pulse is buffered in Load Memory',
      ],
      correct: 1,
      explanation: 'Because standard inputs are only sampled once per scan cycle (Phase 1), transient pulses shorter than the cycle time are completely aliased and lost.',
    },
  ],
  // Lesson 2
  'field-wiring': [
    {
      question: 'In a standard European Sinking Digital Input configuration (PNP sensor compatible), what voltage is connected to common terminal 1M?',
      options: [
        '+24VDC (L+)',
        '0VDC (M)',
        '120VAC Neutral',
        'Protective Earth (PE) only',
      ],
      correct: 1,
      explanation: 'In a Sinking DI circuit, terminal 1M is bonded to 0VDC (M). External PNP sensors switch positive +24VDC into the input channels (%I0.0–%I1.5).',
    },
    {
      question: 'Why must reverse-biased freewheeling diodes be connected across DC solenoid coils?',
      options: [
        'To increase solenoid actuation speed',
        'To suppress destructive high-voltage inductive kickback spikes when de-energized',
        'To convert AC power into DC power',
        'To provide thermal overload protection',
      ],
      correct: 1,
      explanation: 'When a DC inductive coil de-energizes, the collapsing magnetic field induces negative spikes exceeding 400V. A flyback diode dissipates this surge safely.',
    },
  ],
  // Lesson 3
  'logic-links': [
    {
      question: 'In Ladder Diagram, placing contacts in parallel branches executes which Boolean operation?',
      options: [
        'Boolean AND',
        'Boolean OR',
        'Boolean NOT',
        'Boolean NAND',
      ],
      correct: 1,
      explanation: 'Parallel branches create alternative conduction paths: virtual power flow passes if either Branch A OR Branch B evaluates to TRUE.',
    },
    {
      question: 'If a physical emergency stop button is Normally Closed (NC), what contact symbol must be used in your ladder rung?',
      options: [
        'Normally Closed contact (---[/]---)',
        'Normally Open contact (---[ ]---)',
        'Negated output coil (---(/)---)',
        'Set coil (---(S)---)',
      ],
      correct: 1,
      explanation: 'In its normal healthy state, the NC E-Stop delivers +24V (logic 1) to the input. An NO ladder contact (---[ ]---) examines for logic 1 and conducts power flow safely.',
    },
  ],
  // Lesson 5
  'norm-scale': [
    {
      question: 'What raw integer count corresponds to full-scale nominal measurement (10.0V or 20.0mA) in Siemens S7-1200 analog channels?',
      options: [
        '1,024 counts',
        '4,096 counts',
        '27,648 counts',
        '32,767 counts',
      ],
      correct: 2,
      explanation: 'Siemens standardized integer representation scales 0–10V and 4–20mA nominal ranges from 0 to 27648 counts, regardless of the ADC physical bit resolution.',
    },
    {
      question: 'What is the mathematical output of the NORM_X instruction block?',
      options: [
        'A raw integer between 0 and 32767',
        'A normalized dimensionless ratio between 0.0 and 1.0 (REAL)',
        'A physical measurement in engineering units',
        'A 4–20mA current loop voltage',
      ],
      correct: 1,
      explanation: 'NORM_X executes: OUT = (VALUE - MIN) / (MAX - MIN), producing a normalized floating-point ratio spanning 0.0 to 1.0.',
    },
  ],
  // Lesson 10
  'pid-compact': [
    {
      question: 'Why must the PID_Compact Technology Object be called inside a Cyclic Interrupt (OB30) rather than OB1?',
      options: [
        'Because OB1 cannot process floating-point REAL numbers',
        'To ensure a strictly deterministic, jitter-free sampling time (Ts) required for mathematical integration and derivation',
        'To prevent the CPU from running out of load memory',
        'Because OB30 executes with lower priority than communications',
      ],
      correct: 1,
      explanation: 'Discrete PID algorithms assume a constant sampling interval (Ts). Variations in OB1 cycle scan time would introduce calculation jitter and loop instability.',
    },
  ],
};

// Generic fallback quiz for other topics
const DEFAULT_QUIZ: QuizQuestion[] = [
  {
    question: 'What is the primary advantage of programmable logic controllers over hardwired relay panels?',
    options: [
      'Relays can handle higher temperatures than PLCs',
      'Modifying control sequences in software requires zero rewiring or hardware scrap',
      'PLCs do not require 24VDC power supplies',
      'Relay systems have faster network communications',
    ],
    correct: 1,
    explanation: 'Migrating to a PLC allows re-sequencing machines via simple software downloads in seconds, while hardwired relay panels require physical rewiring and downtime.',
  },
  {
    question: 'Which international standard governs PLC programming languages and architecture?',
    options: [
      'ISO 9001',
      'IEC 61131-3',
      'IEEE 802.11',
      'NEMA MG-1',
    ],
    correct: 1,
    explanation: 'IEC 61131-3 defines the five standardized industrial programming languages: LAD, FBD, SCL (Structured Text), STL (Instruction List), and SFC.',
  },
];

interface Props {
  topicSlug: string;
  color: string;
}

export default function TopicQuiz({ topicSlug, color }: Props) {
  const questions = QUIZ_DATABASE[topicSlug] ?? DEFAULT_QUIZ;
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qIdx: number, oIdx: number) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
  };

  const score = Object.keys(selectedAnswers).reduce((acc, qIdxStr) => {
    const qIdx = parseInt(qIdxStr);
    return selectedAnswers[qIdx] === questions[qIdx].correct ? acc + 1 : acc;
  }, 0);

  return (
    <div style={{
      marginTop: '28px',
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>📝</span>
          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
            Quick Knowledge Check · Self-Assessment
          </h4>
        </div>
        <span style={{ fontSize: '11px', fontWeight: 600, color: color, background: `${color}15`, padding: '4px 8px', borderRadius: '4px' }}>
          {questions.length} Questions
        </span>
      </div>

      <p style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '20px', lineHeight: 1.5 }}>
        Test your understanding of the technical concepts covered in this topic before proceeding to the next lesson:
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {questions.map((q, qIdx) => {
          const userChoice = selectedAnswers[qIdx];
          const isAnswered = userChoice !== undefined;
          const isCorrect = userChoice === q.correct;

          return (
            <div key={qIdx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '12px', lineHeight: 1.5 }}>
                {qIdx + 1}. {q.question}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {q.options.map((opt, oIdx) => {
                  let optBg = '#ffffff';
                  let optBorder = '#cbd5e1';
                  let optColor = '#334155';

                  if (submitted) {
                    if (oIdx === q.correct) {
                      optBg = '#dcfce7';
                      optBorder = '#86efac';
                      optColor = '#166534';
                    } else if (userChoice === oIdx) {
                      optBg = '#fee2e2';
                      optBorder = '#fca5a5';
                      optColor = '#991b1b';
                    }
                  } else if (userChoice === oIdx) {
                    optBg = `${color}15`;
                    optBorder = color;
                    optColor = color;
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelect(qIdx, oIdx)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '6px',
                        border: `1px solid ${optBorder}`,
                        background: optBg,
                        color: optColor,
                        fontSize: '12.5px',
                        textAlign: 'left',
                        cursor: submitted ? 'default' : 'pointer',
                        fontWeight: userChoice === oIdx ? 600 : 450,
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span style={{
                        width: 18, height: 18, borderRadius: '50%',
                        border: `1px solid ${userChoice === oIdx ? color : '#cbd5e1'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '10px', fontWeight: 700, flexShrink: 0,
                        background: userChoice === oIdx ? color : 'transparent',
                        color: userChoice === oIdx ? '#ffffff' : '#64748b',
                      }}>
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div style={{
                  marginTop: '12px',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  lineHeight: 1.5,
                  background: isCorrect ? '#f0fdf4' : '#fef2f2',
                  borderLeft: `3px solid ${isCorrect ? '#16a34a' : '#dc2626'}`,
                  color: isCorrect ? '#166534' : '#991b1b',
                }}>
                  <strong>{isCorrect ? '✓ Correct Answer!' : '✗ Review Concept:'}</strong> {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        {!submitted ? (
          <button
            onClick={() => setSubmitted(true)}
            disabled={Object.keys(selectedAnswers).length === 0}
            style={{
              padding: '8px 20px',
              borderRadius: '6px',
              border: 'none',
              background: color,
              color: '#ffffff',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: Object.keys(selectedAnswers).length === 0 ? 'not-allowed' : 'pointer',
              opacity: Object.keys(selectedAnswers).length === 0 ? 0.6 : 1,
            }}
          >
            Check Answers & Explanations
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: score === questions.length ? '#16a34a' : '#d97706' }}>
              Your Score: {score}/{questions.length} ({Math.round((score / questions.length) * 100)}%)
            </span>
            <button
              onClick={() => { setSubmitted(false); setSelectedAnswers({}); }}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                fontSize: '12px',
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer',
              }}
            >
              Retry Quiz ↺
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
