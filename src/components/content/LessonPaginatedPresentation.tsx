'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { asset } from '@/lib/asset';
import { PIDVisualizer } from '@/components/animations/LessonAnimationsNew';

interface Props {
  lesson: {
    id: number;
    slug: string;
    title: string;
    description: string;
    course: string;
    session: number;
    lab: string;
    clo: string;
    color: string;
    icon: string;
    durationMinutes: number;
    totalTopics: number;
  };
  content?: {
    overview: string;
    objectives: string[];
    review?: string[];
  };
  prevLesson?: { slug: string; title: string };
  nextLesson?: { slug: string; title: string };
}

// 22 Semantically Structured Pages for "Closed-Loop Control with PID"
const PAGES_METADATA = [
  { id: 0, title: 'Bìa & Tổng Quan Bài Học', shortTitle: '1. Tổng quan', category: 'TỔNG QUAN CHƯƠNG' },
  { id: 1, title: 'Chuẩn Đầu Ra (CLO G3)', shortTitle: '2. Chuẩn đầu ra', category: 'CHUẨN ĐẦU RA' },
  { id: 2, title: 'Mục Tiêu Trọng Tâm (Phần 1: Lý Thuyết)', shortTitle: '3. Mục tiêu (P1)', category: 'MỤC TIÊU HỌC TẬP' },
  { id: 3, title: 'Mục Tiêu Trọng Tâm (Phần 2: Kỹ Thuật)', shortTitle: '4. Mục tiêu (P2)', category: 'MỤC TIÊU HỌC TẬP' },
  { id: 4, title: 'Kiến Trúc Điều Khiển Vòng Kín', shortTitle: '5. Vòng kín', category: 'NGUYÊN LÝ ĐIỀU KHIỂN' },
  { id: 5, title: 'Sơ Đồ Khối Hệ Thống Chuẩn ISA-5.1', shortTitle: '6. Sơ đồ khối', category: 'SƠ ĐỒ HỆ THỐNG' },
  { id: 6, title: 'Mô Hình Toán Học PID Liên Tục', shortTitle: '7. Công thức PID', category: 'MÔ HÌNH TOÁN HỌC' },
  { id: 7, title: 'Rời Rạc Hóa & Ngắt Chu Kỳ OB30', shortTitle: '8. Rời rạc hóa (OB30)', category: 'THỰC THI THỜI GIAN THỰC' },
  { id: 8, title: 'Đối Tượng Công Nghệ PID_Compact', shortTitle: '9. PID_Compact', category: 'CẤU TRÚC PHẦN MỀM' },
  { id: 9, title: 'Giao Tiếp Tín Hiệu: Input vs Input_PER', shortTitle: '10. Tín hiệu Analog', category: 'KỸ THUẬT ĐẤU NỐI' },
  { id: 10, title: 'Bão Hòa Tích Phân & Anti-Windup Clamping', shortTitle: '11. Anti-Windup', category: 'BẢO VỆ CHỐNG BÃO HÒA' },
  { id: 11, title: 'Dò Tự Động: Pre-Tuning & Fine-Tuning', shortTitle: '12. Dò tự động', category: 'TỰ ĐỘNG HIỆU CHUẨN' },
  { id: 12, title: 'Chế Độ Manual & Bumpless Transfer', shortTitle: '13. Bumpless Transfer', category: 'VẬN HÀNH AN TOÀN' },
  { id: 13, title: 'Tình Huống Nhà Máy: Lò Nhiệt Luyện Thép 850°C', shortTitle: '14. Lò nhiệt luyện', category: 'ỨNG DỤNG NHÀ MÁY' },
  { id: 14, title: 'Bàn Mô Phỏng Tương Tác PID Lab', shortTitle: '15. Bàn mô phỏng', category: 'THỰC HÀNH MÔ PHỎNG' },
  { id: 15, title: 'Ma Trận Chẩn Đoán Lỗi & Xử Lý Sự Cố', shortTitle: '16. Chẩn đoán lỗi', category: 'CHẨN ĐOÁN SỰ CỐ' },
  { id: 16, title: 'Micro-Quiz 1: Khâu Tích Phân & Sai Số Xác Lập', shortTitle: '17. Quiz 1 (Khâu I)', category: 'ĐÁNH GIÁ NHẬN THỨC' },
  { id: 17, title: 'Micro-Quiz 2: Ngắt Thời Gian Thực OB30 vs OB1', shortTitle: '18. Quiz 2 (OB30)', category: 'ĐÁNH GIÁ NHẬN THỨC' },
  { id: 18, title: 'Micro-Quiz 3: Hiện Tượng Bão Hòa Tích Phân', shortTitle: '19. Quiz 3 (Windup)', category: 'ĐÁNH GIÁ NHẬN THỨC' },
  { id: 19, title: 'Câu Hỏi Ôn Tập Củng Cố (Phần 1: Câu 1 – 4)', shortTitle: '20. Ôn tập (P1)', category: 'CÂU HỎI ÔN TẬP' },
  { id: 20, title: 'Câu Hỏi Ôn Tập Củng Cố (Phần 2: Câu 5 – 7)', shortTitle: '21. Ôn tập (P2)', category: 'CÂU HỎI ÔN TẬP' },
  { id: 21, title: 'Tổng Kết Chương & Lộ Trình Kế Tiếp', shortTitle: '22. Tổng kết', category: 'TỔNG KẾT BÀI HỌC' },
];

