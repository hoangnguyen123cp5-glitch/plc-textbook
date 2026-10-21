/**
 * LessonDownloads — hộp "Tải phần mềm" cho từng bài học.
 *
 * Theo đúng pattern slug-registry của LessonAnimationWrapper / LessonMathBlock:
 * thêm tài nguyên cho bài mới chỉ cần thêm một entry vào DOWNLOADS, không đụng
 * vào page.tsx. Bài nào không có entry thì component trả về null.
 *
 * Đây là server component — không có state, không cần 'use client'.
 */

type DownloadItem = {
  name: string;
  detail?: string;
  size?: string;
  /** Entry ID của Siemens Industry Online Support */
  entryId: string;
};

type DownloadSet = {
  title: string;
  version: string;
  note: string;
  items: DownloadItem[];
  /** Cảnh báo hiển thị cuối hộp */
  warnings: string[];
};

/** Trang tra cứu chuẩn theo Entry ID của Siemens Industry Online Support */
const sios = (id: string) => `https://support.industry.siemens.com/cs/ww/en/view/${id}`;

const DOWNLOADS: Record<string, DownloadSet> = {
  '02-s7-1200-tia-portal': {
    title: 'SIMATIC STEP 7 Professional + Safety + S7-PLCSIM + WinCC — Trial Version',
    version: 'V19',
    note:
      'Official trial software from Siemens, providing everything needed to complete all lab exercises in this course. DVD package article number: 6AV2102-0AA02-3AA7.',
    items: [
      {
        name: 'Main Download Portal (STEP 7 + Safety + PLCSIM + WinCC V19 Trial)',
        detail: 'Central entry page containing downloads for DVD 1 and DVD 2 below',
        entryId: '109820994',
      },
      {
        name: 'DVD 1 — TIA_Portal_STEP7_Prof_Safety_WinCC_V19.iso',
        detail: 'STEP 7 Basic/Professional · STEP 7 Safety Basic/Advanced · WinCC Basic/Comfort/Advanced/Professional/Unified',
        size: '7.5 GB',
        entryId: '109820994',
      },
      {
        name: 'DVD 2 — TIA_Portal_STEP7_Prof_Safety_WINCC_DVD_2_V19.iso',
        detail: 'Hardware Support Packages · Open Source Software · Tools',
        size: '2.9 GB',
        entryId: '109820994',
      },
      {
        name: 'WinCC Unified PC RT Simulation & Trial',
        detail: 'Required when simulating WinCC Unified runtime devices during engineering',
        entryId: '109820988',
      },
      {
        name: 'WinCC RT Professional Simulation & Trial',
        detail: 'Required when simulating WinCC RT Professional runtime devices',
        entryId: '109820997',
      },
      {
        name: 'SHA-256 Checksum Verification Guide',
        detail: 'Recommended before extraction — large 7.5 GB files can corrupt during download',
        entryId: '109483101',
      },
      {
        name: 'TRIAL Download Catalog for all TIA Portal Versions (up to V21)',
        detail: 'Use when exploring newer versions than V19 — see important compatibility notes below',
        entryId: '109798506',
      },
    ],
    warnings: [
      'A free Siemens Industry Online Support account is required to download — register in advance.',
      'The Trial license is valid for 21 days from the first launch and cannot be renewed on the same machine. Install only when you are ready to begin the lab exercises.',
      'This course uses V19. Projects created in newer versions (V20/V21) are NOT backward compatible with V19. Match your version with the university lab standard.',
      'Install only on 64-bit Windows (Pro or Enterprise). Review RAM and SSD storage requirements in the Siemens readme before downloading ~10 GB.',
    ],
  },
};

export default function LessonDownloads({ slug }: { slug: string }) {
  const set = DOWNLOADS[slug];
  if (!set) return null;

  return (
    <div style={{ marginBottom: '28px' }}>
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
        ⬇ Software Downloads
      </p>

      <div
        style={{
          border: '1px solid #e5e5e5',
          borderRadius: '10px',
          overflow: 'hidden',
          background: '#fff',
        }}
      >
        {/* Header */}
        <div style={{ padding: '18px 22px', background: '#fafafa', borderBottom: '1px solid #e5e5e5' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
              {set.title}
            </span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#099',
                background: '#0999991a',
                border: '1px solid #09999940',
                padding: '2px 9px',
                borderRadius: '99px',
              }}
            >
              {set.version}
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#525252', lineHeight: 1.65, margin: 0 }}>{set.note}</p>
        </div>

        {/* Danh sách link */}
        <div>
          {set.items.map((it, i) => (
            <a
              key={`${it.entryId}-${i}`}
              href={sios(it.entryId)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                padding: '14px 22px',
                borderTop: i === 0 ? 'none' : '1px solid #f5f5f5',
                textDecoration: 'none',
                color: 'inherit',
              }}
              className="topic-link"
            >
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#737373',
                  background: '#f5f5f5',
                  border: '1px solid #e5e5e5',
                  borderRadius: '5px',
                  padding: '3px 7px',
                  fontFamily: 'monospace',
                  flexShrink: 0,
                  marginTop: '1px',
                }}
              >
                {it.entryId}
              </span>

              <span style={{ flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    display: 'block',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    color: '#1a3a6b',
                    lineHeight: 1.45,
                  }}
                >
                  {it.name}
                  {it.size && (
                    <span style={{ fontWeight: 500, color: '#a3a3a3', marginLeft: '8px', fontSize: '12px' }}>
                      {it.size}
                    </span>
                  )}
                </span>
                {it.detail && (
                  <span style={{ display: 'block', fontSize: '12.5px', color: '#737373', lineHeight: 1.55, marginTop: '3px' }}>
                    {it.detail}
                  </span>
                )}
              </span>

              <span style={{ color: '#d4d4d4', fontSize: '14px', flexShrink: 0, marginTop: '2px' }}>↗</span>
            </a>
          ))}
        </div>

        {/* Cảnh báo */}
        <div style={{ padding: '16px 22px', background: '#fffbeb', borderTop: '1px solid #fde68a' }}>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#b45309',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            ⚠ Read Before Downloading
          </p>
          <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {set.warnings.map((w, i) => (
              <li key={i} style={{ fontSize: '12.5px', color: '#78350f', lineHeight: 1.65 }}>
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p style={{ fontSize: '11px', color: '#a3a3a3', marginTop: '8px', lineHeight: 1.6 }}>
        All links refer to Siemens Industry Online Support by Entry ID — this URL structure is more permanent than direct download links that change with each service pack.
      </p>
    </div>
  );
}
