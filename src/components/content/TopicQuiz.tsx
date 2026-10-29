'use client';

import React, { useState } from 'react';
import type { TopicQuizQuestion } from '@/types/content';
import { getTopic } from '@/content';

interface Props {
  topicSlug: string;
  lessonSlug?: string;
  quiz?: TopicQuizQuestion[];
  color?: string;
  isFullscreen?: boolean;
}

export default function TopicQuiz({
  topicSlug,
  lessonSlug,
  quiz: propQuiz,
  color = '#0072BD',
  isFullscreen = false,
}: Props) {
  // Ưu tiên quiz truyền qua props; nếu không có, tra cứu từ src/content
  const questions: TopicQuizQuestion[] =
    propQuiz && propQuiz.length > 0
      ? propQuiz
      : (lessonSlug ? getTopic(lessonSlug, topicSlug)?.quiz : undefined) || [];

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  if (questions.length === 0) {
    return (
      <div style={{
        background: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '4px',
        padding: '20px 24px',
        color: '#64748b',
        fontSize: '13px',
      }}>
        Chuyên đề này hiện chưa có câu hỏi kiểm tra nhanh.
      </div>
    );
  }

  const handleSelect = (qIdx: number, oIdx: number) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
  };

  const score = Object.keys(selectedAnswers).reduce((acc, qIdxStr) => {
    const qIdx = parseInt(qIdxStr, 10);
    const q = questions[qIdx];
    const correctAns = q.answer !== undefined ? q.answer : (q as any).correct;
    return selectedAnswers[qIdx] === correctAns ? acc + 1 : acc;
  }, 0);

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #cbd5e1',
      borderRadius: '4px',
      padding: isFullscreen ? '20px 24px' : '18px 20px',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: 4, height: 16, background: color, borderRadius: 2 }} />
          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
            Kiểm Tra Nhanh Kiến Thức Chuyên Đề
          </h4>
        </div>
        <span style={{ fontSize: '11px', fontWeight: 700, color: color, background: `${color}12`, padding: '3px 8px', borderRadius: '3px', border: `1px solid ${color}30` }}>
          {questions.length} câu hỏi
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: questions.length > 1 ? 'repeat(auto-fit, minmax(320px, 1fr))' : '1fr', gap: '14px' }}>
        {questions.map((q, qIdx) => {
          const userChoice = selectedAnswers[qIdx];
          const correctAns = q.answer !== undefined ? q.answer : (q as any).correct;
          const isCorrect = userChoice === correctAns;
          const questionText = q.q || (q as any).question;
          const explanationText = q.explain || (q as any).explanation;

          return (
            <div
              key={qIdx}
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'flex-start' }}>
                  <span style={{
                    width: 20,
                    height: 20,
                    borderRadius: '2px',
                    background: color,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    {qIdx + 1}
                  </span>
                  <p style={{ margin: 0, fontSize: '13.5px', fontWeight: 600, color: '#0f172a', lineHeight: 1.45 }}>
                    {questionText}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {q.options.map((opt, oIdx) => {
                    const isSelected = userChoice === oIdx;
                    const isAnswer = oIdx === correctAns;

                    let bg = '#ffffff';
                    let borderColor = '#cbd5e1';
                    let textColor = '#334155';

                    if (submitted) {
                      if (isAnswer) {
                        bg = '#f0fdf4';
                        borderColor = '#16a34a';
                        textColor = '#15803d';
                      } else if (isSelected && !isCorrect) {
                        bg = '#fef2f2';
                        borderColor = '#dc2626';
                        textColor = '#b91c1c';
                      }
                    } else if (isSelected) {
                      bg = `${color}10`;
                      borderColor = color;
                      textColor = color;
                    }

                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelect(qIdx, oIdx)}
                        disabled={submitted}
                        style={{
                          textAlign: 'left',
                          padding: '8px 12px',
                          borderRadius: '3px',
                          border: `1px solid ${borderColor}`,
                          background: bg,
                          color: textColor,
                          fontSize: '12.5px',
                          cursor: submitted ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'all 0.15s ease',
                          lineHeight: 1.4,
                        }}
                      >
                        <span style={{
                          width: 18,
                          height: 18,
                          borderRadius: '2px',
                          border: `1px solid ${isSelected ? color : '#cbd5e1'}`,
                          background: isSelected ? color : '#ffffff',
                          color: isSelected ? '#ffffff' : '#64748b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          fontWeight: 700,
                          flexShrink: 0,
                        }}>
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {submitted && (
                <div style={{
                  marginTop: '10px',
                  padding: '8px 10px',
                  borderRadius: '3px',
                  background: isCorrect ? '#f0fdf4' : '#fff7ed',
                  border: `1px solid ${isCorrect ? '#86efac' : '#fed7aa'}`,
                  fontSize: '12px',
                  color: isCorrect ? '#166534' : '#9a3412',
                  lineHeight: 1.45,
                }}>
                  <strong>{isCorrect ? '✓ Chính xác:' : 'ℹ Giải thích:'}</strong> {explanationText}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
        {!submitted ? (
          <button
            onClick={() => setSubmitted(true)}
            disabled={Object.keys(selectedAnswers).length < questions.length}
            style={{
              padding: '7px 18px',
              borderRadius: '3px',
              border: 'none',
              background: Object.keys(selectedAnswers).length < questions.length ? '#cbd5e1' : color,
              color: '#ffffff',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: Object.keys(selectedAnswers).length < questions.length ? 'not-allowed' : 'pointer',
            }}
          >
            Nộp bài kiểm tra ({Object.keys(selectedAnswers).length}/{questions.length})
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', width: '100%', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: score === questions.length ? '#16a34a' : '#0f172a' }}>
              Kết quả: {score}/{questions.length} câu đúng ({Math.round((score / questions.length) * 100)}%)
            </span>
            <button
              onClick={() => { setSubmitted(false); setSelectedAnswers({}); }}
              style={{
                padding: '6px 14px',
                borderRadius: '3px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                fontSize: '12px',
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer',
              }}
            >
              Làm lại ↺
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
