'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { asset } from '@/lib/asset';
import { PIDVisualizer } from '@/components/animations/LessonAnimationsNew';
import {
  IconChevronLeft,
  IconChevronRight,
  IconList,
  IconMaximize2,
  IconMinimize2,
  IconX,
  IconCheck,
} from '@/components/ui/TechnicalIcons';

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

// 19 Semantically Structured Engineering Slides for "Closed-Loop Control with PID"
const PAGES_METADATA = [
  { id: 0, title: 'Tổng Quan & Mục Lục Bài Học', shortTitle: '01. Tổng quan', category: 'TỔNG QUAN CHƯƠNG' },
  { id: 1, title: 'Chuẩn Đầu Ra Môn Học (CLO G3)', shortTitle: '02. Chuẩn đầu ra', category: 'CHUẨN ĐẦU RA' },
  { id: 2, title: 'Mục Tiêu Học Tập (Phần 1: Lý Thuyết)', shortTitle: '03. Mục tiêu (1)', category: 'MỤC TIÊU HỌC TẬP' },
  { id: 3, title: 'Mục Tiêu Học Tập (Phần 2: Kỹ Thuật)', shortTitle: '04. Mục tiêu (2)', category: 'MỤC TIÊU HỌC TẬP' },
  { id: 4, title: 'Kiến Trúc Điều Khiển Vòng Kín Phản Hồi Âm', shortTitle: '05. Vòng kín', category: 'NGUYÊN LÝ ĐIỀU KHIỂN' },
  { id: 5, title: 'Sơ Đồ Khối Hệ Thống Tiêu Chuẩn ISA-5.1', shortTitle: '06. Sơ đồ khối', category: 'SƠ ĐỒ HỆ THỐNG' },
  { id: 6, title: 'Mô Hình Toán Học PID Liên Tục', shortTitle: '07. Công thức PID', category: 'MÔ HÌNH TOÁN HỌC' },
  { id: 7, title: 'Rời Rạc Hóa & Ngắt Chu Kỳ OB30', shortTitle: '08. Rời rạc hóa', category: 'THỰC THI THỜI GIAN THỰC' },
  { id: 8, title: 'Đối Tượng Công Nghệ Siemens PID_Compact', shortTitle: '09. PID_Compact', category: 'CẤU TRÚC PHẦN MỀM' },
  { id: 9, title: 'Giao Tiếp Tín Hiệu: Input vs Input_PER', shortTitle: '10. Tín hiệu Analog', category: 'KỸ THUẬT ĐẤU NỐI' },
  { id: 10, title: 'Bão Hòa Tích Phân & Khóa Kẹp Anti-Windup', shortTitle: '11. Anti-Windup', category: 'BẢO VỆ CHỐNG BÃO HÒA' },
  { id: 11, title: 'Dò Tự Động: Pre-Tuning & Fine-Tuning', shortTitle: '12. Dò tự động', category: 'TỰ ĐỘNG HIỆU CHUẨN' },
  { id: 12, title: 'Chế Độ Manual & Chuyển Đổi Không Giật', shortTitle: '13. Bumpless Transfer', category: 'VẬN HÀNH AN TOÀN' },
  { id: 13, title: 'Tình Huống Nhà Máy: Lò Nhiệt Luyện Thép 850°C', shortTitle: '14. Lò nhiệt luyện', category: 'ỨNG DỤNG NHÀ MÁY' },
  { id: 14, title: 'Bàn Mô Phỏng Tương Tác PID Lab', shortTitle: '15. Bàn mô phỏng', category: 'THỰC HÀNH MÔ PHỎNG' },
  { id: 15, title: 'Ma Trận Chẩn Đoán Lỗi & Xử Lý Sự Cố', shortTitle: '16. Chẩn đoán lỗi', category: 'CHẨN ĐOÁN SỰ CỐ' },
  { id: 16, title: 'Câu Hỏi Ôn Tập Củng Cố (Phần 1: Câu 01–04)', shortTitle: '17. Ôn tập (1)', category: 'CÂU HỎI ÔN TẬP' },
  { id: 17, title: 'Câu Hỏi Ôn Tập Củng Cố (Phần 2: Câu 05–07)', shortTitle: '18. Ôn tập (2)', category: 'CÂU HỎI ÔN TẬP' },
  { id: 18, title: 'Tổng Kết Chương & Kế Hoạch Tiếp Theo', shortTitle: '19. Tổng kết', category: 'TỔNG KẾT BÀI HỌC' },
];

