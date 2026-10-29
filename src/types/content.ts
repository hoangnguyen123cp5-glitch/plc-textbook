// Schema chuẩn cho hệ thống nội dung đơn file: Mỗi topic = 1 file (.ts)
// File topic viết dạng: export default { ... } satisfies TopicContent;
// File bài viết dạng:   export default { ... } satisfies LessonContentFile;

export interface TopicBodySection {
  heading?: string;
  text: string;
  keyPoints?: string[];
  note?: string;
}

export interface TopicFigure {
  src: string;      // Đường dẫn trong public/, KHÔNG gồm basePath (vd: '/images/diagrams/pid-block-diagram.jpg')
  caption: string;
  alt?: string;     // Alt ngắn cho trình đọc màn hình
}

export interface TopicFormula {
  latex: string;
  explain: string;
}

export interface TopicCase {
  title: string;
  context: string;
  hardware?: string[];
  pitfall?: string;
}

export interface TopicQuizQuestion {
  q: string;
  options: string[];
  answer: number;   // 0 = A, 1 = B, 2 = C, 3 = D
  explain: string;
}

export interface TopicVideoRef {
  startSec: number;
}

export interface TopicNarration {
  vi: string;
  durationSec?: number;
  by: 'ai' | 'human';
  updatedAt: string;
}

export interface TopicContent {
  slug: string;                 // Phải trùng tên file
  sourceRef?: string;           // Số mục trên slide gốc nếu khác, vd "1.3"
  title: string;
  durationMinutes: number;
  summary: string;              // 1–2 câu, hiển thị ở mục lục
  objectives?: string[];        // Chuẩn đầu ra RIÊNG của topic
  body: TopicBodySection[];
  figures?: TopicFigure[];
  formula?: TopicFormula[];
  caseStudy?: TopicCase;
  quiz?: TopicQuizQuestion[];
  narration?: TopicNarration;
  video?: TopicVideoRef;
  simulator?: string;           // Key của component mô phỏng nếu có
  status: 'draft' | 'review' | 'published';
}

export interface LessonVideoMeta {
  provider: 'youtube';
  id: string;
  title: string;
  durationSec: number;
  publishedAt?: string;
  captions?: ('en' | 'vi')[];
}

export interface LessonContentFile {
  slug: string;
  id: number;
  title: string;
  description: string;
  course: 'AUT206' | 'AUT207';
  session: number;
  lab: string;
  clo: string;
  module: 1 | 2 | 3 | 4 | 5;
  topicOrder: string[];         // Thứ tự slug topic — nguồn sự thật duy nhất
  overview: string;
  objectives: string[];
  review?: string[];
  video?: LessonVideoMeta;
}
