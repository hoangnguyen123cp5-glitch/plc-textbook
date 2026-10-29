// Schema chuẩn cho hệ thống nội dung đơn file: Mỗi topic = 1 file (.ts)
// Định nghĩa cấu trúc nội dung chi tiết theo từng chuyên đề (topic) và bài học (lesson)

export interface TopicBodySection {
  heading?: string;
  text: string;
  keyPoints?: string[];
  note?: string;
}

export interface TopicFigure {
  src: string;      // đường dẫn trong public/, KHÔNG gồm basePath (vd: '/images/diagrams/pid-block-diagram.jpg')
  caption: string;
}

export interface TopicFormula {
  latex: string;
  explain: string;
}

export interface TopicCaseStudy {
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

export interface TopicContent {
  slug: string;                 // phải trùng tên file
  number: string;               // "1.1" — số hiển thị trên web
  sourceRef?: string;           // số mục trên slide gốc nếu khác, vd "1.3"
  title: string;
  durationMinutes: number;
  summary: string;              // 1–2 câu, hiện ở mục lục
  objectives?: string[];        // chuẩn đầu ra RIÊNG của topic
  body: TopicBodySection[];
  figures?: TopicFigure[];
  formula?: TopicFormula[];
  caseStudy?: TopicCaseStudy;
  quiz?: TopicQuizQuestion[];
  narration?: string[];         // lời giảng theo từng slide
  video?: TopicVideoRef;
  simulator?: string;           // key của component mô phỏng nếu có
  status: 'draft' | 'review' | 'published';
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
  topicOrder: string[];         // thứ tự slug topic — nguồn sự thật duy nhất
}
