'use client';

import { useState } from 'react';
import {
  getLessonVideo,
  getTopicVideo,
  getChapters,
  buildEmbedUrl,
  buildWatchUrl,
  buildThumbnailUrl,
  formatTimestamp,
} from '@/data/video-index';

/**
 * LessonVideo — trình phát cho cả trang bài học và trang topic.
 *
 * · Không truyền topicSlug → phát từ đầu, kèm danh sách chương bấm được
 * · Có truyền topicSlug    → tua thẳng tới đoạn của topic đó
 * · Bài chưa quay          → trả về null, KHÔNG render khung xám "coming soon"
 *
 * ── Vì sao dùng facade thay vì nhúng iframe thẳng ──
 * Một iframe YouTube kéo về vài trăm KB JavaScript ngay khi trang tải, kể cả
 * khi người xem không bấm play. Ở đây chỉ hiện ảnh thumbnail (~15 KB) và nút
 * play; iframe thật chỉ được tạo sau cú bấm đầu tiên, kèm autoplay để cú bấm
 * đó vẫn phát ngay. Trang nhẹ hơn hẳn, nhất là trên mạng di động.
 */

type Props = {
  lessonSlug: string;
  /** Bỏ trống ở trang bài học; truyền vào ở trang topic */
  topicSlug?: string;
  /** Màu nhấn theo nhóm bài, dùng cho nút play và chương đang chọn */
  color?: string;
};

export default function LessonVideo({ lessonSlug, topicSlug, color = '#1a3a6b' }: Props) {
  const [playingAt, setPlayingAt] = useState<number | null>(null);

  const video = getLessonVideo(lessonSlug);
  if (!video) return null;

  const topicRef = topicSlug ? getTopicVideo(lessonSlug, topicSlug) : null;
  // Trang topic mà topic đó chưa được đánh mốc → không hiện gì
  if (topicSlug && !topicRef) return null;

  const startSec = topicRef?.startSec ?? 0;
  const chapters = topicSlug ? [] : getChapters(lessonSlug);

  const activeStart = playingAt ?? startSec;

  return (
    <div style={{ marginBottom: '32px' }}>
      <p
        style={{
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.1em',
          color: '#a3a3a3',
          textTransform: 'uppercase',
          marginBottom: '12px',
        }}
      >
        ▶ Video
      </p>

      {/* Khung 16:9 */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingBottom: '56.25%',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid #e5e5e5',
          background: '#0a0a0a',
        }}
      >
        {playingAt === null ? (
          <button
            onClick={() => setPlayingAt(startSec)}
            aria-label={`Play: ${video.title}`}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              padding: 0,
              border: 'none',
              cursor: 'pointer',
              background: '#0a0a0a',
              display: 'block',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={buildThumbnailUrl(video)}
              alt=""
              loading="lazy"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.82,
              }}
            />
            <span
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 68,
                height: 68,
                borderRadius: '50%',
                background: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        ) : (
          <iframe
            key={activeStart}
            src={`${buildEmbedUrl(video, activeStart)}&autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
          />
        )}
      </div>

      {/* Dòng thông tin dưới khung */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap',
          marginTop: '10px',
          fontSize: '12px',
          color: '#a3a3a3',
        }}
      >
        {topicRef ? (
          <span>
            {formatTimestamp(topicRef.startSec)} – {formatTimestamp(topicRef.endSec)} ·{' '}
            {Math.round(topicRef.lengthSec / 60)} min of the full lesson video
          </span>
        ) : (
          <span>{formatTimestamp(video.durationSec)} total</span>
        )}
        {video.captions?.length ? (
          <span className="tag" style={{ fontSize: '11px', padding: '2px 9px' }}>
            CC {video.captions.map((c) => c.toUpperCase()).join(' · ')}
          </span>
        ) : null}
        <div style={{ flex: 1 }} />
        <a
          href={buildWatchUrl(video, startSec)}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#a3a3a3', textDecoration: 'none' }}
          className="nav-link"
        >
          Watch on YouTube ↗
        </a>
      </div>

      {/* Danh sách chương — chỉ ở trang bài học */}
      {chapters.length > 0 && (
        <div
          style={{
            marginTop: '16px',
            border: '1px solid #e5e5e5',
            borderRadius: '10px',
            overflow: 'hidden',
            background: '#fff',
          }}
        >
          <div
            style={{
              padding: '11px 18px',
              background: '#fafafa',
              borderBottom: '1px solid #e5e5e5',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#a3a3a3',
              textTransform: 'uppercase',
            }}
          >
            Chapters
          </div>
          {chapters.map((c, i) => {
            const active = playingAt === c.startSec;
            return (
              <button
                key={c.topicSlug}
                onClick={() => setPlayingAt(c.startSec)}
                className="topic-link"
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '14px',
                  width: '100%',
                  padding: '11px 18px',
                  border: 'none',
                  borderTop: i === 0 ? 'none' : '1px solid #f5f5f5',
                  background: active ? `${color}0f` : 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  font: 'inherit',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '12px',
                    color: active ? color : '#a3a3a3',
                    fontVariantNumeric: 'tabular-nums',
                    minWidth: '46px',
                    fontWeight: active ? 700 : 400,
                  }}
                >
                  {formatTimestamp(c.startSec)}
                </span>
                <span
                  style={{
                    fontSize: '13.5px',
                    color: active ? color : '#404040',
                    fontWeight: active ? 600 : 450,
                    lineHeight: 1.45,
                  }}
                >
                  {c.title}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