// Structured Lecturer Speaking Notes for All 19 Slides
const SPEAKER_NOTES: Record<number, { cue: string; focus: string; formula?: string; tip: string }> = {
  0: {
    cue: 'Giới thiệu tổng quan cấu trúc 19 slide chuyên sâu về điều khiển vòng kín PID trên PLC Siemens S7-1200.',
    focus: 'Khái quát lộ trình từ mô hình lý thuyết liên tục, rời rạc hóa thời gian thực đến đối tượng công nghệ PID_Compact.',
    tip: 'Nhắc sinh viên ghi chép các thông số Kp, Ti, Td và chu kỳ lấy mẫu Ts.',
  },
  1: {
    cue: 'Nhấn mạnh chuẩn đầu ra CLO G3 theo chuẩn kiểm định ABET / CDIO của khối ngành Kỹ thuật Điều khiển.',
    focus: 'Khả năng mô hình hóa, thiết kế thuật toán và cấu hình thực thi thời gian thực trên PLC công nghiệp.',
    tip: 'Yêu cầu sinh viên nắm chắc điều kiện để đạt điểm A trong bài thực hành.',
  },
  2: {
    cue: 'Mục tiêu lý thuyết: Nắm vững hàm truyền liên tục, vai trò của từng khâu P, I, D và cơ chế phản hồi âm.',
    focus: 'Phân tích sai số điều khiển e(t) = SP(t) - PV(t) và ảnh hưởng của nhiễu tải d(t).',
    formula: 'e(t) = SP(t) - PV(t)',
    tip: 'Vẽ sơ đồ vòng hồi tiếp âm lên bảng để sinh viên định vị các luồng tín hiệu.',
  },
  3: {
    cue: 'Mục tiêu kỹ thuật: Cấu hình Technology Object PID_Compact trong TIA Portal V18, gán ngắt chu kỳ OB30.',
    focus: 'Sử dụng chân ngõ vào Input_PER (mã WORD 0..27648) để giảm tải tính toán cho CPU.',
    tip: 'Nhấn mạnh không bao giờ gán ngắt chu kỳ nhỏ hơn thời gian thực thi của thuật toán.',
  },
  4: {
    cue: 'Kiến trúc điều khiển vòng kín phản hồi âm: So sánh độ nhạy với vòng hở khi xuất hiện nhiễu tải.',
    focus: 'Mô tả đường truyền phản hồi, thời gian trễ của quá trình (Dead Time) và hằng số thời gian quán tính.',
    tip: 'Lấy ví dụ lái xe ô tô: mắt nhìn khoảng cách (Sensor), não tính toán (PLC), chân đạp ga/phanh (Actuator).',
  },
  5: {
    cue: 'Sơ đồ khối tiêu chuẩn ISA-5.1: Hướng dẫn đọc ký hiệu thiết bị đo lường và van điều khiển trong nhà máy.',
    focus: 'Phân biệt TT (Temperature Transmitter), TIC (Temperature Indicator Controller), TCV (Temperature Control Valve).',
    tip: 'Nhấn mạnh đường nét đứt biểu thị tín hiệu điện 4–20 mA, đường có gạch chéo là tín hiệu khí nén.',
  },
  6: {
    cue: 'Mô hình toán học PID liên tục: Phân tích 3 thành phần P (tác động hiện tại), I (quá khứ), D (tương lai).',
    focus: 'Quan hệ giữa độ lợi Kp, thời gian tích phân Ti (giây) và thời gian vi phân Td (giây).',
    formula: 'u(t) = Kp [ e(t) + (1/Ti) ∫ e(τ)dτ + Td (de(t)/dt) ]',
    tip: 'Giải thích vì sao tăng Kp làm hệ thống nhanh hơn nhưng dễ dao động mất ổn định.',
  },
  7: {
    cue: 'Rời rạc hóa thuật toán: Vì sao bắt buộc phải gọi PID_Compact trong ngắt chu kỳ OB30 thay vì OB1?',
    focus: 'OB1 có chu kỳ quét co giãn (jitter); nếu Ts thay đổi liên tục, khâu vi phân và tích phân số sẽ bị méo nghiêm trọng.',
    formula: 'Ts = const (Cyclic Interrupt OB30: 100 ms)',
    tip: 'Đặt câu hỏi kiểm tra: Điều gì xảy ra nếu một vòng lặp FOR dài trong OB1 làm tăng scan time gấp đôi?',
  },
  8: {
    cue: 'Cấu trúc khối công nghệ Siemens PID_Compact: Khối hàm chuẩn hóa tích hợp sẵn trong firmware S7-1200.',
    focus: 'Cấu trúc Instance DB lưu trữ toàn bộ trạng thái thuật toán, cờ báo chế độ State và mã lỗi Error.',
    tip: 'Hướng dẫn sinh viên cách mở Technology Objects > Add new object > PID_Compact trong TIA Portal.',
  },
  9: {
    cue: 'Giao tiếp tín hiệu Analog: Phân biệt giữa Input (REAL) và Input_PER (WORD 0..27648).',
    focus: 'Input_PER tự động xử lý hàm Scale/Unscale bên trong khối, tiết kiệm bộ nhớ và chu kỳ CPU.',
    tip: 'Lưu ý khi kiểm tra tín hiệu: 4 mA tương ứng 0 count, 20 mA tương ứng 27648 count.',
  },
  10: {
    cue: 'Bão hòa tích phân (Integral Windup) & Cơ chế Anti-Windup: Khái niệm sống còn trong điều khiển thực tế.',
    focus: 'Khi van mở kịch trần 100%, sai số vẫn còn làm khâu I tiếp tục tích lũy vô hạn. Bộ điều khiển bị kẹp không thể phục hồi kịp khi PV đạt SP.',
    tip: 'Giải thích phương pháp Clamping (khóa tích phân khi u chạm trần) của PID_Compact.',
  },
  11: {
    cue: 'Tự động dò tham số: Pre-Tuning (dò thô) và Fine-Tuning (dò tinh).',
    focus: 'Pre-Tuning xuất bước nhảy tìm điểm uốn (Inflection Point); Fine-Tuning tạo dao động giới hạn tìm biên ổn định.',
    tip: 'Lưu ý: Không thực hiện Pre-Tuning khi hệ thống đang vận hành tải nặng gần điểm bão hòa.',
  },
  12: {
    cue: 'Chế độ Manual & Chuyển đổi không giật (Bumpless Transfer): Bảo vệ cơ khí cho van và động cơ.',
    focus: 'Khi chuyển từ Manual sang Auto, khâu tích phân tự động nạp giá trị ngõ ra Manual hiện tại để u(t) không bị giật đột ngột.',
    tip: 'Nhắc lại rủi ro gãy khớp nối cơ khí nếu chuyển chế độ làm van nhảy từ 20% lên 90% tức thời.',
  },
  13: {
    cue: 'Tình huống nhà máy: Lò nhiệt luyện thép 850°C. Phân tích sự cố tụt 150°C khi mở cửa nạp phôi.',
    focus: 'Bộ PID_Compact phát hiện sai số e(t) gia tăng và tự động tăng công suất SCR lên 95% để bù nhiệt trong 45 giây.',
    tip: 'Liên hệ giữa công thức lý thuyết và bài toán kinh tế: hỏng một mẻ thép thiệt hại hàng trăm triệu đồng.',
  },
  14: {
    cue: 'Bàn mô phỏng tương tác: Hướng dẫn sinh viên tương tác trực tiếp với các thanh trượt Kp, Ti, Td.',
    focus: 'Quan sát đồ thị đáp ứng thời gian thực (Step Response), phân tích độ vọt lố (Overshoot) và thời gian xác lập (Settling Time).',
    tip: 'Cho sinh viên thử nghiệm: Giảm Ti về 0 để quan sát hệ thống rơi vào trạng thái dao động tự do.',
  },
  15: {
    cue: 'Ma trận chẩn đoán sự cố: Hướng dẫn quy trình xử lý 3 lỗi kinh điển nhất của vòng lặp PID trong nhà máy.',
    focus: '1. Dao động chu kỳ chậm (Kp quá lớn hoặc Ti quá nhỏ); 2. Không bao giờ đạt SP (bão hòa ngõ ra); 3. Lỗi đứt dây tín hiệu 4–20 mA.',
    tip: 'Nhắc sinh viên nguyên tắc 80/20: 80% sự cố PID bắt nguồn từ đấu nối cảm biến và kẹt cơ khí van, không phải thuật toán.',
  },
  16: {
    cue: 'Phần câu hỏi ôn tập 1: Củng cố lý thuyết cốt lõi về mô hình vi tích phân và kiến trúc thời gian thực.',
    focus: 'Yêu cầu sinh viên trả lời trực tiếp tại lớp về vai trò của từng thành phần và lý do chọn ngắt OB30.',
    tip: 'Dành 5 phút để gọi ngẫu nhiên sinh viên tóm tắt lại ý chính.',
  },
  17: {
    cue: 'Phần câu hỏi ôn tập 2: Củng cố kiến thức vận hành, chống bão hòa tích phân và chuyển đổi không giật.',
    focus: 'Đảm bảo sinh viên phân biệt được cơ chế Anti-Windup và Bumpless Transfer.',
    tip: 'Nhấn mạnh câu hỏi số 05 và 07 thường xuyên xuất hiện trong đề thi kết thúc học phần.',
  },
  18: {
    cue: 'Tổng kết bài học: Đánh giá mức độ hoàn thành chuẩn đầu ra CLO G3 của sinh viên.',
    focus: 'Khái quát toàn bộ 19 nội dung đã làm chủ và chuẩn bị chuyển tiếp sang Bài 11: Mạng truyền thông công nghiệp PROFINET.',
    tip: 'Giao bài tập thiết kế khối PID_Compact trên TIA Portal cho đồ án môn học.',
  },
};