export default function LessonPaginatedPresentation({
  lesson,
  content,
  prevLesson,
  nextLesson,
}: Props) {
  const [currentPage, setCurrentPage] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  // Quiz state: preserved across page changes
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const totalPages = PAGES_METADATA.length;
  const color = lesson.color || '#dc2626';

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
  };

  // Keyboard navigation: Left/Right arrows, Space, PageUp/PageDown
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture keys if typing in form inputs
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        if (zoomImage) setZoomImage(null);
        else if (drawerOpen) setDrawerOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, zoomImage, drawerOpen]);

  // Quiz questions data
  const QUIZ_ITEMS = [
    {
      id: 0,
      pageIndex: 16,
      q: 'Vai trò cốt lõi của khâu Tích phân (Integral - Ti) trong thuật toán PID là gì?',
      opts: [
        'Triệt tiêu hoàn toàn sai số xác lập (e = 0) bằng cách tích lũy sai số theo thời gian',
        'Dự báo xu hướng sai số tương lai dựa trên tốc độ biến thiên của quá trình',
        'Phản ứng tức thời tỷ lệ thuận với độ lệch hiện tại để tạo lực kéo ban đầu',
        'Lọc nhiễu cao tần trên đường dây cảm biến analog truyền về PLC',
      ],
      correct: 0,
      explain: 'Khâu tích phân (I) liên tục cộng dồn sai số theo thời gian, tăng dần tác động điều khiển cho đến khi sai số xác lập triệt tiêu hoàn toàn về 0.',
    },
    {
      id: 1,
      pageIndex: 17,
      q: 'Vì sao hàm PID_Compact của S7-1200 bắt buộc phải gọi trong ngắt chu kỳ OB30 thay vì OB1?',
      opts: [
        'Vì OB1 không thể tính toán số thực dấu phẩy động (REAL)',
        'Để đảm bảo chu kỳ lấy mẫu Ts tuyệt đối xác định, không bị méo sai phân và tích phân do dao động quét',
        'Để tránh CPU bị đầy bộ nhớ tải (Load Memory)',
        'Vì OB30 có tốc độ giao tiếp mạng nhanh hơn khối tổ chức OB1',
      ],
      correct: 1,
      explain: 'Thuật toán PID rời rạc đòi hỏi chu kỳ lấy mẫu Ts bất biến. Sự dao động thời gian quét của OB1 sẽ gây méo tín hiệu vi/tích phân, dẫn đến dao động mất ổn định.',
    },
    {
      id: 2,
      pageIndex: 18,
      q: 'Hiện tượng Bão hòa Tích phân (Integral Windup) gây nguy hại gì cho cơ cấu chấp hành?',
      opts: [
        'Làm van điều khiển hoặc bộ gia nhiệt bị trễ phục hồi và gây vọt lố (overshoot) dữ dội khi vượt qua điểm đặt',
        'Làm cháy nguồn cấp điện 24VDC của trạm PLC S7-1200',
        'Làm mất vĩnh viễn chương trình đã nạp trong bộ nhớ nạp NVRAM',
        'Không gây ảnh hưởng gì đến thiết bị vì PLC có tính năng tự bảo vệ',
      ],
      correct: 0,
      explain: 'Khi chấp hành kịch trần (100%), nếu tích phân vẫn tiếp tục tích lũy, bộ điều khiển sẽ bị bão hòa sâu, mất nhiều thời gian để xả điện tích áp và gây vọt lố nghiêm trọng.',
    },
  ];

  const handleSelectQuiz = (qId: number, optIdx: number) => {
    setQuizAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        maxWidth: '1360px',
        margin: '0 auto',
        height: '100%',
        background: '#ffffff',
        borderRadius: '14px',
        border: '1.5px solid #cbd5e1',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* ── Top Progress Line ── */}
      <div style={{ height: '3.5px', width: '100%', background: '#e2e8f0', flexShrink: 0 }}>
        <div
          style={{
            height: '100%',
            width: `${((currentPage + 1) / totalPages) * 100}%`,
            background: `linear-gradient(90deg, ${color}, #0284c7)`,
            transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </div>

      {/* ── Top Header Bar (Fixed at top of presentation card) ── */}
      <div
        style={{
          padding: '10px 20px',
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'nowrap',
          gap: '12px',
          flexShrink: 0,
        }}
      >
        {/* Left: Branding & Current Page Focus */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <span style={{ fontSize: '22px', flexShrink: 0 }}>{lesson.icon}</span>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: '10.5px',
                fontWeight: 800,
                letterSpacing: '0.06em',
                color: color,
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {lesson.course} · {lesson.lab} · {PAGES_METADATA[currentPage].category}
            </div>
            <div
              style={{
                fontSize: '13.5px',
                fontWeight: 800,
                color: '#0f172a',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Bài {lesson.id}: {lesson.title} — {PAGES_METADATA[currentPage].title}
            </div>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <button
            onClick={() => setDrawerOpen(true)}
            title="Mở mục lục toàn bộ slide bài học"
            style={{
              padding: '6px 12px',
              borderRadius: '7px',
              border: '1px solid #cbd5e1',
              background: '#f8fafc',
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
            <span>Mục Lục ({totalPages} Trang)</span>
          </button>

          <button
            onClick={toggleFullscreen}
            title="Toàn màn hình trình chiếu bài giảng"
            style={{
              padding: '6px 10px',
              borderRadius: '7px',
              border: '1px solid #cbd5e1',
              background: '#f8fafc',
              color: '#475569',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ⛶
          </button>
        </div>
      </div>

      {/* ── Main Content Stage: Exactly 1 Page Displayed at a Time, No Scrollbars ── */}
      <div
        style={{
          flex: 1,
          padding: '16px 28px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#ffffff',
        }}
      >
        {/* ════════════════════════════════════════════════════════════════════
           PAGE 0: Title & Course Context
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 0 ? 'grid' : 'none', gridTemplateColumns: '1.15fr 1fr', gap: '24px', alignItems: 'center', height: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: 4, height: 22, background: color, borderRadius: 99 }} />
              <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                GIÁO TRÌNH ĐIỆN TỬ · {lesson.course} · {lesson.lab}
              </span>
            </div>

            <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0f172a', margin: 0, lineHeight: 1.25 }}>
              {lesson.title}
            </h1>

            <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '14px 18px', borderLeft: `5px solid ${color}` }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', marginBottom: '4px' }}>
                🎯 Giới Thiệu & Bối Cảnh Công Nghiệp:
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: '#334155', lineHeight: 1.6 }}>
                Các quá trình công nghệ liên tục—ổn định nhiệt độ lò hóa chất, tăng áp đường ống nước sạch, kiểm soát mức bồn chất lỏng—đều đòi hỏi cơ chế tự động bù trừ nhiễu loạn môi trường. Bài học này trang bị nền tảng toán học PID và kiến trúc khối hàm công nghệ <strong>Siemens PID_Compact</strong> trong TIA Portal.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', background: '#f1f5f9', border: '1px solid #cbd5e1' }}>
                ⏱️ Thời lượng: ~{lesson.durationMinutes} phút
              </span>
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', background: '#f1f5f9', border: '1px solid #cbd5e1' }}>
                📚 {totalPages} Trang Trình Chiếu Chuẩn Hóa
              </span>
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', background: '#f1f5f9', border: '1px solid #cbd5e1' }}>
                ⚡ Kèm Bàn Lab Mô phỏng PID Tương Tác
              </span>
            </div>
          </div>

          <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '16px 20px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
              📋 Mục Lục {totalPages} Trang Bài Học (Bấm Để Chuyển Nhanh):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
              {PAGES_METADATA.slice(0, 18).map((p) => (
                <div
                  key={p.id}
                  onClick={() => setCurrentPage(p.id)}
                  style={{
                    padding: '5px 8px',
                    borderRadius: '6px',
                    background: currentPage === p.id ? `${color}18` : '#ffffff',
                    border: currentPage === p.id ? `1.5px solid ${color}` : '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ width: 16, height: 16, borderRadius: '50%', background: `${color}20`, color: color, fontSize: '9.5px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {p.id + 1}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {p.shortTitle}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '8px', display: 'flex', gap: '6px' }}>
              {PAGES_METADATA.slice(18).map((p) => (
                <div
                  key={p.id}
                  onClick={() => setCurrentPage(p.id)}
                  style={{
                    flex: 1,
                    padding: '5px 8px',
                    borderRadius: '6px',
                    background: currentPage === p.id ? `${color}18` : '#ffffff',
                    border: currentPage === p.id ? `1.5px solid ${color}` : '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ width: 16, height: 16, borderRadius: '50%', background: `${color}20`, color: color, fontSize: '9.5px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {p.id + 1}
                  </span>
                  <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {p.shortTitle}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
           PAGE 1: Course Learning Outcomes (CLO G3)
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 1 ? 'flex' : 'none', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '2px' }}>
              CHUẨN ĐẦU RA MÔN HỌC (COURSE LEARNING OUTCOME)
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Chuẩn Đầu Ra G3: Thiết Kế & Hiệu Chỉnh Vòng Điều Khiển Kín PID
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '18px', flex: 1, alignItems: 'stretch', margin: '10px 0' }}>
            <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '18px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  🎯 Tuyên Bố Chuẩn Đầu Ra (CLO G3):
                </span>
                <p style={{ fontSize: '14px', color: '#1e293b', lineHeight: 1.65, margin: 0, fontWeight: 600 }}>
                  "{lesson.clo}: Sinh viên có khả năng mô hình hóa đối tượng điều khiển quá trình, cấu hình khối hàm công nghệ PID_Compact trên PLC Siemens S7-1200, gán ngắt chu kỳ OB30 và thực hiện quy trình tự động dò tham số Pre-Tuning / Fine-Tuning đáp ứng yêu cầu công nghệ."
                </p>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 14px' }}>
                <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                  Cấp Độ Tư Duy (Bloom Level 4 - Analysis & Synthesis):
                </span>
                <div style={{ fontSize: '11.5px', color: '#475569', lineHeight: 1.5 }}>
                  Phân tích động học vòng lặp kín, nhận biết hiện tượng bão hòa tích phân (Windup) và tối ưu hóa hệ số Kp, Ti, Td bằng công cụ phần mềm TIA Portal.
                </div>
              </div>
            </div>

            <div style={{ background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: '12px', padding: '18px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                ⚡ Năng Lực Cốt Lõi Thu Được Sau Bài Học:
              </span>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: '#1e3a8a', lineHeight: 1.65, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>• Thiết lập bảng thông số đặt SP, tín hiệu đo PV và đầu ra điều khiển u(t).</li>
                <li>• Khai báo ngắt chu kỳ thời gian thực OB30 với chu kỳ lấy mẫu Ts chuẩn xác.</li>
                <li>• Cấu hình giới hạn chống bão hòa tích phân Anti-Windup bảo vệ van điều khiển.</li>
                <li>• Vận hành giao diện TIA Portal PID Commissioning và chuyển đổi Bumpless Transfer.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
           PAGE 2: Core Objectives Part 1 (Theory & Block Architecture)
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 2 ? 'flex' : 'none', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              MỤC TIÊU HỌC TẬP TRỌNG TÂM (PHẦN 1: LÝ THUYẾT & KIẾN TRÚC KHỐI)
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Cơ Sở Toán Học & Kiến Trúc Điều Khiển PID Số
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', flex: 1, alignContent: 'center', margin: '10px 0' }}>
            <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: `${color}20`, color: color, fontSize: '10.5px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
                <strong style={{ fontSize: '12.5px', color: '#0f172a' }}>Mô hình hóa Động học Vòng Kín</strong>
              </div>
              <p style={{ margin: 0, fontSize: '11.5px', color: '#475569', lineHeight: 1.55, paddingLeft: '28px' }}>
                Thiết lập phương trình toán học chuẩn ISA cho bộ điều khiển PID liên tục và dạng phương trình sai phân rời rạc phục vụ lập trình PLC.
              </p>
            </div>

            <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: `${color}20`, color: color, fontSize: '10.5px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
                <strong style={{ fontSize: '12.5px', color: '#0f172a' }}>Phân tích Vai trò Độc lập Kp, Ti, Td</strong>
              </div>
              <p style={{ margin: 0, fontSize: '11.5px', color: '#475569', lineHeight: 1.55, paddingLeft: '28px' }}>
                Đánh giá tác động độc lập và phối hợp của hệ số Khuếch đại tỷ lệ (Kp), Thời gian tích phân (Ti), và Thời gian vi phân (Td) lên đáp ứng quá độ.
              </p>
            </div>

            <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: `${color}20`, color: color, fontSize: '10.5px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
                <strong style={{ fontSize: '12.5px', color: '#0f172a' }}>Khởi tạo Đối tượng PID_Compact</strong>
              </div>
              <p style={{ margin: 0, fontSize: '11.5px', color: '#475569', lineHeight: 1.55, paddingLeft: '28px' }}>
                Khởi tạo Technology Object trong TIA Portal, cấu hình Data Block phiên bản (Instance DB) và tham số hóa các chân tín hiệu I/O.
              </p>
            </div>

            <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: `${color}20`, color: color, fontSize: '10.5px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>4</span>
                <strong style={{ fontSize: '12.5px', color: '#0f172a' }}>Thực thi trong Ngắt Chu kỳ OB30</strong>
              </div>
              <p style={{ margin: 0, fontSize: '11.5px', color: '#475569', lineHeight: 1.55, paddingLeft: '28px' }}>
                Gán khối hàm thực thi bên trong Cyclic Interrupt (OB30) với chu kỳ lấy mẫu Ts cố định, bảo đảm tính xác định thời gian thực.
              </p>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
           PAGE 3: Objectives Part 2 (Engineering & Commissioning)
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 3 ? 'flex' : 'none', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              MỤC TIÊU HỌC TẬP TRỌNG TÂM (PHẦN 2: KỸ THUẬT HIỆU CHUẨN & VẬN HÀNH)
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Chuẩn Tín Hiệu Analog, Dò Tự Động & Chuyển Đổi Không Giật
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', flex: 1, alignContent: 'center', margin: '10px 0' }}>
            <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#0284c7', color: '#ffffff', fontSize: '10.5px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>5</span>
                  <strong style={{ fontSize: '12px', color: '#0f172a' }}>Chuẩn Tín Hiệu & Anti-Windup</strong>
                </div>
                <p style={{ margin: 0, fontSize: '11px', color: '#475569', lineHeight: 1.55 }}>
                  Cấu hình chuẩn hóa tín hiệu vật lý ngõ vào qua chân <code>Input_PER</code> (0..27648) và thiết lập cơ chế kẹp chống bão hòa tích phân (Anti-Windup).
                </p>
              </div>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#0284c7', marginTop: '8px' }}>TIÊU CHUẨN IEC 61131-2</span>
            </div>

            <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#0284c7', color: '#ffffff', fontSize: '10.5px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>6</span>
                  <strong style={{ fontSize: '12px', color: '#0f172a' }}>Dò Tự Động Pre / Fine-Tuning</strong>
                </div>
                <p style={{ margin: 0, fontSize: '11px', color: '#475569', lineHeight: 1.55 }}>
                  Vận hành công cụ TIA Portal PID Commissioning Control Panel để tự động kích hoạt thuật toán bước nhảy Pre-Tuning và tinh chỉnh dao động Fine-Tuning.
                </p>
              </div>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#0284c7', marginTop: '8px' }}>BẢNG ĐIỀU KHIỂN TIA PORTAL</span>
            </div>

            <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#16a34a', color: '#ffffff', fontSize: '10.5px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>7</span>
                  <strong style={{ fontSize: '12px', color: '#0f172a' }}>Chuyển Đổi Bumpless Transfer</strong>
                </div>
                <p style={{ margin: 0, fontSize: '11px', color: '#475569', lineHeight: 1.55 }}>
                  Lập trình chuyển đổi chế độ Manual / Auto mượt mà, bảo đảm ngõ ra điều khiển không bị giật đột ngột gây hư hỏng cơ khí hoặc sốc áp lực đường ống.
                </p>
              </div>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#16a34a', marginTop: '8px' }}>VẬN HÀNH AN TOÀN NHÀ MÁY</span>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
           PAGE 4: Closed-Loop Control Architecture & Signal Flow
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 4 ? 'flex' : 'none', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              NGUYÊN LÝ ĐIỀU KHIỂN VÒNG KÍN (CLOSED-LOOP CONTROL DYNAMICS)
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Cấu Trúc 5 Khâu Cốt Lõi Của Vòng Phản Hồi Âm
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '18px', flex: 1, alignItems: 'stretch', margin: '10px 0' }}>
            <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  🎯 Phương Trình Tính Sai Số Tức Thời:
                </span>
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 14px', fontFamily: 'Consolas, monospace', fontSize: '14px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                  e(t) = Setpoint SP(t) − Process Variable PV(t)
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#334155', lineHeight: 1.6 }}>
                  Trong hệ điều khiển kín, cảm biến đo đạc trạng thái thực (PV) và truyền tín hiệu ngược về bộ trừ. Bộ điều khiển tính toán sai số e(t) và phát tín hiệu điều khiển u(t) tới cơ cấu chấp hành (van tỉ lệ, biến tần, bộ gia nhiệt thyristor) để triệt tiêu độ lệch.
                </p>
              </div>

              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '10px 12px', fontSize: '11px', color: '#1e3a8a' }}>
                💡 <strong>Ưu điểm vượt trội:</strong> Tự động triệt tiêu tác động của các nguồn nhiễu loạn không mô hình hóa được từ môi trường ngoài (gió lùa, sụt áp, thay đổi tải cơ khí).
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '14px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>
                Dòng Tín Hiệu 5 Khối:
              </span>
              <div style={{ padding: '6px 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '11px' }}>
                1. <strong>Giá trị đặt (SP):</strong> Nhập từ màn hình HMI KTP700
              </div>
              <div style={{ padding: '6px 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '11px' }}>
                2. <strong>Bộ so sánh (Σ):</strong> Tính sai số e(t) = SP − PV
              </div>
              <div style={{ padding: '6px 10px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', fontSize: '11px', color: '#1d4ed8', fontWeight: 700 }}>
                3. <strong>Bộ điều khiển (PLC):</strong> Khối hàm PID_Compact tính u(t)
              </div>
              <div style={{ padding: '6px 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '11px' }}>
                4. <strong>Cơ cấu chấp hành:</strong> Van điều khiển / Biến tần VFD
              </div>
              <div style={{ padding: '6px 10px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', fontSize: '11px', color: '#15803d', fontWeight: 700 }}>
                5. <strong>Cảm biến phản hồi:</strong> Cảm biến PT100 / Áp suất 4–20 mA
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
           PAGE 5: System Block Diagram
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 5 ? 'grid' : 'none', gridTemplateColumns: '1fr 1.25fr', gap: '20px', alignItems: 'center', height: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                SƠ ĐỒ HỆ THỐNG TIÊU CHUẨN (ISA-5.1 STANDARD)
              </span>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Sơ Đồ Khối Điều Khiển Vòng Kín Phản Hồi Âm
              </h2>
            </div>

            <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '14px 18px', borderLeft: `5px solid ${color}` }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', marginBottom: '4px' }}>
                📌 Phân Tích Đường Truyền Tín Hiệu:
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#334155', lineHeight: 1.6 }}>
                Đường truyền tiến (Feedforward path) đưa sai số $e(t)$ qua bộ điều khiển $G_c(s)$ tới đối tượng $G_p(s)$. Nhiễu loạn $D(s)$ tác động trực tiếp vào quá trình vật lý. Khâu đo lường phản hồi $H(s)$ lấy mẫu liên tục và đưa ngược về điểm trừ với dấu âm để khép kín vòng lặp.
              </p>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 12px', fontSize: '11px', color: '#475569' }}>
              💡 <strong>Lưu ý Giảng dạy:</strong> Bấm trực tiếp vào sơ đồ bên phải để phóng to chi tiết toàn màn hình khi thuyết minh bài giảng.
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '12px', height: '100%', maxHeight: '420px' }}>
            <div
              onClick={() => setZoomImage('/images/diagrams/pid-block-diagram.jpg')}
              style={{ width: '100%', height: '85%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-in' }}
              title="Bấm để phóng to sơ đồ"
            >
              <img
                src={asset('/images/diagrams/pid-block-diagram.jpg')}
                alt="Figure 10.1: Standard ISA Closed-Loop PID Control Architecture"
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}
              />
            </div>
            <p style={{ fontSize: '10.5px', color: '#475569', marginTop: '6px', fontStyle: 'italic', textAlign: 'center', lineHeight: 1.35, fontWeight: 500 }}>
              Hình 10.1: Sơ đồ khối điều khiển vòng kín phản hồi âm và bù trừ nhiễu động lực học
            </p>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
           PAGE 6: Continuous PID Mathematical Model
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 6 ? 'flex' : 'none', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              MÔ HÌNH TOÁN HỌC THUẬT TOÁN (MATHEMATICAL PID FORMULATION)
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Phương Trình Vi Tích Phân Tỷ Lệ (Continuous PID Algorithm)
            </h2>
          </div>

          <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '12px 18px', margin: '6px 0', textAlign: 'center' }}>
            <div style={{ fontSize: '10.5px', fontWeight: 800, color: color, textTransform: 'uppercase', marginBottom: '4px' }}>
              Phương Trình PID Chuẩn ISA Tiêu Chuẩn:
            </div>
            <div style={{ fontFamily: 'Consolas, monospace', fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
              u(t) = K_p · [ e(t) + (1 / T_i) · ∫ e(τ)dτ + T_d · (de(t) / dt) ]
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', flex: 1, alignContent: 'center' }}>
            <div style={{ background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: '10px', padding: '12px 14px' }}>
              <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#1d4ed8', marginBottom: '2px' }}>
                Khâu Tỷ Lệ (P) · Kp
              </div>
              <div style={{ fontSize: '10.5px', fontFamily: 'monospace', fontWeight: 700, color: '#2563eb', marginBottom: '4px' }}>
                P(t) = Kp · e(t)
              </div>
              <p style={{ margin: 0, fontSize: '11px', color: '#1e3a8a', lineHeight: 1.55 }}>
                Phản ứng tức thời theo độ lớn sai số. Kp càng lớn hệ thống đáp ứng càng nhanh, nhưng không thể triệt tiêu sai số xác lập một mình (hiện tượng Droop).
              </p>
            </div>

            <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: '10px', padding: '12px 14px' }}>
              <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#15803d', marginBottom: '2px' }}>
                Khâu Tích Phân (I) · Ti
              </div>
              <div style={{ fontSize: '10.5px', fontFamily: 'monospace', fontWeight: 700, color: '#16a34a', marginBottom: '4px' }}>
                I(t) = (Kp / Ti) · ∫ e(τ)dτ
              </div>
              <p style={{ margin: 0, fontSize: '11px', color: '#14532d', lineHeight: 1.55 }}>
                Tích lũy lịch sử sai số theo thời gian. Liên tục đẩy điện áp điều khiển cho đến khi sai số xác lập bị triệt tiêu hoàn toàn về đúng 0 ($e = 0$).
              </p>
            </div>

            <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: '10px', padding: '12px 14px' }}>
              <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#b45309', marginBottom: '2px' }}>
                Khâu Vi Phân (D) · Td
              </div>
              <div style={{ fontSize: '10.5px', fontFamily: 'monospace', fontWeight: 700, color: '#d97706', marginBottom: '4px' }}>
                D(t) = Kp · Td · (de / dt)
              </div>
              <p style={{ margin: 0, fontSize: '11px', color: '#78350f', lineHeight: 1.55 }}>
                Dự báo xu hướng sai số dựa vào tốc độ biến thiên. Tạo hiệu ứng hãm (damping), giảm thiểu độ vọt lố (overshoot) và rút ngắn thời gian xác lập.
              </p>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
           PAGE 7: Discretization & Cyclic Interrupt OB30
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 7 ? 'flex' : 'none', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              RỜI RẠC HÓA THUẬT TOÁN & BẢO ĐẢM TÍNH XÁC ĐỊNH THỜI GIAN THỰC
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Vì Sao Khối Hàm PID_Compact Bắt Buộc Phải Chạy Trong Ngắt Chu Kỳ OB30?
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: '18px', flex: 1, alignItems: 'stretch', margin: '10px 0' }}>
            <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  ⚙️ Công Thức Rời Rạc Hóa Chu Kỳ Lấy Mẫu Ts:
                </span>
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 12px', fontFamily: 'monospace', fontSize: '12px', color: '#0f172a', marginBottom: '8px' }}>
                  u[k] = Kp · e[k] + Ki · Σ (e[i] · Ts) + Kd · ((e[k] - e[k-1]) / Ts)
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#334155', lineHeight: 1.6 }}>
                  Trong vi điều khiển số, phép tính tích phân được tính xấp xỉ bằng tổng Riemann Σ(e[i] · Ts) và vi phân bằng tỷ số sai phân (e[k] - e[k-1]) / Ts. Thuật toán giả định rằng chu kỳ lấy mẫu Ts là một <strong>hằng số bất biến tuyệt đối</strong>.
                </p>
              </div>

              <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: '8px', padding: '8px 12px', fontSize: '11px', color: '#991b1b' }}>
                ❌ <strong>Sai lầm nguy hiểm khi gọi PID trong OB1:</strong> Chu kỳ quét OB1 co giãn liên tục (1 ms..15 ms). Sự co giãn này làm sai lệch phép tính tích phân và vi phân, gây méo tín hiệu và làm vòng điều khiển mất ổn định nghiêm trọng!
              </div>
            </div>

            <div style={{ background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: '12px', padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                ✅ Giải Pháp Chuẩn Công Nghiệp:
              </span>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11.5px', color: '#1e3a8a', lineHeight: 1.65, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>• Khởi tạo khối tổ chức ngắt chu kỳ <strong>Cyclic Interrupt OB30</strong> trong TIA Portal.</li>
                <li>• Cài đặt thời gian ngắt cố định (ví dụ: Ts = 100.0 ms cho hệ nhiệt độ, Ts = 20.0 ms cho hệ lưu lượng).</li>
                <li>• CPU S7-1200 dùng bộ đếm ngắt phần cứng, tạm dừng OB1 đúng thời điểm để tính toán PID với sai số giật jitter &lt; 100 μs.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
           PAGE 8: Technology Object PID_Compact Architecture
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 8 ? 'grid' : 'none', gridTemplateColumns: '1fr 1.25fr', gap: '20px', alignItems: 'center', height: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                ĐỐI TƯỢNG CÔNG NGHỆ (TECHNOLOGY OBJECT)
              </span>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Khối Lệnh Siemens S7-1200 PID_Compact
              </h2>
            </div>

            <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '14px 18px', borderLeft: `5px solid ${color}` }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', marginBottom: '4px' }}>
                📌 Cấu Trúc Khối Lệnh PID_Compact:
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#334155', lineHeight: 1.6 }}>
                PID_Compact là đối tượng công nghệ tích hợp sẵn trong hệ điều hành CPU S7-1200. Khối đi kèm một khối dữ liệu phiên bản (Instance DB) lưu trữ toàn bộ tham số hiệu chỉnh, trạng thái tích phân, ngưỡng cảnh báo và cấu hình ngõ ra.
              </p>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 12px', fontSize: '11px', color: '#475569' }}>
              🔍 <strong>Chế độ hoạt động:</strong> Hỗ trợ Mode 0 (Không kích hoạt), Mode 1 (Dò sơ bộ Pre-Tuning), Mode 2 (Dò tinh chỉnh Fine-Tuning), Mode 3 (Tự động - Auto), Mode 4 (Bằng tay - Manual).
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '12px', height: '100%', maxHeight: '420px' }}>
            <div
              onClick={() => setZoomImage('/images/slides/10-closed-loop-pid/PLC___Slide__036.png')}
              style={{ width: '100%', height: '85%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-in' }}
              title="Bấm để phóng to sơ đồ"
            >
              <img
                src={asset('/images/slides/10-closed-loop-pid/PLC___Slide__036.png')}
                alt="Figure 10.2: Siemens PID_Compact Technology Object Architecture"
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}
              />
            </div>
            <p style={{ fontSize: '10.5px', color: '#475569', marginTop: '6px', fontStyle: 'italic', textAlign: 'center', lineHeight: 1.35, fontWeight: 500 }}>
              Hình 10.2: Kiến trúc khối hàm công nghệ PID_Compact, chân Input_PER và cơ chế kẹp Anti-Windup
            </p>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
           PAGE 9: Input vs Input_PER Analog Scaling
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 9 ? 'flex' : 'none', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              CHUẨN HÓA TÍN HIỆU ANALOG VẬT LÝ (PHYSICAL I/O SCALING)
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Phân Biệt Cặp Chân Tín Hiệu: Input vs Input_PER
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', flex: 1, alignItems: 'stretch', margin: '10px 0' }}>
            <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0284c7', marginBottom: '2px' }}>
                  Chân Ngõ Vào Ngoại Vi: Input_PER
                </div>
                <div style={{ fontSize: '10.5px', fontFamily: 'monospace', color: '#64748b', marginBottom: '6px' }}>
                  Kiểu dữ liệu: WORD (%IW64, %IW66) · Dải giá trị: 0..27648
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#334155', lineHeight: 1.6 }}>
                  Đấu nối trực tiếp với từ ngõ vào analog của PLC (kết nối cảm biến 4–20 mA hoặc 0–10V). Khối hàm PID_Compact sẽ tự động nội suy chuyển đổi dải số nguyên thô 0..27648 sang đơn vị công nghệ thực (°C, bar, m³/h) theo cấu hình phần cứng.
                </p>
              </div>
              <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#0284c7' }}>KHUYÊN DÙNG TRONG CÔNG NGHIỆP</span>
            </div>

            <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#16a34a', marginBottom: '2px' }}>
                  Chân Ngõ Vào Số Thực: Input
                </div>
                <div style={{ fontSize: '10.5px', fontFamily: 'monospace', color: '#64748b', marginBottom: '6px' }}>
                  Kiểu dữ liệu: REAL · Đơn vị công nghệ thực (ví dụ: 65.4°C)
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#334155', lineHeight: 1.6 }}>
                  Dành cho trường hợp tín hiệu đo được tiền xử lý bởi hàm lọc số hoặc nhận từ mạng truyền thông PROFINET / Modbus RTU dưới dạng số thực đã quy đổi trước đó.
                </p>
              </div>
              <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#16a34a' }}>TÍN HIỆU ĐÃ QUA LỌC SỐ</span>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
           PAGE 10: Integral Windup & Anti-Windup Protection
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 10 ? 'flex' : 'none', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              BẢO VỆ CHỐNG BÃO HÒA CƠ CẤU CHẤP HÀNH (ACTUATOR SATURATION)
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Cơ Chế Khóa Tích Phân Kẹp Ngưỡng (Integral Anti-Windup Clamping)
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '18px', flex: 1, alignItems: 'stretch', margin: '10px 0' }}>
            <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  🚨 Bản Chất Của Sự Cố Bão Hòa Tích Phân (Windup):
                </span>
                <p style={{ fontSize: '12px', color: '#334155', lineHeight: 1.6, margin: '0 0 8px 0' }}>
                  Khi cơ cấu chấp hành đạt giới hạn cơ học vật lý (ví dụ: van mở hết cỡ 100%, hoặc điện trở sưởi bật cực đại 100%), nếu sai số vẫn tiếp tục tồn tại, khâu tích phân sẽ liên tục cộng dồn giá trị lên hàng nghìn phần trăm.
                </p>
                <p style={{ fontSize: '12px', color: '#334155', lineHeight: 1.6, margin: 0 }}>
                  Hậu quả: Khi quá trình bắt đầu vượt điểm đặt, bộ điều khiển phải mất một khoảng thời gian trễ rất lâu để xả lượng tích phân khổng lồ này, khiến nhiệt độ/áp suất vọt lố nghiêm trọng và có thể gây nổ hoặc phá hủy thiết bị!
                </p>
              </div>

              <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: '8px', padding: '8px 12px', fontSize: '11px', color: '#166534' }}>
                🛡️ <strong>Giải pháp của Siemens PID_Compact:</strong> Tự động đóng băng tích phân ngay khi đầu ra chạm ngưỡng giới hạn trên hoặc dưới (Umax, Umin), và phục hồi lập tức khi sai số đổi dấu!
              </div>
            </div>

            <div style={{ background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: '12px', padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                ⚡ Cấu Hình Giới Hạn Đầu Ra An Toàn:
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11.5px', color: '#1e3a8a' }}>
                <div style={{ padding: '6px 10px', background: '#ffffff', border: '1px solid #dbeafe', borderRadius: '6px' }}>
                  • <strong>OutputUpperLimit:</strong> 100.0% (hoặc giới hạn van 85%)
                </div>
                <div style={{ padding: '6px 10px', background: '#ffffff', border: '1px solid #dbeafe', borderRadius: '6px' }}>
                  • <strong>OutputLowerLimit:</strong> 0.0% (chống đóng quá mức cho phép)
                </div>
                <div style={{ padding: '6px 10px', background: '#ffffff', border: '1px solid #dbeafe', borderRadius: '6px' }}>
                  • <strong>Anti-Windup Method:</strong> Back-calculation & Integrator clamping
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
           PAGE 11: Auto-Tuning Commissioning (Pre-Tuning & Fine-Tuning)
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 11 ? 'grid' : 'none', gridTemplateColumns: '1fr 1.25fr', gap: '20px', alignItems: 'center', height: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                CÔNG CỤ HIỆU CHUẨN TỰ ĐỘNG (COMMISSIONING DASHBOARD)
              </span>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Thuật Toán Dò Tự Động: Pre-Tuning & Fine-Tuning
              </h2>
            </div>

            <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '14px 18px', borderLeft: `5px solid ${color}` }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', marginBottom: '4px' }}>
                1. Dò Sơ Bộ (Pre-Tuning):
              </div>
              <p style={{ margin: '0 0 8px 0', fontSize: '11.5px', color: '#334155', lineHeight: 1.55 }}>
                Phát bước nhảy công suất ngõ ra để xác định điểm uốn đáp ứng bước quá độ (Step response), tính ra các thông số Kp, Ti, Td ban đầu.
              </p>

              <div style={{ fontSize: '11px', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', marginBottom: '4px' }}>
                2. Dò Tinh Chỉnh (Fine-Tuning):
              </div>
              <p style={{ margin: 0, fontSize: '11.5px', color: '#334155', lineHeight: 1.55 }}>
                Tạo dao động rơ-le kiểm soát xung quanh điểm đặt, tinh chỉnh tỷ số suy giảm và độ vọt lố để đạt đáp ứng tối ưu nhất.
              </p>
            </div>

            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '8px 12px', fontSize: '11px', color: '#92400e' }}>
              ⚠️ <strong>Điều kiện tiên quyết:</strong> Quá trình bắt buộc phải ở trạng thái tĩnh (steady-state) trước khi kích hoạt Pre-Tuning, nếu không quá trình dò sẽ báo lỗi abort!
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '12px', height: '100%', maxHeight: '420px' }}>
            <div
              onClick={() => setZoomImage('/images/slides/10-closed-loop-pid/PLC___Slide__020.png')}
              style={{ width: '100%', height: '85%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-in' }}
              title="Bấm để phóng to sơ đồ"
            >
              <img
                src={asset('/images/slides/10-closed-loop-pid/PLC___Slide__020.png')}
                alt="Figure 10.3: TIA Portal PID Commissioning Dashboard"
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}
              />
            </div>
            <p style={{ fontSize: '10.5px', color: '#475569', marginTop: '6px', fontStyle: 'italic', textAlign: 'center', lineHeight: 1.35, fontWeight: 500 }}>
              Hình 10.3: Bảng điều khiển hiệu chuẩn PID trong TIA Portal, đường cong đáp ứng và nút bấm dò tự động
            </p>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
           PAGE 12: Manual Override & Bumpless Transfer
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 12 ? 'flex' : 'none', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              VẬN HÀNH BẢO TRÌ & AN TOÀN (OPERATIONAL SAFETY)
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Chế Độ Điều Khiển Bằng Tay (Manual) & Chuyển Đổi Không Giật (Bumpless Transfer)
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '18px', flex: 1, alignItems: 'stretch', margin: '10px 0' }}>
            <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  🎯 Nguyên Lý Chuyển Đổi Không Giật (Bumpless Transfer):
                </span>
                <p style={{ fontSize: '12px', color: '#334155', lineHeight: 1.6, margin: 0 }}>
                  Trong quá trình bảo trì, kỹ sư chuyển PID_Compact sang <strong>Mode 4 (Manual)</strong> và gán giá trị mở van trực tiếp (ví dụ: cố định 45%). Khi trả về <strong>Mode 3 (Auto)</strong>, nếu không có cơ chế bumpless transfer, ngõ ra sẽ nhảy vọt tức thời theo độ lệch sai số hiện hữu, gây rung lắc mạnh cơ cấu chấp hành và phá hỏng đường ống.
                </p>
              </div>

              <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: '8px', padding: '8px 12px', fontSize: '11px', color: '#166534' }}>
                ✅ <strong>Cơ chế tự động của S7-1200:</strong> PID_Compact tự động gán giá trị tích phân ban đầu bằng đúng giá trị Manual hiện thời, giúp độ mở van biến thiên mượt mà từ 45% mà không có bất kỳ xung giật nào.
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Lưu Trữ Tham Số Vào Bộ Nhớ Bền Vững:
              </span>
              <p style={{ fontSize: '11.5px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                Sau khi dò tự động thành công, các giá trị Kp, Ti, Td được lưu vào Work Memory. Để bảo toàn khi mất điện, kỹ sư bấm nút <strong>"Upload PID parameters to project"</strong> trong TIA Portal để nạp vĩnh viễn vào bộ nhớ nạp (Load Memory).
              </p>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
           PAGE 13: Industrial Case Study (Metallurgy Furnace)
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 13 ? 'flex' : 'none', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              TÌNH HUỐNG THỰC TẾ NHÀ MÁY (INDUSTRIAL PLANT CASE STUDY)
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Hệ Thống Lò Tôi Nhiệt Luyện Thép: Vòng Hở vs Vòng Kín PID
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: '18px', flex: 1, alignItems: 'stretch', margin: '10px 0' }}>
            <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  🏭 Tình Huống Công Nghệ:
                </span>
                <p style={{ fontSize: '12px', color: '#334155', lineHeight: 1.6, margin: '0 0 8px 0' }}>
                  Lò tôi nhiệt luyện hợp kim yêu cầu nhiệt độ ổn định tại <strong>850°C ± 2°C</strong>. Khi công nhân mở cửa nạp phôi thép nguội, gió lạnh tràn vào làm nhiệt độ tụt ngay 150°C.
                </p>
                <p style={{ fontSize: '12px', color: '#334155', lineHeight: 1.6, margin: 0 }}>
                  Với hệ vòng hở (cố định góc kích thyristor 70%), bộ điều khiển không hề biết nhiệt độ bị tụt ➔ làm hỏng toàn bộ mẻ phôi thép trị giá hàng trăm triệu đồng! Với vòng kín PID, can nhiệt Type K lập tức báo sai số, PLC bơm công suất lên 95% để khử nhiễu thành công.
                </p>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 12px', fontSize: '11px', color: '#0f172a' }}>
                📐 <strong>Chỉ số kỹ thuật:</strong> Thời gian phục hồi nhiệt độ sau mở cửa &lt; 45 giây; Độ lệch xác lập e(t) &lt; 0.5°C.
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  ⚡ Phần Cứng Thật Được Triển Khai:
                </span>
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', color: '#475569', lineHeight: 1.55, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <li>• <strong>PLC:</strong> Siemens SIMATIC S7-1200 CPU 1214C DC/DC/DC</li>
                  <li>• <strong>Cảm biến:</strong> Can nhiệt bọc hợp kim Inconel Type K (-50°C..1200°C)</li>
                  <li>• <strong>Bộ biến đổi:</strong> Transmitter chuyển đổi 4–20 mA chuẩn hóa</li>
                  <li>• <strong>Cơ cấu chấp hành:</strong> Bộ kích thyristor công suất Eurotherm SCR</li>
                </ul>
              </div>

              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '8px 12px', fontSize: '10.5px', color: '#92400e', lineHeight: 1.5 }}>
                ⚠️ <strong>Kinh nghiệm vận hành:</strong> Luôn nối đất vỏ bọc chống nhiễu (Shield) của cáp can nhiệt tại một điểm duy nhất ở tủ điện PLC để tránh dòng lặp đất (Ground Loop).
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
           PAGE 14: Interactive Simulation Lab Bench (Preserved State)
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 14 ? 'flex' : 'none', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              THỰC NGHIỆM MÔ PHỎNG ẢO TƯƠNG TÁC (VIRTUAL BENCH LAB)
            </span>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Bàn Thí Nghiệm Động Học Quá Trình & Dò Hệ Số PID
            </h2>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '6px 0' }}>
            <PIDVisualizer />
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
           PAGE 15: Fault Diagnostics Matrix
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 15 ? 'flex' : 'none', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              MA TRẬN CHẨN ĐOÁN LỖI & KHẮC PHỤC SỰ CỐ CÔNG NGHIỆP
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Sự Cố Thường Gặp Trên Vòng Lặp Kín & Cách Xử Lý
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', flex: 1, alignContent: 'center', margin: '10px 0' }}>
            <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: '10px', padding: '12px 14px' }}>
              <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#991b1b', marginBottom: '4px' }}>
                🚨 Sai Số Xác Lập Không Triệt Tiêu (Offset)
              </div>
              <div style={{ fontSize: '10.5px', color: '#7f1d1d', lineHeight: 1.5, marginBottom: '6px' }}>
                Nhiệt độ thực PV luôn thấp hơn điểm đặt SP khoảng 3–5°C và không chịu tăng thêm.
              </div>
              <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#15803d', background: '#ffffff', padding: '5px 8px', borderRadius: '4px', border: '1px solid #86efac' }}>
                🔧 Cách sửa: Khâu tích phân (Ti) bị đặt quá lớn hoặc tắt. Giảm Ti để tăng tốc độ dồn tích phân.
              </div>
            </div>

            <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: '10px', padding: '12px 14px' }}>
              <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#b45309', marginBottom: '4px' }}>
                ⚠️ Rung Giật Cơ Khí Van Điều Khiển (Chatter)
              </div>
              <div style={{ fontSize: '10.5px', color: '#78350f', lineHeight: 1.5, marginBottom: '6px' }}>
                Đầu ra PID nhảy liên tục với tần số cao, làm mòn bánh răng động cơ servo van.
              </div>
              <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#15803d', background: '#ffffff', padding: '5px 8px', borderRadius: '4px', border: '1px solid #86efac' }}>
                🔧 Cách sửa: Khâu vi phân (Td) bị nhiễu cảm biến kích động. Bật bộ lọc vi phân hoặc giảm Td.
              </div>
            </div>

            <div style={{ background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: '10px', padding: '12px 14px' }}>
              <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#1d4ed8', marginBottom: '4px' }}>
                ⚠️ Lỗi Ngắt Dò Sơ Bộ (Pre-Tuning Aborted)
              </div>
              <div style={{ fontSize: '10.5px', color: '#1e3a8a', lineHeight: 1.5, marginBottom: '6px' }}>
                Bấm nút Pre-Tuning trong TIA Portal nhưng hệ thống báo lỗi không thể hoàn thành bước nhảy.
              </div>
              <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#15803d', background: '#ffffff', padding: '5px 8px', borderRadius: '4px', border: '1px solid #86efac' }}>
                🔧 Cách sửa: Quá trình đang dao động hoặc quá gần điểm đặt SP. Đưa quá trình về trạng thái tĩnh trước khi chạy.
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
           PAGE 16: Micro-Quiz 1 (Integral Gain Ti)
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 16 ? 'flex' : 'none', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '10.5px', fontWeight: 800, color: color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                MICRO-QUIZ NHẬN THỨC · CÂU HỎI 1 / 3
              </span>
              <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '99px', background: `${color}18`, color: color }}>
                TRẮC NGHIỆM ĐIỆN TỬ
              </span>
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.35 }}>
              Câu 1: {QUIZ_ITEMS[0].q}
            </h2>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px', margin: '12px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {QUIZ_ITEMS[0].opts.map((opt, optIdx) => {
                const isChosen = quizAnswers[0] === optIdx;
                const isCorrect = optIdx === QUIZ_ITEMS[0].correct;
                let bg = '#ffffff';
                let bColor = '#cbd5e1';
                let tColor = '#1e293b';

                if (isChosen) {
                  bg = isCorrect ? '#f0fdf4' : '#fef2f2';
                  bColor = isCorrect ? '#22c55e' : '#ef4444';
                  tColor = isCorrect ? '#15803d' : '#991b1b';
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectQuiz(0, optIdx)}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '10px',
                      border: `1.5px solid ${bColor}`,
                      background: bg,
                      color: tColor,
                      fontSize: '12.5px',
                      fontWeight: isChosen ? 700 : 500,
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'all 0.15s ease',
                      boxShadow: isChosen ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                    }}
                  >
                    <span
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: isChosen ? (isCorrect ? '#16a34a' : '#dc2626') : '#f1f5f9',
                        color: isChosen ? '#ffffff' : '#64748b',
                        fontSize: '11px',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span style={{ flex: 1, lineHeight: 1.45 }}>{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Instant Answer Feedback */}
            {quizAnswers[0] !== undefined && (
              <div
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  background: quizAnswers[0] === QUIZ_ITEMS[0].correct ? '#f0fdf4' : '#fef2f2',
                  border: `1.5px solid ${quizAnswers[0] === QUIZ_ITEMS[0].correct ? '#86efac' : '#fca5a5'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div style={{ fontSize: '12px', color: quizAnswers[0] === QUIZ_ITEMS[0].correct ? '#166534' : '#991b1b', lineHeight: 1.5 }}>
                  <strong>{quizAnswers[0] === QUIZ_ITEMS[0].correct ? '✓ Rất chính xác!' : '✗ Chưa chính xác!'}</strong> {QUIZ_ITEMS[0].explain}
                </div>
                <button
                  onClick={handleNext}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: 'none',
                    background: color,
                    color: '#ffffff',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  Câu tiếp theo ▶
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
           PAGE 17: Micro-Quiz 2 (OB30 Cyclic Interrupt)
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 17 ? 'flex' : 'none', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '10.5px', fontWeight: 800, color: color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                MICRO-QUIZ NHẬN THỨC · CÂU HỎI 2 / 3
              </span>
              <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '99px', background: `${color}18`, color: color }}>
                TRẮC NGHIỆM ĐIỆN TỬ
              </span>
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.35 }}>
              Câu 2: {QUIZ_ITEMS[1].q}
            </h2>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px', margin: '12px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {QUIZ_ITEMS[1].opts.map((opt, optIdx) => {
                const isChosen = quizAnswers[1] === optIdx;
                const isCorrect = optIdx === QUIZ_ITEMS[1].correct;
                let bg = '#ffffff';
                let bColor = '#cbd5e1';
                let tColor = '#1e293b';

                if (isChosen) {
                  bg = isCorrect ? '#f0fdf4' : '#fef2f2';
                  bColor = isCorrect ? '#22c55e' : '#ef4444';
                  tColor = isCorrect ? '#15803d' : '#991b1b';
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectQuiz(1, optIdx)}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '10px',
                      border: `1.5px solid ${bColor}`,
                      background: bg,
                      color: tColor,
                      fontSize: '12.5px',
                      fontWeight: isChosen ? 700 : 500,
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'all 0.15s ease',
                      boxShadow: isChosen ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                    }}
                  >
                    <span
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: isChosen ? (isCorrect ? '#16a34a' : '#dc2626') : '#f1f5f9',
                        color: isChosen ? '#ffffff' : '#64748b',
                        fontSize: '11px',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span style={{ flex: 1, lineHeight: 1.45 }}>{opt}</span>
                  </button>
                );
              })}
            </div>

            {quizAnswers[1] !== undefined && (
              <div
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  background: quizAnswers[1] === QUIZ_ITEMS[1].correct ? '#f0fdf4' : '#fef2f2',
                  border: `1.5px solid ${quizAnswers[1] === QUIZ_ITEMS[1].correct ? '#86efac' : '#fca5a5'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div style={{ fontSize: '12px', color: quizAnswers[1] === QUIZ_ITEMS[1].correct ? '#166534' : '#991b1b', lineHeight: 1.5 }}>
                  <strong>{quizAnswers[1] === QUIZ_ITEMS[1].correct ? '✓ Rất chính xác!' : '✗ Chưa chính xác!'}</strong> {QUIZ_ITEMS[1].explain}
                </div>
                <button
                  onClick={handleNext}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: 'none',
                    background: color,
                    color: '#ffffff',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  Câu tiếp theo ▶
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
           PAGE 18: Micro-Quiz 3 (Integral Windup)
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 18 ? 'flex' : 'none', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '10.5px', fontWeight: 800, color: color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                MICRO-QUIZ NHẬN THỨC · CÂU HỎI 3 / 3
              </span>
              <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '99px', background: `${color}18`, color: color }}>
                TRẮC NGHIỆM ĐIỆN TỬ
              </span>
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.35 }}>
              Câu 3: {QUIZ_ITEMS[2].q}
            </h2>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px', margin: '12px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {QUIZ_ITEMS[2].opts.map((opt, optIdx) => {
                const isChosen = quizAnswers[2] === optIdx;
                const isCorrect = optIdx === QUIZ_ITEMS[2].correct;
                let bg = '#ffffff';
                let bColor = '#cbd5e1';
                let tColor = '#1e293b';

                if (isChosen) {
                  bg = isCorrect ? '#f0fdf4' : '#fef2f2';
                  bColor = isCorrect ? '#22c55e' : '#ef4444';
                  tColor = isCorrect ? '#15803d' : '#991b1b';
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectQuiz(2, optIdx)}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '10px',
                      border: `1.5px solid ${bColor}`,
                      background: bg,
                      color: tColor,
                      fontSize: '12.5px',
                      fontWeight: isChosen ? 700 : 500,
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'all 0.15s ease',
                      boxShadow: isChosen ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                    }}
                  >
                    <span
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: isChosen ? (isCorrect ? '#16a34a' : '#dc2626') : '#f1f5f9',
                        color: isChosen ? '#ffffff' : '#64748b',
                        fontSize: '11px',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span style={{ flex: 1, lineHeight: 1.45 }}>{opt}</span>
                  </button>
                );
              })}
            </div>

            {quizAnswers[2] !== undefined && (
              <div
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  background: quizAnswers[2] === QUIZ_ITEMS[2].correct ? '#f0fdf4' : '#fef2f2',
                  border: `1.5px solid ${quizAnswers[2] === QUIZ_ITEMS[2].correct ? '#86efac' : '#fca5a5'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div style={{ fontSize: '12px', color: quizAnswers[2] === QUIZ_ITEMS[2].correct ? '#166534' : '#991b1b', lineHeight: 1.5 }}>
                  <strong>{quizAnswers[2] === QUIZ_ITEMS[2].correct ? '✓ Rất chính xác!' : '✗ Chưa chính xác!'}</strong> {QUIZ_ITEMS[2].explain}
                </div>
                <button
                  onClick={handleNext}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: 'none',
                    background: color,
                    color: '#ffffff',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  Xem phần ôn tập ▶
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
           PAGE 19: Review Questions Part 1 (Questions 1 - 4)
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 19 ? 'flex' : 'none', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              CÂU HỎI CỦNG CỐ & ÔN TẬP CUỐI CHƯƠNG (PHẦN 1: CÂU 1 – 4)
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Câu Hỏi Lý Thuyết & Cấu Trúc Khối Lệnh
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', flex: 1, alignContent: 'center', margin: '10px 0' }}>
            {[
              { id: 1, q: 'Giải thích vai trò độc lập của Kp, Ti, Td trong vòng lặp kín.', note: 'P tạo tốc độ, I triệt tiêu sai số xác lập, D giảm độ vọt lố.' },
              { id: 2, q: 'Vì sao điều khiển tỷ lệ P thuần túy luôn để lại sai số xác lập?', note: 'Vì khi e = 0, đầu ra u = 0, van bị đóng và không giữ được tải.' },
              { id: 3, q: 'Giải thích vì sao PID_Compact bắt buộc phải gọi trong OB30 thay vì OB1?', note: 'Bảo đảm chu kỳ lấy mẫu Ts bất biến, không bị méo sai phân/tích phân.' },
              { id: 4, q: 'Phân biệt ngõ vào Input và Input_PER trên khối PID_Compact.', note: 'Input_PER nhận trực tiếp mã WORD từ ADC; Input nhận số thực REAL.' },
            ].map((item) => (
              <div key={item.id} style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: `${color}18`, color: color, fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {item.id}
                  </span>
                  <div style={{ fontSize: '12.5px', color: '#0f172a', lineHeight: 1.5, fontWeight: 700 }}>
                    {item.q}
                  </div>
                </div>
                <div style={{ marginTop: '8px', fontSize: '11px', color: '#64748b', fontStyle: 'italic', paddingLeft: '32px' }}>
                  💡 Gợi ý: {item.note}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
           PAGE 20: Review Questions Part 2 (Questions 5 - 7)
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 20 ? 'flex' : 'none', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              CÂU HỎI CỦNG CỐ & ÔN TẬP CUỐI CHƯƠNG (PHẦN 2: CÂU 5 – 7)
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Câu Hỏi Vận Hành, Dò Tự Động & An Toàn
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', flex: 1, alignContent: 'center', margin: '10px 0' }}>
            {[
              { id: 5, q: 'Hiện tượng Integral Windup là gì và ảnh hưởng thế nào đến van điều khiển?', note: 'Khâu I dồn kịch trần khi chấp hành bão hòa, gây vọt lố dữ dội khi qua điểm đặt.' },
              { id: 6, q: 'Nêu sự khác biệt kỹ thuật giữa Pre-Tuning và Fine-Tuning trong TIA Portal.', note: 'Pre-Tuning phát bước nhảy tìm điểm uốn; Fine-Tuning tạo dao động rơ-le tinh chỉnh.' },
              { id: 7, q: 'Định nghĩa Bumpless Transfer và vì sao nó là tính năng an toàn thiết yếu?', note: 'Chuyển Manual sang Auto mượt mà, gán tích phân bằng đầu ra tay để tránh sốc cơ khí.' },
            ].map((item) => (
              <div key={item.id} style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ width: 22, height: 22, borderRadius: '50%', background: `${color}18`, color: color, fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {item.id}
                    </span>
                    <div style={{ fontSize: '12px', color: '#0f172a', lineHeight: 1.5, fontWeight: 700 }}>
                      {item.q}
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '8px', fontSize: '10.5px', color: '#64748b', fontStyle: 'italic', borderTop: '1px solid #e2e8f0', paddingTop: '6px' }}>
                  💡 Gợi ý: {item.note}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
           PAGE 21: Summary & Next Learning Milestones
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 21 ? 'flex' : 'none', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: color, textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              TỔNG KẾT BÀI HỌC & LỘ TRÌNH KẾ TIẾP (COURSE ROADMAP)
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Hoàn Thành Bài 10: Closed-Loop Control with PID
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '18px', flex: 1, alignItems: 'stretch', margin: '10px 0' }}>
            <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '12px', padding: '18px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#166534', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  ✅ Chuẩn Đầu Ra Đã Kiểm Chứng:
                </span>
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: '#14532d', lineHeight: 1.65, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li>• Làm chủ mô hình vi tích phân tỷ lệ PID liên tục và rời rạc.</li>
                  <li>• Thành thạo cấu hình khối Technology Object PID_Compact trong TIA Portal.</li>
                  <li>• Gán ngắt chu kỳ OB30 chính xác, kiểm soát lấy mẫu thời gian thực.</li>
                  <li>• Tự động dò tham số Kp, Ti, Td bằng Pre-Tuning và Fine-Tuning.</li>
                </ul>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '8px 12px', fontSize: '11.5px', color: '#166534', fontWeight: 700 }}>
                🏆 Bạn đã hoàn thành 100% nội dung {totalPages} trang bài học số 10!
              </div>
            </div>

            <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '18px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Lộ Trình Học Tiếp Theo:
                </div>
                <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.6, marginBottom: '10px' }}>
                  Chuyển tiếp sang <strong>Bài 11: Communication Protocols</strong> để làm chủ mạng truyền thông công nghiệp PROFINET RT và Modbus RTU trên cổng RS485!
                </div>
              </div>

              {nextLesson && (
                <Link
                  href={`/lessons/${nextLesson.slug}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    background: color,
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '12.5px',
                    textDecoration: 'none',
                    boxShadow: `0 4px 12px ${color}33`,
                  }}
                >
                  <span>Chuyển sang Bài 11: {nextLesson.title}</span>
                  <span>➔</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Navigation Bar: [Trang trước] — [Trang hiện tại / Tổng số trang] — [Trang tiếp] ── */}
      <div
        style={{
          padding: '8px 20px',
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'nowrap',
          flexShrink: 0,
        }}
      >
        <button
          onClick={handlePrev}
          disabled={currentPage === 0}
          style={{
            padding: '6px 16px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            background: currentPage === 0 ? '#f1f5f9' : '#ffffff',
            color: currentPage === 0 ? '#94a3b8' : '#0f172a',
            fontSize: '12px',
            fontWeight: 700,
            cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s ease',
          }}
        >
          <span>◀ Trang trước</span>
        </button>

        {/* Center: [Trang hiện tại / Tổng số trang] with Dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>
            Trang {currentPage + 1} / {totalPages}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx)}
                title={`Chuyển đến trang ${idx + 1}: ${PAGES_METADATA[idx].shortTitle}`}
                style={{
                  width: idx === currentPage ? 14 : 4,
                  height: 4,
                  borderRadius: 99,
                  border: 'none',
                  background: idx === currentPage ? color : '#cbd5e1',
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
          disabled={currentPage === totalPages - 1}
          style={{
            padding: '6px 18px',
            borderRadius: '8px',
            border: 'none',
            background: currentPage === totalPages - 1 ? '#94a3b8' : color,
            color: '#ffffff',
            fontSize: '12px',
            fontWeight: 800,
            cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: currentPage === totalPages - 1 ? 'none' : `0 2px 8px ${color}33`,
            transition: 'all 0.15s ease',
          }}
        >
          <span>Trang tiếp ▶</span>
        </button>
      </div>

      {/* ── Table of Contents Drawer Modal ── */}
      {drawerOpen && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '320px',
            height: '100%',
            background: '#ffffff',
            borderRight: '1px solid #cbd5e1',
            boxShadow: '8px 0 30px rgba(0,0,0,0.12)',
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#f8fafc',
            }}
          >
            <div>
              <div style={{ fontSize: '10px', fontWeight: 800, color: color, textTransform: 'uppercase' }}>
                MỤC LỤC TRÌNH CHIẾU
              </div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                {totalPages} Trang Nội Dung
              </div>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '13px',
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
            {PAGES_METADATA.map((p) => {
              const isActive = currentPage === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    setCurrentPage(p.id);
                    setDrawerOpen(false);
                  }}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '7px',
                    marginBottom: '3px',
                    background: isActive ? `${color}15` : 'transparent',
                    border: isActive ? `1.5px solid ${color}` : '1px solid transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.12s ease',
                  }}
                >
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: isActive ? color : '#e2e8f0',
                      color: isActive ? '#ffffff' : '#64748b',
                      fontSize: '10px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {p.id + 1}
                  </span>
                  <span
                    style={{
                      flex: 1,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontSize: '11.5px',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? color : '#334155',
                    }}
                  >
                    {p.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Technical Image Zoom Modal ── */}
      {zoomImage && (
        <div
          onClick={() => setZoomImage(null)}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.88)',
            zIndex: 60,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            backdropFilter: 'blur(4px)',
            cursor: 'zoom-out',
          }}
        >
          <div style={{ position: 'relative', maxWidth: '92%', maxHeight: '92%' }}>
            <img
              src={asset(zoomImage)}
              alt="Phóng to sơ đồ kỹ thuật"
              style={{
                maxWidth: '100%',
                maxHeight: '82vh',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                background: '#ffffff',
              }}
            />
            <button
              onClick={() => setZoomImage(null)}
              style={{
                position: 'absolute',
                top: '-12px',
                right: '-12px',
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#ffffff',
                border: 'none',
                color: '#0f172a',
                fontSize: '15px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}
            >
              ✕
            </button>
          </div>
          <span style={{ color: '#e2e8f0', fontSize: '11px', marginTop: '10px' }}>
            Bấm bất kỳ đâu hoặc phím [Esc] để thu nhỏ sơ đồ
          </span>
        </div>
      )}
    </div>
  );
}
