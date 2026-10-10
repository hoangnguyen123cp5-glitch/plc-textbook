import createMDX from '@next/mdx';

/*
 * ── basePath cho GitHub Pages ──────────────────────────────────────────
 * GitHub Pages phục vụ *project site* tại  https://<user>.github.io/<repo>/
 * nên mọi đường dẫn tuyệt đối (/_next/..., /images/...) phải mang tiền tố
 * /<repo>. Thiếu nó → trình duyệt tải được HTML nhưng 404 toàn bộ CSS/JS/ảnh
 * → trang trắng. Đây là lỗi phổ biến nhất khi đưa Next.js static export lên Pages.
 *
 * Giá trị do workflow deploy tự tính từ tên repo rồi truyền qua biến môi trường,
 * nên đổi tên repo không phải sửa code. Khi chạy `npm run dev` biến này rỗng
 * → basePath rỗng → http://localhost:3000 hoạt động y như cũ.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  images: {
    unoptimized: true,
  },

  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {},
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);


