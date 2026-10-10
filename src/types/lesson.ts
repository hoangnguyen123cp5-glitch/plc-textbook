export interface LessonMeta {
  id: number;
  slug: string;
  title: string;
  description: string;
  session: number;
  lab: string;
  clo: string;
  /** Mã môn gốc trên slide: AUT206 (cơ bản) hoặc AUT207 (nâng cao) */
  course: 'AUT206' | 'AUT207';
  /**
   * PHÁI SINH — luôn bằng topics.length. KHÔNG khai báo tay.
   * Trước đây trường này được gõ tay và lệch với mảng topics ở 3 bài,
   * khiến trang chủ quảng cáo 283 chủ đề trong khi chỉ có 242 trang thật.
   */
  totalTopics: number;
  /** PHÁI SINH — luôn bằng tổng durationMinutes của các topic. KHÔNG khai báo tay. */
  durationMinutes: number;
  color: string;
  icon: string;
  topics: TopicMeta[];
}

/**
 * Dạng dữ liệu NGUỒN dùng khi khai báo bài học: giống LessonMeta nhưng
 * bỏ hai trường phái sinh. lessons.ts tự tính chúng khi export.
 */
export type LessonSource = Omit<LessonMeta, 'totalTopics' | 'durationMinutes'>;

export interface TopicMeta {
  id: number;
  slug: string;
  title: string;
  durationMinutes: number;
  parentLessonSlug: string;
}