export default function LessonPaginatedPresentation({
  lesson,
  content,
  prevLesson,
  nextLesson,
}: Props) {
  const [currentPage, setCurrentPage] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const totalPages = PAGES_METADATA.length;
  const color = '#0072BD'; // MATLAB primary blue

  const handlePrev = useCallback(() => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  }, [currentPage]);

  const handleNext = useCallback(() => {
    if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
  }, [currentPage, totalPages]);

  // Auto-hiding navigation bar in presentation/fullscreen mode
  const resetHideTimer = useCallback(() => {
    setControlsVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (isFullscreen) {
      hideTimerRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, 3000);
    }
  }, [isFullscreen]);

  useEffect(() => {
    const onActivity = () => resetHideTimer();
    window.addEventListener('mousemove', onActivity);
    window.addEventListener('keydown', onActivity);
    window.addEventListener('touchstart', onActivity);
    resetHideTimer();
    return () => {
      window.removeEventListener('mousemove', onActivity);
      window.removeEventListener('keydown', onActivity);
      window.removeEventListener('touchstart', onActivity);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [resetHideTimer]);

  // Keyboard navigation: PowerPoint standard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName) || (target as HTMLInputElement)?.type === 'range') {
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
        setCurrentPage(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setCurrentPage(totalPages - 1);
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setNotesOpen((prev) => !prev);
      } else if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setDrawerOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        if (zoomImage) setZoomImage(null);
        else if (notesOpen) setNotesOpen(false);
        else if (drawerOpen) setDrawerOpen(false);
        else if (isFullscreen) {
          if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
          setIsFullscreen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, zoomImage, drawerOpen, notesOpen, isFullscreen, handleNext, handlePrev]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const activeNote = SPEAKER_NOTES[currentPage] || {
    cue: 'Giảng viên phân tích chi tiết các nguyên lý kỹ thuật trên slide.',
    focus: 'Trọng tâm bài giảng chuẩn hóa theo tiêu chuẩn công nghiệp.',
    tip: 'Nhắc sinh viên liên hệ thực tế sản xuất.',
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        maxWidth: isFullscreen ? '100vw' : '1360px',
        margin: '0 auto',
        height: isFullscreen ? '100vh' : '100%',
        background: '#ffffff',
        borderRadius: isFullscreen ? '0px' : '4px',
        border: isFullscreen ? 'none' : '1px solid #cbd5e1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        position: isFullscreen ? 'fixed' : 'relative',
        top: isFullscreen ? 0 : 'auto',
        left: isFullscreen ? 0 : 'auto',
        zIndex: isFullscreen ? 9999 : 1,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* ── Top Progress Line ── */}
      <div style={{ height: '3px', width: '100%', background: '#e2e8f0', flexShrink: 0 }}>
        <div
          style={{
            height: '100%',
            width: `${((currentPage + 1) / totalPages) * 100}%`,
            background: color,
            transition: 'width 0.2s ease',
          }}
        />
      </div>

      {/* ── Top Header Bar (Technical MATLAB / Engineering Utility Style) ── */}
      <div
        style={{
          padding: '8px 20px',
          background: '#f8fafc',
          borderBottom: '1px solid #cbd5e1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'nowrap',
          gap: '12px',
          flexShrink: 0,
        }}
      >
        {/* Left: Academic Context */}
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: '10.5px',
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: '#475569',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {lesson.course} · BÀI {lesson.id} · {PAGES_METADATA[currentPage].category}
          </div>
          <div
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#0f172a',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Bài {lesson.id}: {lesson.title}
          </div>
        </div>

        {/* Center: Slide Position Indicator (PowerPoint Style) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#ffffff',
          padding: '4px 12px',
          borderRadius: '4px',
          border: '1px solid #cbd5e1',
        }}>
          <span style={{
            fontSize: '11.5px',
            fontWeight: 700,
            fontFamily: 'Consolas, monospace',
            color: '#0072BD',
          }}>
            [Slide {String(currentPage + 1).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}]
          </span>
          <span style={{ fontSize: '12px', color: '#64748b' }}>·</span>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>
            {PAGES_METADATA[currentPage].title}
          </span>
        </div>

        {/* Right: Technical Actions with Consistent Lucide SVG Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          {/* Speaker Notes Toggle (Key: N) */}
          <button
            onClick={() => setNotesOpen((prev) => !prev)}
            title="Bật/Tắt Ghi chú giảng viên (Phím: N)"
            style={{
              padding: '5px 10px',
              borderRadius: '4px',
              border: notesOpen ? '1px solid #0072BD' : '1px solid #cbd5e1',
              background: notesOpen ? '#eff6ff' : '#ffffff',
              color: notesOpen ? '#0072BD' : '#334155',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>Ghi chú</span>
            <span style={{ fontSize: '10px', color: '#64748b' }}>(N)</span>
          </button>

          {/* Outline Button (Key: M) */}
          <button
            onClick={() => setDrawerOpen(true)}
            title="Mở mục lục toàn bộ slide bài học (Phím: M)"
            style={{
              padding: '5px 10px',
              borderRadius: '4px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#0f172a',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <IconList size={14} />
            <span>Mục lục ({totalPages})</span>
          </button>

          {/* Fullscreen Button (Key: F) */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Thu nhỏ cửa sổ (Phím: F)' : 'Toàn màn hình trình chiếu (Phím: F)'}
            style={{
              padding: '5px 10px',
              borderRadius: '4px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#475569',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {isFullscreen ? <IconMinimize2 size={14} /> : <IconMaximize2 size={14} />}
            <span>{isFullscreen ? 'Thoát' : 'Toàn màn hình'}</span>
          </button>
        </div>
      </div>

      {/* ── Main Content Stage: Exactly 1 Page Displayed at a Time, Zero Scrollbars ── */}
      <div
        style={{
          flex: 1,
          padding: isFullscreen ? '20px 32px 72px 32px' : '16px 24px 60px 24px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        {/* ════════════════════════════════════════════════════════════════════
           PAGE 0: Overview & Course Roadmap
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 0 ? 'flex' : 'none', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                GIÁO TRÌNH ĐIỀU KHIỂN LOGIC KHẢ TRÌNH PLC S7-1200 · IEC 61131-2
              </span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0', lineHeight: 1.25 }}>
              Bài {lesson.id}: {lesson.title}
            </h1>
            <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
              {lesson.description}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', flex: 1, alignItems: 'stretch', margin: '14px 0' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  TỔNG QUAN CHUYÊN MÔN:
                </span>
                <p style={{ margin: 0, fontSize: '12.5px', color: '#334155', lineHeight: 1.65 }}>
                  {content?.overview || 'Thuật toán PID (Proportional-Integral-Derivative) là tiêu chuẩn vàng trong điều khiển quá trình công nghiệp, chiếm hơn 90% các vòng lặp kín trong tự động hóa. Bài học này làm chủ lý thuyết và thực hành cấu hình PID_Compact trên PLC S7-1200.'}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 8px', borderRadius: '4px', background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155' }}>
                  Thời lượng: ~{lesson.durationMinutes} phút
                </span>
                <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 8px', borderRadius: '4px', background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155' }}>
                  Chuẩn đầu ra: {lesson.clo}
                </span>
                <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 8px', borderRadius: '4px', background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155' }}>
                  Thực hành: {lesson.lab}
                </span>
              </div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                CẤU TRÚC 19 TRANG BÀI HỌC:
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11.5px', color: '#334155' }}>
                <div>• <strong>01–04:</strong> Chuẩn đầu ra CLO & Mục tiêu học tập chi tiết</div>
                <div>• <strong>05–08:</strong> Kiến trúc vòng kín, sơ đồ khối & mô hình toán học</div>
                <div>• <strong>09–13:</strong> Cấu hình PID_Compact, Analog & Anti-Windup</div>
                <div>• <strong>14–16:</strong> Ứng dụng lò nhiệt 850°C, Bàn mô phỏng & Sự cố</div>
                <div>• <strong>17–19:</strong> Câu hỏi ôn tập củng cố & Tổng kết chương</div>
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
           PAGE 1: Course Learning Outcomes (CLO G3)
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 1 ? 'flex' : 'none', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              CHUẨN ĐẦU RA MÔN HỌC (COURSE LEARNING OUTCOMES)
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Chuẩn Đầu Ra CLO G3: Điều Khiển Quá Trình Liên Tục
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', flex: 1, alignContent: 'center', margin: '14px 0' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>MỨC ĐỘ 1: NHẬN THỨC</span>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>Hiểu Bản Chất Vòng Kín</h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: 1.55 }}>
                  Nắm vững nguyên lý phản hồi âm, cấu trúc sai số điều khiển $e(t) = SP - PV$ và phân biệt rõ rệt giữa điều khiển vòng hở và vòng kín trong môi trường có tải động.
                </p>
              </div>
              <div style={{ marginTop: '10px', fontSize: '11px', color: '#0072BD', fontWeight: 600 }}>Tiêu chuẩn ABET CAC (1)</div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>MỨC ĐỘ 2: ỨNG DỤNG</span>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>Lập Trình PID_Compact</h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: 1.55 }}>
                  Thành thạo cấu hình khối hàm công nghệ PID_Compact trong TIA Portal, gọi chuẩn xác trong ngắt chu kỳ OB30 với chu kỳ lấy mẫu bất biến $T_s = 100\text{'{ ms}'}$.
                </p>
              </div>
              <div style={{ marginTop: '10px', fontSize: '11px', color: '#0072BD', fontWeight: 600 }}>Kỹ năng thực hành PLC</div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>MỨC ĐỘ 3: PHÂN TÍCH</span>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>Hiệu Chỉnh & Chẩn Đoán</h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: 1.55 }}>
                  Vận dụng thuật toán tự động dò tham số Pre-Tuning và Fine-Tuning; nhận diện hiện tượng bão hòa tích phân (Integral Windup) và cấu hình khóa kẹp bảo vệ van.
                </p>
              </div>
              <div style={{ marginTop: '10px', fontSize: '11px', color: '#0072BD', fontWeight: 600 }}>Giải quyết sự cố thực tế</div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
           PAGE 2: Objectives Part 1 (Theory)
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 2 ? 'flex' : 'none', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              MỤC TIÊU HỌC TẬP (PHẦN 1: CƠ SỞ LÝ THUYẾT ĐIỀU KHIỂN)
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Nền Tảng Lý Thuyết Điều Khiển Quá Trình
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', flex: 1, alignContent: 'center', margin: '12px 0' }}>
            {[
              {
                id: '01',
                title: 'Hệ Thống Hồi Tiếp Âm (Negative Feedback)',
                desc: 'Phân tích cơ chế so sánh liên tục giữa giá trị đặt (Setpoint - SP) và giá trị thực tế (Process Variable - PV) để tự động triệt tiêu sai số tác động.',
              },
              {
                id: '02',
                title: 'Vai Trò Độc Lập Của 3 Khâu P - I - D',
                desc: 'Khâu P tác động tức thời theo biên độ sai lệch; khâu I tích lũy quá khứ để xóa sai số xác lập; khâu D dự báo xu hướng tương lai để giảm vọt lố.',
              },
              {
                id: '03',
                title: 'Hiện Tượng Bão Hòa Tích Phân (Windup)',
                desc: 'Nhận thức rủi ro hư hỏng cơ khí khi chấp hành kịch trần (100%) mà khâu I vẫn tiếp tục cộng dồn, gây chậm phục hồi và vọt lố nghiêm trọng.',
              },
              {
                id: '04',
                title: 'Chu Kỳ Lấy Mẫu Thời Gian Thực (Sampling Time)',
                desc: 'Hiểu rõ nguyên lý rời rạc hóa phương trình vi phân và điều kiện tiên quyết giữ chu kỳ lấy mẫu Ts bất biến trong hệ thống điều khiển số.',
              },
            ].map((item) => (
              <div key={item.id} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ width: 22, height: 22, borderRadius: '2px', background: '#0072BD', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>
                    {item.id}
                  </span>
                  <strong style={{ fontSize: '13px', color: '#0f172a' }}>{item.title}</strong>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: 1.55, paddingLeft: '30px' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
           PAGE 3: Objectives Part 2 (Engineering Skills)
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 3 ? 'flex' : 'none', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              MỤC TIÊU HỌC TẬP (PHẦN 2: KỸ THUẬT TRIỂN KHAI PHẦN CỨNG & TIA PORTAL)
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Kỹ Năng Kỹ Thuật Công Nghiệp Với Siemens S7-1200
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', flex: 1, alignContent: 'center', margin: '12px 0' }}>
            {[
              {
                id: '05',
                title: 'Cấu Hình Technology Object PID_Compact',
                desc: 'Khởi tạo đối tượng công nghệ, cấu hình tham số vật lý ngõ vào/ra, đặt giới hạn cảnh báo trên/dưới và liên kết chân tín hiệu.',
              },
              {
                id: '06',
                title: 'Tổ Chức Ngắt Chu Kỳ OB30 (Cyclic Interrupt)',
                desc: 'Thiết lập khối tổ chức OB30 hoạt động với độ trễ thấp, tuyệt đối không gọi PID trong OB1 nhằm loại bỏ hoàn toàn hiện tượng méo chu kỳ quét.',
              },
              {
                id: '07',
                title: 'Xử Lý Tín Hiệu Analog Chuẩn Hóa Input_PER',
                desc: 'Đấu nối và xử lý trực tiếp tín hiệu dòng điện 4–20 mA từ cảm biến thông qua thanh ghi ngoại vi %IW64 (%IW66) với độ phân giải 16-bit.',
              },
              {
                id: '08',
                title: 'Vận Hành Dò Tự Động Pre-Tuning & Fine-Tuning',
                desc: 'Vận hành công cụ Commissioning của TIA Portal để dò tham số tối ưu đáp ứng quá trình, đồng thời làm chủ chế độ chuyển đổi Bumpless Transfer.',
              },
            ].map((item) => (
              <div key={item.id} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ width: 22, height: 22, borderRadius: '2px', background: '#0072BD', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>
                    {item.id}
                  </span>
                  <strong style={{ fontSize: '13px', color: '#0f172a' }}>{item.title}</strong>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: 1.55, paddingLeft: '30px' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
           PAGE 4: Closed-Loop Architecture
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 4 ? 'flex' : 'none', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              NGUYÊN LÝ ĐIỀU KHIỂN · KIẾN TRÚC PHẢN HỒI ÂM
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Bản Chất Điều Khiển Vòng Kín Phản Hồi Âm (Negative Feedback)
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', flex: 1, alignItems: 'center', margin: '14px 0' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  ĐỊNH NGHĨA KỸ THUẬT:
                </span>
                <p style={{ margin: 0, fontSize: '12.5px', color: '#334155', lineHeight: 1.6 }}>
                  Hệ thống điều khiển vòng kín là hệ thống có tín hiệu đầu ra (Process Variable - PV) được đo lường và đưa ngược về điểm trừ so sánh với tín hiệu đặt (Setpoint - SP) để tính toán sai số $e(t) = SP(t) - PV(t)$.
                </p>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '12px', fontFamily: 'Consolas, monospace', fontSize: '12px', color: '#0f172a' }}>
                <div style={{ color: '#0072BD', fontWeight: 700 }}>// Phương trình sai số điều khiển</div>
                <div>e(t) = SP(t) - PV(t)</div>
                <div style={{ color: '#64748b', marginTop: '4px' }}>// Khi xuất hiện nhiễu tải (Disturbance d(t)):</div>
                <div>PV_moi = PV_cu + d(t) ➔ e(t) thay đổi ➔ u(t) tự động bù</div>
              </div>

              <div style={{ fontSize: '11.5px', color: '#475569', lineHeight: 1.5 }}>
                Khác biệt căn bản với vòng hở: Vòng hở hoàn toàn mù trước tải động và trôi dạt thông số. Vòng kín liên tục tự hiệu chỉnh để giữ sai số xác lập tiến về 0.
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', marginBottom: '10px' }}>
                5 THÀNH PHẦN VẬT LÝ CỦA VÒNG LẶP:
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                <div style={{ padding: '8px 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                  <strong>1. Điểm đặt (SP):</strong> Giá trị mục tiêu mong muốn từ HMI / SCADA.
                </div>
                <div style={{ padding: '8px 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                  <strong>2. Điểm so sánh (Σ):</strong> Mạch trừ tính toán sai số $e(t) = SP - PV$.
                </div>
                <div style={{ padding: '8px 10px', background: '#eff6ff', border: '1px solid #0072BD', borderRadius: '4px', color: '#0072BD', fontWeight: 600 }}>
                  <strong>3. Bộ điều khiển (PLC):</strong> Khối thuật toán PID xử lý số thực trong OB30.
                </div>
                <div style={{ padding: '8px 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                  <strong>4. Cơ cấu chấp hành:</strong> Van điều khiển khí nén, biến tần VFD, bộ gia nhiệt thyristor SCR.
                </div>
                <div style={{ padding: '8px 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                  <strong>5. Cảm biến đo lường:</strong> Can nhiệt PT100, cảm biến áp suất 4–20 mA gửi tín hiệu về.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
           PAGE 5: ISA-5.1 Block Diagram
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 5 ? 'flex' : 'none', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              SƠ ĐỒ HỆ THỐNG · TIÊU CHUẨN KỸ THUẬT QUỐC TẾ
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Sơ Đồ Khối Vòng Điều Khiển Theo Tiêu Chuẩn ISA-5.1
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', flex: 1, alignItems: 'center', margin: '14px 0' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div
                onClick={() => setZoomImage('pid_block_diagram_1786878015688.jpg')}
                style={{ width: '100%', height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-in', background: '#ffffff', borderRadius: '4px', border: '1px solid #cbd5e1', overflow: 'hidden' }}
                title="Nhấp để phóng to toàn màn hình sơ đồ khối"
              >
                <img
                  src={asset('pid_block_diagram_1786878015688.jpg')}
                  alt="Sơ đồ khối PID theo tiêu chuẩn ISA-5.1"
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </div>
              <span style={{ fontSize: '11px', color: '#64748b', marginTop: '8px', fontStyle: 'italic' }}>
                Hình 10.1: Sơ đồ khối vòng điều khiển kín với điểm đặt, khâu hiệu chỉnh và đối tượng quá trình
              </span>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase' }}>
                QUY CHUẨN KÝ HIỆU ISA-5.1:
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#334155' }}>
                <div style={{ padding: '6px 8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                  <strong>TT (Temperature Transmitter):</strong> Cảm biến kiêm bộ chuyển đổi tín hiệu nhiệt độ chuẩn 4–20 mA.
                </div>
                <div style={{ padding: '6px 8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                  <strong>TIC (Temperature Indicator Controller):</strong> Bộ điều khiển và hiển thị nhiệt độ (chính là PLC S7-1200).
                </div>
                <div style={{ padding: '6px 8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                  <strong>TY (I/P Converter):</strong> Bộ chuyển đổi tín hiệu điện áp/dòng điện sang áp suất khí nén (Current to Pressure).
                </div>
                <div style={{ padding: '6px 8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                  <strong>TCV (Temperature Control Valve):</strong> Van điều khiển điều tiết lưu lượng môi chất cấp nhiệt.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
           PAGE 6: Continuous PID Mathematical Formulation
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 6 ? 'flex' : 'none', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              MÔ HÌNH TOÁN HỌC · DẠNG LIÊN TỤC TIÊU CHUẨN
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Phương Trình Vi Tích Phân Tỷ Lệ PID Liên Tục
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', flex: 1, alignItems: 'stretch', margin: '14px 0' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  PHƯƠNG TRÌNH DẠNG TƯƠNG TÁC (IDEAL / STANDARD PID):
                </span>
                <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '14px', fontFamily: 'Consolas, monospace', fontSize: '13.5px', color: '#0f172a', fontWeight: 700, marginBottom: '10px' }}>
                  u(t) = K_p · [ e(t) + (1 / T_i) · ∫ e(τ) dτ + T_d · (de(t) / dt) ]
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
                  Trong đó: $K_p$ là độ lợi tỷ lệ (Proportional Gain); $T_i$ là thời gian tích phân (Integral Time, giây); $T_d$ là thời gian vi phân (Derivative Time, giây).
                </p>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '12px', fontSize: '11.5px', color: '#334155' }}>
                <strong>Dạng song song tương đương (Parallel Form):</strong><br />
                $u(t) = K_p \cdot e(t) + K_i \cdot \int e(\tau)d\tau + K_d \cdot \frac{'{de(t)}'}{'{dt}'}$ với $K_i = \frac{'{K_p}'}{'{T_i}'}$ và $K_d = K_p \cdot T_d$.
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
              <div style={{ background: '#eff6ff', border: '1px solid #0072BD', borderRadius: '4px', padding: '12px' }}>
                <strong style={{ fontSize: '12.5px', color: '#0072BD' }}>Khâu P (Proportional):</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '11.5px', color: '#334155', lineHeight: 1.5 }}>
                  Phản ứng tức thời theo độ lớn sai lệch. Tăng $K_p$ giúp rút ngắn thời gian đáp ứng nhưng nếu quá lớn sẽ gây dao động mất ổn định.
                </p>
              </div>
              <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '4px', padding: '12px' }}>
                <strong style={{ fontSize: '12.5px', color: '#15803d' }}>Khâu I (Integral):</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '11.5px', color: '#334155', lineHeight: 1.5 }}>
                  Cộng dồn sai số theo thời gian. Triệt tiêu hoàn toàn sai số xác lập tĩnh ($e_{'{ss}'} = 0$). Giảm $T_i$ làm tăng tốc độ xóa sai số.
                </p>
              </div>
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '4px', padding: '12px' }}>
                <strong style={{ fontSize: '12.5px', color: '#b45309' }}>Khâu D (Derivative):</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '11.5px', color: '#334155', lineHeight: 1.5 }}>
                  Phản ứng theo tốc độ thay đổi sai số để hãm đà tăng, dập tắt dao động và giảm vọt lố. Rất nhạy cảm với nhiễu ngõ vào.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
           PAGE 7: Discretization & Cyclic Interrupt OB30
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 7 ? 'flex' : 'none', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              THỰC THI THỜI GIAN THỰC · RỜI RẠC HÓA THUẬT TOÁN
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Rời Rạc Hóa Phương Trình & Ngắt Chu Kỳ OB30
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', flex: 1, alignItems: 'stretch', margin: '14px 0' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  CÔNG THỨC RỜI RẠC VỊ TRÍ (POSITIONAL FORM):
                </span>
                <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '12px', fontFamily: 'Consolas, monospace', fontSize: '12.5px', color: '#0f172a', lineHeight: 1.6, marginBottom: '10px' }}>
                  u[k] = K_p · e[k] + (K_p · T_s / T_i) · ∑ e[i] + (K_p · T_d / T_s) · (e[k] - e[k-1])
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
                  Trong đó: $k$ là bước lấy mẫu hiện tại; $T_s$ là chu kỳ lấy mẫu bất biến (Sampling Time); tích phân được xấp xỉ bằng hình chữ nhật hoặc hình thang; vi phân bằng sai phân lùi.
                </p>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '12px', fontSize: '11.5px', color: '#334155' }}>
                <strong>Dạng gia lượng (Velocity Form):</strong><br />
                $\Delta u[k] = u[k] - u[k-1] = q_0 \cdot e[k] + q_1 \cdot e[k-1] + q_2 \cdot e[k-2]$.<br />
                Ưu điểm: Tránh được cú sốc khi chuyển chế độ Manual sang Auto và tự nhiên ngăn ngừa bão hòa tích phân.
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase' }}>
                VÌ SAO BẮT BUỘC PHẢI GỌI TRONG OB30?
              </div>
              <div style={{ fontSize: '12px', color: '#334155', lineHeight: 1.6 }}>
                Khối tổ chức OB1 chạy với chu kỳ biến động (Scan Time Jitter từ vài ms đến hàng chục ms tùy thuộc số lượng logic thực thi). Nếu gọi hàm PID trong OB1, $T_s$ bị biến thiên liên tục, dẫn đến:
              </div>
              <div style={{ padding: '8px 10px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '11.5px', color: '#b91c1c' }}>
                • Sai số tích phân bị phóng đại hoặc suy giảm bất thường.
              </div>
              <div style={{ padding: '8px 10px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '11.5px', color: '#b91c1c' }}>
                • Khâu vi phân sinh ra các gai đột biến do mẫu số $\Delta t$ không đều.
              </div>
              <div style={{ fontSize: '11.5px', color: '#15803d', fontWeight: 600 }}>
                ➔ OB30 ngắt cứng CPU định kỳ chính xác từng micro-giây, đảm bảo $T_s$ luôn bất biến.
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
           PAGE 8: Technology Object Siemens PID_Compact
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 8 ? 'flex' : 'none', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              CẤU TRÚC PHẦN MỀM · SIEMENS TIA PORTAL V18
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Đối Tượng Công Nghệ Siemens PID_Compact
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', flex: 1, alignContent: 'center', margin: '14px 0' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>NHÓM NGÕ VÀO (INPUTS)</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#334155' }}>
                  <div>• <strong>Setpoint (REAL):</strong> Giá trị điểm đặt mong muốn.</div>
                  <div>• <strong>Input (REAL):</strong> Giá trị đo lường đã scale (0.0–100.0%).</div>
                  <div>• <strong>Input_PER (WORD):</strong> Giá trị đọc thẳng từ ngõ vào analog (%IW64).</div>
                  <div>• <strong>ManualEnable (BOOL):</strong> Cờ kích hoạt điều khiển bằng tay.</div>
                  <div>• <strong>ManualValue (REAL):</strong> Giá trị ngõ ra khi ở chế độ tay.</div>
                </div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>NHÓM NGÕ RA (OUTPUTS)</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#334155' }}>
                  <div>• <strong>Output (REAL):</strong> Giá trị điều khiển chuẩn hóa (0.0–100.0%).</div>
                  <div>• <strong>Output_PER (WORD):</strong> Giá trị xuất thẳng ra thanh ghi analog (%QW64).</div>
                  <div>• <strong>Output_PWM (BOOL):</strong> Tín hiệu xung điều chế độ rộng cho relay bán dẫn.</div>
                  <div>• <strong>State (INT):</strong> Trạng thái vận hành hiện tại (0..4).</div>
                  <div>• <strong>Error (BOOL):</strong> Cờ báo lỗi của khối điều khiển.</div>
                </div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>CÁC CHẾ ĐỘ VẬN HÀNH (STATE)</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#334155' }}>
                  <div>• <strong>State = 0 (Inactive):</strong> Khối hàm dừng hoạt động.</div>
                  <div>• <strong>State = 1 (Pre-Tuning):</strong> Đang chạy quy trình dò thô.</div>
                  <div>• <strong>State = 2 (Fine-Tuning):</strong> Đang chạy quy trình dò tinh.</div>
                  <div>• <strong>State = 3 (Automatic):</strong> Điều khiển tự động kín bình thường.</div>
                  <div>• <strong>State = 4 (Manual):</strong> Điều khiển mở trực tiếp bằng tay.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
           PAGE 9: Analog Signals: Input vs Input_PER
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 9 ? 'flex' : 'none', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              KỸ THUẬT ĐẤU NỐI & XỬ LÝ TÍN HIỆU ANALOG
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Giao Tiếp Tín Hiệu: Input vs Input_PER
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', flex: 1, alignItems: 'stretch', margin: '14px 0' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  KÊNH INPUT_PER (KHUYÊN DÙNG TRONG CÔNG NGHIỆP):
                </span>
                <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '12px', fontFamily: 'Consolas, monospace', fontSize: '12.5px', color: '#0f172a', marginBottom: '10px' }}>
                  Input_PER := %IW64; // Dải giá trị thô: 0..27648
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
                  Đọc trực tiếp mã thô từ module ADC SM1231. Khối PID_Compact tự động thực hiện việc chuyển đổi tỷ lệ dựa trên dải đo vật lý đã cấu hình trong phần cứng (ví dụ: 0 count = 0°C, 27648 count = 1000°C).
                </p>
              </div>
              <div style={{ padding: '8px 10px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '4px', fontSize: '11.5px', color: '#166534', fontWeight: 600 }}>
                Ưu điểm: Không tốn thêm lệnh NORM_X và SCALE_X, tiết kiệm chu kỳ quét CPU.
              </div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  KÊNH INPUT (SỐ THỰC REAL ĐÃ QUA XỬ LÝ):
                </span>
                <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '12px', fontFamily: 'Consolas, monospace', fontSize: '12.5px', color: '#0f172a', marginBottom: '10px' }}>
                  Input := #NhietDo_Thuc; // Dải giá trị thực: 0.0..1000.0 °C
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
                  Sử dụng khi tín hiệu đo lường nhận về qua mạng truyền thông PROFINET / Modbus TCP, hoặc tín hiệu đo đã được tính toán qua các khối lọc số trung bình động (Moving Average Filter) trước khi đưa vào bộ điều khiển.
                </p>
              </div>
              <div style={{ padding: '8px 10px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '4px', fontSize: '11.5px', color: '#1d4ed8', fontWeight: 600 }}>
                Lưu ý: Chỉ được chọn 1 trong 2 kênh (Input hoặc Input_PER) trong cấu hình khối.
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
           PAGE 10: Anti-Windup & Output Clamping
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 10 ? 'flex' : 'none', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              BẢO VỆ CHỐNG BÃO HÒA · KHÓA KẸP ANTI-WINDUP
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Bão Hòa Tích Phân & Cơ Chế Khóa Kẹp Anti-Windup
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', flex: 1, alignItems: 'stretch', margin: '14px 0' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#b91c1c', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  CƠ CHẾ PHÁT SINH BÃO HÒA (INTEGRAL WINDUP):
                </span>
                <p style={{ margin: 0, fontSize: '12px', color: '#334155', lineHeight: 1.6 }}>
                  Khi hệ thống khởi động hoặc thay đổi điểm đặt lớn, sai số $e(t)$ tồn tại kéo dài. Cơ cấu chấp hành (van) nhanh chóng đạt giới hạn vật lý tối đa ($u = 100\%$). Do van không thể mở thêm, sai số không thể giảm ngay. Khâu tích phân vẫn tiếp tục cộng dồn, đẩy giá trị toán học của khâu I lên $200\%, 500\%$.
                </p>
                <div style={{ marginTop: '10px', padding: '8px 10px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '11.5px', color: '#b91c1c' }}>
                  Hậu quả: Khi PV vượt qua SP, khâu I mất nhiều thời gian để xả lượng tích lũy dư thừa, khiến van vẫn mở toang và tạo độ vọt lố khổng lồ, gây hư hại sản phẩm nhiệt luyện.
                </div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#15803d', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  GIẢI PHÁP KHÓA KẸP (CLAMPING ANTI-WINDUP) CỦA SIEMENS:
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#334155' }}>
                  <div style={{ padding: '8px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                    <strong>1. Kiểm tra giới hạn bão hòa:</strong> So sánh tín hiệu điều khiển chưa bão hòa $u_{'{unsat}'}$ với ngưỡng trên $U_{'{max}'} = 100\%$ và ngưỡng dưới $U_{'{min}'} = 0\%$.
                  </div>
                  <div style={{ padding: '8px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                    <strong>2. Khóa tích phân có điều kiện:</strong> Nếu $u \ge U_{'{max}'}$ và $e(t) &gt; 0$ (sai số làm tăng thêm), đóng băng khâu tích phân, không cho cộng thêm: $\frac{'{d}'}{'{dt}'}I(t) = 0$.
                  </div>
                  <div style={{ padding: '8px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                    <strong>3. Xả tức thì:</strong> Ngay khi sai số đổi dấu ($e(t) &lt; 0$), khâu tích phân được mở khóa ngay lập tức để kéo van đóng lại kịp thời.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
           PAGE 11: Auto-Tuning: Pre-Tuning & Fine-Tuning
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 11 ? 'flex' : 'none', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              TỰ ĐỘNG HIỆU CHUẨN · THUẬT TOÁN DÒ TỐI ƯU CỦA SIEMENS
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Dò Tự Động: Pre-Tuning vs Fine-Tuning
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', flex: 1, alignItems: 'stretch', margin: '14px 0' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase' }}>
                    PRE-TUNING (DÒ THÔ / DÒ BAN ĐẦU):
                  </span>
                </div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>Nguyên Lý Bước Nhảy Đáp Ứng Quá Trình</h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
                  Áp dụng khi hệ thống chưa có bộ thông số ban đầu và đang ở gần điểm cân bằng nguội. Khối hàm phát bước nhảy công suất ngõ ra (Step Excitation), ghi nhận đường cong phản ứng nhiệt, xác định độ trễ thời gian chết ($L$) và độ dốc điểm uốn ($R$) để tính toán bộ thông số khởi đầu $K_p, T_i, T_d$.
                </p>
              </div>
              <div style={{ padding: '8px 10px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '11.5px', color: '#0072BD', fontWeight: 600 }}>
                Điều kiện: Sai số ban đầu $|SP - PV| &gt; 30\%$ dải đo và hệ thống đang ổn định tĩnh.
              </div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase' }}>
                    FINE-TUNING (DÒ TINH / TỐI ƯU HÓA):
                  </span>
                </div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>Nguyên Lý Dao Động Giới Hạn Relay</h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
                  Áp dụng khi hệ thống đã vận hành gần điểm làm việc đặt SP. Thuật toán tạo ra dao động nhỏ có biên độ khống chế xung quanh điểm đặt (Limit Cycle Oscillation) nhằm đo chu kỳ dao động tới hạn $T_u$ và biên độ đáp ứng, từ đó tinh chỉnh tối ưu hóa để triệt tiêu dao động dư.
                </p>
              </div>
              <div style={{ padding: '8px 10px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '11.5px', color: '#15803d', fontWeight: 600 }}>
                Kết quả: Giảm độ vọt lố xuống &lt; 5%, tối ưu hóa thời gian xác lập Settling Time.
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
           PAGE 12: Manual Mode & Bumpless Transfer
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 12 ? 'flex' : 'none', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              VẬN HÀNH AN TOÀN · CHUYỂN ĐỔI CHẾ ĐỘ
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Chế Độ Manual & Chuyển Đổi Không Giật (Bumpless Transfer)
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', flex: 1, alignItems: 'stretch', margin: '14px 0' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  ĐỊNH NGHĨA BUMPLESS TRANSFER:
                </span>
                <p style={{ margin: 0, fontSize: '12.5px', color: '#334155', lineHeight: 1.65 }}>
                  Bumpless Transfer là cơ chế bảo vệ đảm bảo ngõ ra điều khiển $u(t)$ chuyển tiếp liên tục, trơn tru, không bị nhảy bước đột ngột (step jump) khi người vận hành chuyển chế độ giữa Manual (tay) và Automatic (tự động).
                </p>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '12px', fontSize: '12px', color: '#0f172a' }}>
                <strong style={{ color: '#b91c1c' }}>Hậu quả nếu KHÔNG CÓ Bumpless Transfer:</strong><br />
                Giả sử đang mở tay ở 45%. Khi chuyển sang Auto, nếu sai số đang lớn, thuật toán PID có thể lập tức phóng $u$ lên 90%, gây giật cơ khí, đứt khớp nối van hoặc quá dòng biến tần.
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase' }}>
                CƠ CHẾ THỰC THI TRONG PID_COMPACT:
              </span>
              <div style={{ padding: '8px 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '11.5px', color: '#334155' }}>
                <strong>Auto sang Manual:</strong> Giá trị biến $ManualValue$ tự động được nạp bằng giá trị ngõ ra $Output$ hiện tại.
              </div>
              <div style={{ padding: '8px 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '11.5px', color: '#334155' }}>
                <strong>Manual sang Auto:</strong> Khâu tích phân $I(t)$ lập tức được khởi tạo lại bằng chính giá trị $ManualValue$ trừ đi thành phần tỷ lệ $K_p \cdot e(t_0)$.
              </div>
              <div style={{ fontSize: '11.5px', color: '#15803d', fontWeight: 600 }}>
                ➔ Kết quả: Tại thời điểm chuyển mạch $t_0$, ngõ ra $u(t_0^+) = u(t_0^-)$, độ nhảy bước bằng đúng 0.
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
           PAGE 13: Factory Case Study: 850°C Annealing Furnace
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 13 ? 'flex' : 'none', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              ỨNG DỤNG NHÀ MÁY THỰC TẾ · KỸ THUẬT NHIỆT LUYỆN
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Tình Huống Nhà Máy: Lò Nhiệt Luyện Thép 850°C
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', flex: 1, alignItems: 'stretch', margin: '14px 0' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  BỐI CẢNH DÂY CHUYỀN SẢN XUẤT:
                </span>
                <p style={{ margin: 0, fontSize: '12px', color: '#334155', lineHeight: 1.6 }}>
                  Lò nhiệt luyện thép tôi cao tần yêu cầu duy trì ổn định nhiệt độ tại $850^\circ\text{'{C}'} \pm 2^\circ\text{'{C}'}$. Khi công nhân mở cửa lò đưa mẻ phôi thép nguội vào, nhiệt độ tức thời bị tụt hơn $150^\circ\text{'{C}'}$. Nếu sử dụng điều khiển vòng hở, phôi bị khuyết tật giòn gãy, gây tổn thất hàng trăm triệu đồng mỗi ca.
                </p>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '12px' }}>
                <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  GIẢI PHÁP VỚI SIEMENS S7-1200 CPU 1214C:
                </span>
                <div style={{ fontSize: '11.5px', color: '#334155', lineHeight: 1.5 }}>
                  Can nhiệt Type K vỏ bọc Inconel gửi tín hiệu 4–20 mA về trạm PLC. Khối PID_Compact trong ngắt OB30 (100 ms) phát hiện độ lệch và nâng công suất bộ kích thyristor SCR lên 95% chỉ sau 2.5 giây, kéo nhiệt độ hồi phục về 850°C trong vòng 45 giây mà không hề gây vọt lố quá 852°C.
                </div>
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase' }}>
                THÔNG SỐ VẬN HÀNH THỰC TẾ:
              </span>
              <div style={{ padding: '8px 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '11.5px' }}>
                • <strong>Setpoint (SP):</strong> 850.0 °C
              </div>
              <div style={{ padding: '8px 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '11.5px' }}>
                • <strong>Độ lợi tỷ lệ Kp:</strong> 4.85
              </div>
              <div style={{ padding: '8px 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '11.5px' }}>
                • <strong>Thời gian tích phân Ti:</strong> 42.0 giây
              </div>
              <div style={{ padding: '8px 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '11.5px' }}>
                • <strong>Thời gian vi phân Td:</strong> 8.5 giây (có bộ lọc nhiễu 0.8s)
              </div>
              <div style={{ padding: '8px 10px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '4px', fontSize: '11.5px', color: '#1d4ed8', fontWeight: 600 }}>
                • <strong>Độ vọt lố thực tế:</strong> &lt; 1.8 °C (đạt yêu cầu kỹ thuật &lt; 2°C)
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
           PAGE 14: Interactive Simulation Bench (PID Visualizer)
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 14 ? 'flex' : 'none', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              THỰC HÀNH MÔ PHỎNG TƯƠNG TÁC · MATLAB / SIMULINK MODEL
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Bàn Mô Phỏng Tương Tác: Hiệu Chỉnh Đáp Ứng Bước PID
            </h2>
          </div>

          <div style={{ width: '100%', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '10px 0' }}>
            <div style={{ width: '100%' }}>
              <PIDVisualizer />
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
           PAGE 15: Fault Diagnostics & Troubleshooting Matrix
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 15 ? 'flex' : 'none', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              CHẨN ĐOÁN LỖI HIỆN TRƯỜNG · KHẮC PHỤC SỰ CỐ
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Ma Trận Chẩn Đoán Lỗi Vòng Điều Khiển PID Công Nghiệp
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', flex: 1, alignContent: 'center', margin: '14px 0' }}>
            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#b91c1c', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>SỰ CỐ 1</span>
                <h3 style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>Dao Động Tuần Hoàn Liên Tục</h3>
                <p style={{ margin: 0, fontSize: '11.5px', color: '#475569', lineHeight: 1.5 }}>
                  Nhiệt độ dao động hình sin quanh điểm đặt không dập tắt. Nguyên nhân: Hệ số $K_p$ quá cao hoặc thời gian tích phân $T_i$ quá nhỏ làm hệ rơi vào biên giới ổn định.
                </p>
              </div>
              <div style={{ marginTop: '10px', padding: '6px 8px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '11px', color: '#0072BD', fontWeight: 600 }}>
                Xử lý: Giảm Kp 30–50% hoặc tăng gấp đôi Ti.
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#b45309', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>SỰ CỐ 2</span>
                <h3 style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>Không Đạt Điểm Đặt (Offset Lớn)</h3>
                <p style={{ margin: 0, fontSize: '11.5px', color: '#475569', lineHeight: 1.5 }}>
                  Hệ thống dừng ở 780°C dù đặt 850°C. Nguyên nhân: Công suất nguồn cấp không đủ, hoặc khâu tích phân bị tắt, hoặc van bị giới hạn cơ khí không mở hết hành trình.
                </p>
              </div>
              <div style={{ marginTop: '10px', padding: '6px 8px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '11px', color: '#0072BD', fontWeight: 600 }}>
                Xử lý: Kiểm tra ngõ ra u, mở rộng giới hạn OutputUpperLimit.
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>SỰ CỐ 3</span>
                <h3 style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>Lỗi Ngắt Dây Cảm Biến 4–20 mA</h3>
                <p style={{ margin: 0, fontSize: '11.5px', color: '#475569', lineHeight: 1.5 }}>
                  Khối PID_Compact báo lỗi Error = TRUE, cờ State chuyển sang 0. Nguyên nhân: Dòng đo tụt xuống dưới 3.6 mA (dây tín hiệu analog bị đứt hoặc lỏng vít kẹp terminal).
                </p>
              </div>
              <div style={{ marginTop: '10px', padding: '6px 8px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '11px', color: '#15803d', fontWeight: 600 }}>
                Xử lý: Kiểm tra điện trở vòng lặp, thay thế bộ chuyển đổi TT.
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
           PAGE 16: Review Questions Part 1 (Questions 01 - 04)
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 16 ? 'flex' : 'none', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              CÂU HỎI CỦNG CỐ & ÔN TẬP CUỐI CHƯƠNG (PHẦN 1: CÂU 01–04)
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Câu Hỏi Lý Thuyết & Cấu Trúc Khối Lệnh
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', flex: 1, alignContent: 'center', margin: '10px 0' }}>
            {[
              { id: '01', q: 'Giải thích vai trò độc lập của Kp, Ti, Td trong vòng lặp kín.', note: 'P tạo tốc độ, I triệt tiêu sai số xác lập, D giảm độ vọt lố.' },
              { id: '02', q: 'Vì sao điều khiển tỷ lệ P thuần túy luôn để lại sai số xác lập?', note: 'Vì khi e = 0, đầu ra u = 0, van bị đóng và không giữ được tải.' },
              { id: '03', q: 'Giải thích vì sao PID_Compact bắt buộc phải gọi trong OB30 thay vì OB1?', note: 'Bảo đảm chu kỳ lấy mẫu Ts bất biến, không bị méo sai phân/tích phân.' },
              { id: '04', q: 'Phân biệt ngõ vào Input và Input_PER trên khối PID_Compact.', note: 'Input_PER nhận trực tiếp mã WORD từ ADC; Input nhận số thực REAL.' },
            ].map((item) => (
              <div key={item.id} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ fontFamily: 'Consolas, monospace', fontSize: '12px', fontWeight: 700, color: '#0072BD', flexShrink: 0 }}>
                    {item.id}.
                  </span>
                  <div style={{ fontSize: '12.5px', color: '#0f172a', lineHeight: 1.5, fontWeight: 600 }}>
                    {item.q}
                  </div>
                </div>
                <div style={{ marginTop: '8px', fontSize: '11px', color: '#475569', fontStyle: 'italic', borderTop: '1px solid #e2e8f0', paddingTop: '6px' }}>
                  [TRỌNG TÂM ÔN THI]: {item.note}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
           PAGE 17: Review Questions Part 2 (Questions 05 - 07)
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 17 ? 'flex' : 'none', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              CÂU HỎI CỦNG CỐ & ÔN TẬP CUỐI CHƯƠNG (PHẦN 2: CÂU 05–07)
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Câu Hỏi Vận Hành, Dò Tự Động & An Toàn
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', flex: 1, alignContent: 'center', margin: '10px 0' }}>
            {[
              { id: '05', q: 'Hiện tượng Integral Windup là gì và ảnh hưởng thế nào đến van điều khiển?', note: 'Khâu I dồn kịch trần khi chấp hành bão hòa, gây vọt lố dữ dội khi qua điểm đặt.' },
              { id: '06', q: 'Nêu sự khác biệt kỹ thuật giữa Pre-Tuning và Fine-Tuning trong TIA Portal.', note: 'Pre-Tuning phát bước nhảy tìm điểm uốn; Fine-Tuning tạo dao động rơ-le tinh chỉnh.' },
              { id: '07', q: 'Định nghĩa Bumpless Transfer và vì sao nó là tính năng an toàn thiết yếu?', note: 'Chuyển Manual sang Auto mượt mà, gán tích phân bằng đầu ra tay để tránh sốc cơ khí.' },
            ].map((item) => (
              <div key={item.id} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontFamily: 'Consolas, monospace', fontSize: '12px', fontWeight: 700, color: '#0072BD', flexShrink: 0 }}>
                      {item.id}.
                    </span>
                    <div style={{ fontSize: '12px', color: '#0f172a', lineHeight: 1.5, fontWeight: 600 }}>
                      {item.q}
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '8px', fontSize: '10.5px', color: '#475569', fontStyle: 'italic', borderTop: '1px solid #e2e8f0', paddingTop: '6px' }}>
                  [TRỌNG TÂM ÔN THI]: {item.note}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
           PAGE 18: Summary & Next Learning Milestones
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 18 ? 'flex' : 'none', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              TỔNG KẾT BÀI HỌC & LỘ TRÌNH KẾ TIẾP (COURSE ROADMAP)
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Hoàn Thành Bài 10: Closed-Loop Control with PID
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '18px', flex: 1, alignItems: 'stretch', margin: '10px 0' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '18px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#15803d', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  CHUẨN ĐẦU RA ĐÃ KIỂM CHỨNG (CLO G3):
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#334155', lineHeight: 1.6 }}>
                  <div>• Làm chủ mô hình vi tích phân tỷ lệ PID liên tục và rời rạc.</div>
                  <div>• Thành thạo cấu hình khối Technology Object PID_Compact trong TIA Portal.</div>
                  <div>• Gán ngắt chu kỳ OB30 chính xác, kiểm soát lấy mẫu thời gian thực.</div>
                  <div>• Tự động dò tham số Kp, Ti, Td bằng Pre-Tuning và Fine-Tuning.</div>
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '8px 12px', fontSize: '11.5px', color: '#15803d', fontWeight: 700 }}>
                TRẠNG THÁI: ĐÃ HOÀN THÀNH {totalPages} TRANG BÀI GIẢNG (100%)
              </div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '18px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', marginBottom: '6px' }}>
                  LỘ TRÌNH KẾ TIẾP:
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
                    borderRadius: '4px',
                    background: '#0072BD',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '12.5px',
                    textDecoration: 'none',
                  }}
                >
                  <span>Chuyển sang Bài 11: {nextLesson.title}</span>
                  <IconChevronRight size={16} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── PowerPoint Floating Bottom Navigation Bar (Non-Shifting Absolute Overlay in Fullscreen) ── */}
      <div
        style={{
          position: isFullscreen ? 'absolute' : 'relative',
          bottom: isFullscreen ? '16px' : 'auto',
          left: isFullscreen ? '50%' : 'auto',
          transform: isFullscreen ? 'translateX(-50%)' : 'none',
          zIndex: 60,
          opacity: isFullscreen ? (controlsVisible ? 1 : 0) : 1,
          pointerEvents: isFullscreen && !controlsVisible ? 'none' : 'auto',
          transition: 'opacity 0.25s ease',
          background: isFullscreen ? 'rgba(15, 23, 42, 0.92)' : '#f8fafc',
          backdropFilter: isFullscreen ? 'blur(8px)' : 'none',
          color: isFullscreen ? '#ffffff' : '#0f172a',
          border: isFullscreen ? '1px solid rgba(255,255,255,0.15)' : 'none',
          borderTop: isFullscreen ? 'none' : '1px solid #cbd5e1',
          borderRadius: isFullscreen ? '6px' : '0px',
          padding: isFullscreen ? '8px 16px' : '8px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          boxShadow: isFullscreen ? '0 10px 25px rgba(0,0,0,0.3)' : 'none',
          flexShrink: 0,
        }}
      >
        <button
          onClick={handlePrev}
          disabled={currentPage === 0}
          style={{
            padding: '5px 12px',
            borderRadius: '4px',
            border: isFullscreen ? '1px solid rgba(255,255,255,0.2)' : '1px solid #cbd5e1',
            background: currentPage === 0 ? (isFullscreen ? 'rgba(255,255,255,0.05)' : '#f1f5f9') : (isFullscreen ? 'rgba(255,255,255,0.15)' : '#ffffff'),
            color: currentPage === 0 ? (isFullscreen ? '#64748b' : '#94a3b8') : (isFullscreen ? '#ffffff' : '#0f172a'),
            fontSize: '11.5px',
            fontWeight: 600,
            cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <IconChevronLeft size={14} />
          <span>Trang trước</span>
        </button>

        {/* Center: Progress Counter & Micro Dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11.5px', fontWeight: 700, color: isFullscreen ? '#38bdf8' : '#0072BD', fontFamily: 'Consolas, monospace' }}>
            Trang {String(currentPage + 1).padStart(2, '0')} / {totalPages}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx)}
                title={`Chuyển đến trang ${idx + 1}: ${PAGES_METADATA[idx].shortTitle}`}
                style={{
                  width: idx === currentPage ? 14 : 3,
                  height: 4,
                  borderRadius: '1px',
                  border: 'none',
                  background: idx === currentPage ? (isFullscreen ? '#38bdf8' : color) : (isFullscreen ? 'rgba(255,255,255,0.3)' : '#cbd5e1'),
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'width 0.15s ease',
                }}
              />
            ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages - 1}
          style={{
            padding: '5px 14px',
            borderRadius: '4px',
            border: 'none',
            background: currentPage === totalPages - 1 ? (isFullscreen ? 'rgba(255,255,255,0.1)' : '#cbd5e1') : color,
            color: '#ffffff',
            fontSize: '11.5px',
            fontWeight: 700,
            cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span>Trang tiếp</span>
          <IconChevronRight size={14} />
        </button>
      </div>

      {/* ── Table of Contents Drawer Modal (MATLAB Clean Technical Tree) ── */}
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
            boxShadow: '4px 0 20px rgba(0,0,0,0.12)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              padding: '14px 18px',
              borderBottom: '1px solid #cbd5e1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#f8fafc',
            }}
          >
            <div>
              <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase' }}>
                MỤC LỤC TRÌNH CHIẾU
              </div>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f172a' }}>
                {totalPages} Trang Nội Dung
              </div>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer',
                color: '#64748b',
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
            {PAGES_METADATA.map((page, idx) => {
              const isActive = currentPage === page.id;
              return (
                <button
                  key={page.id}
                  onClick={() => {
                    setCurrentPage(page.id);
                    setDrawerOpen(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '4px',
                    border: isActive ? '1px solid #0072BD' : '1px solid transparent',
                    background: isActive ? '#eff6ff' : 'transparent',
                    color: isActive ? '#0072BD' : '#334155',
                    fontSize: '12px',
                    fontWeight: isActive ? 700 : 500,
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '3px',
                  }}
                >
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '2px',
                      background: isActive ? '#0072BD' : '#e2e8f0',
                      color: isActive ? '#ffffff' : '#64748b',
                      fontSize: '10.5px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div>{page.title}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Speaker Notes Drawer (Ghi chú giảng viên - Key: N) ── */}
      {notesOpen && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '360px',
            height: '100%',
            background: '#ffffff',
            boxShadow: '-4px 0 20px rgba(0,0,0,0.12)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            borderLeft: '1px solid #cbd5e1',
          }}
        >
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc' }}>
            <div>
              <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase' }}>Ghi Chú Giảng Viên</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>Slide {currentPage + 1}: {PAGES_METADATA[currentPage].shortTitle}</div>
            </div>
            <button
              onClick={() => setNotesOpen(false)}
              style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', color: '#64748b' }}
            >
              ✕
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '12px 14px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#0072BD', textTransform: 'uppercase', marginBottom: '6px' }}>
                Gợi Ý Giảng Giải (Speaking Cue):
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#334155', lineHeight: 1.6 }}>
                {activeNote.cue}
              </p>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '12px 14px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', marginBottom: '6px' }}>
                Trọng Tâm Bài Giảng:
              </div>
              <div style={{ fontSize: '11.5px', color: '#475569', lineHeight: 1.55 }}>
                {activeNote.focus}
              </div>
            </div>

            {activeNote.formula && (
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '4px', padding: '12px 14px' }}>
                <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Công Thức Trọng Yếu:
                </div>
                <div style={{ fontFamily: 'Consolas, monospace', fontSize: '12px', fontWeight: 700, color: '#1e3a8a' }}>
                  {activeNote.formula}
                </div>
              </div>
            )}

            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '12px 14px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#15803d', textTransform: 'uppercase', marginBottom: '4px' }}>
                Mẹo Giảng Dạy & Lưu Ý:
              </div>
              <div style={{ fontSize: '11.5px', color: '#334155', lineHeight: 1.5 }}>
                {activeNote.tip}
              </div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '12px 14px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', marginBottom: '6px' }}>
                Bảng Phím Tắt Trình Chiếu:
              </div>
              <div style={{ fontSize: '11px', color: '#475569', lineHeight: 1.6 }}>
                <div>• <strong>Space / →:</strong> Chuyển sang slide tiếp theo</div>
                <div>• <strong>←:</strong> Lùi lại slide trước</div>
                <div>• <strong>Home / End:</strong> Về slide đầu / cuối</div>
                <div>• <strong>F:</strong> Bật / tắt chế độ toàn màn hình</div>
                <div>• <strong>N:</strong> Ẩn / hiện bảng ghi chú này</div>
                <div>• <strong>M:</strong> Mở mục lục slide</div>
                <div>• <strong>Esc:</strong> Đóng cửa sổ / Thoát toàn màn hình</div>
              </div>
            </div>
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
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '92vw',
              maxHeight: '92vh',
              background: '#ffffff',
              borderRadius: '4px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
              <button
                onClick={() => setZoomImage(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  color: '#0f172a',
                }}
              >
                Đóng (Esc) ✕
              </button>
            </div>
            <img
              src={asset(zoomImage)}
              alt="Sơ đồ kỹ thuật phóng to"
              style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
