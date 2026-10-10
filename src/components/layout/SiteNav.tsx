'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { asset } from '@/lib/asset';

/**
 * SiteNav — thanh điều hướng dùng chung cho TOÀN BỘ site.
 *
 * Trước đây nav bị copy-paste ở 2 nơi (app/page.tsx và app/lessons/layout.tsx),
 * nên mỗi lần chỉnh phải sửa 2 file và chúng lệch nhau dần (logo 42 vs 46px,
 * chữ 14 vs 15px, gap 16 vs 24px). Giờ chỉ còn một nguồn sự thật duy nhất.
 *
 * Khác biệt giữa các trang được biểu diễn bằng PROPS, không phải bằng bản sao:
 *   · layout   'centered' → bó vào 860px (trang không có sidebar)
 *              'full'     → trải hết chiều ngang (trang có sidebar khoá học)
 *   · position 'fixed'    → nav nổi trên hero (trang chủ)
 *              'sticky'   → nav chiếm chỗ trong flow (trang có sidebar)
 *   · onMenuClick         → truyền vào thì hiện nút hamburger mở sidebar
 *   · cta                 → nhãn + đích của nút chính bên phải
 */

/** Chiều cao nav (px). Sidebar và mọi offset khác phải tham chiếu hằng này. */
export const NAV_HEIGHT = 60;

const LINKS = [
  { href: '/', label: 'Home', isActive: (p: string) => p === '/' },
  { href: '/lessons', label: 'Curriculum', isActive: (p: string) => p.startsWith('/lessons') },
  { href: '/simulator', label: 'Simulator', isActive: (p: string) => p.startsWith('/simulator') },
];

export type SiteNavProps = {
  layout?: 'centered' | 'full';
  position?: 'fixed' | 'sticky';
  onMenuClick?: () => void;
  /** Ngăn kéo sidebar đang mở hay không — để đặt aria-expanded cho hamburger */
  menuExpanded?: boolean;
  cta?: { label: string; href: string };
};

export default function SiteNav({
  layout = 'centered',
  position = 'sticky',
  onMenuClick,
  menuExpanded = false,
  cta = { label: 'Start Learning', href: '/lessons/01-programmable-control' },
}: SiteNavProps) {
  const pathname = usePathname() || '/';

  const shell: React.CSSProperties =
    position === 'fixed'
      ? { position: 'fixed', top: 0, left: 0, right: 0 }
      : { position: 'sticky', top: 0, flexShrink: 0 };

  const inner: React.CSSProperties =
    layout === 'centered' ? { maxWidth: '860px', margin: '0 auto' } : { width: '100%' };

  return (
    <nav
      style={{
        zIndex: 50,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #ebebeb',
        ...shell,
      }}
    >
      <div
        style={{
          ...inner,
          padding: '0 24px',
          height: `${NAV_HEIGHT}px`,
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="site-nav__menu"
            aria-label="Mở mục lục khoá học"
            aria-expanded={menuExpanded}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              color: '#737373',
              flexShrink: 0,
              marginRight: '-8px',
            }}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        <Link
          href="/"
          style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}
        >
          <Image
            src={asset('/images/vnu-is-logo.png')}
            alt="International School – VNU Hanoi"
            width={220}
            height={56}
            style={{ objectFit: 'contain', height: '46px', width: 'auto' }}
            priority
          />
        </Link>

        <div
          className="site-nav__divider"
          style={{ width: '1px', height: '28px', background: '#e5e5e5', flexShrink: 0 }}
        />

        <span
          className="site-nav__wordmark"
          style={{
            fontSize: '15px',
            fontWeight: 700,
            color: '#1a3a6b',
            letterSpacing: '-0.02em',
            whiteSpace: 'nowrap',
          }}
        >
          PLC Programming
        </span>

        <div style={{ flex: 1 }} />

        <div className="site-nav__links" style={{ display: 'contents' }}>
        {LINKS.map((l) => {
          const active = l.isActive(pathname);
          return (
            <Link
              key={l.href}
              href={l.href}
              className="nav-link"
              aria-current={active ? 'page' : undefined}
              style={active ? { color: '#0a0a0a', fontWeight: 600 } : undefined}
            >
              {l.label}
            </Link>
          );
        })}
        </div>

        <Link
          href={cta.href}
          className="btn-primary"
          style={{
            padding: '8px 18px',
            fontSize: '13px',
            borderRadius: '6px',
            background: '#1a3a6b',
            whiteSpace: 'nowrap',
          }}
        >
          {cta.label}
        </Link>
      </div>
    </nav>
  );
}
