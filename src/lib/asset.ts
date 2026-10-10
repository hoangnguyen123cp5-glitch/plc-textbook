/**
 * Tiền tố đường dẫn cho tài nguyên tĩnh trong thư mục public/.
 *
 * ── Vì sao cần file này ─────────────────────────────────────────────────
 * Next tự thêm basePath cho /_next/* (qua assetPrefix) và cho href của
 * <Link>, NHƯNG KHÔNG thêm cho <Image> khi bật `images.unoptimized` —
 * bộ loader mặc định trả src nguyên văn. Với static export lên GitHub Pages
 * (site nằm dưới /<repo>/), hậu quả là mọi ảnh trong public/ trả 404 và
 * logo biến mất, trong khi CSS/JS vẫn tải bình thường nên rất khó nhận ra.
 *
 * Vì vậy MỌI tham chiếu tới file trong public/ phải đi qua asset().
 *
 * NEXT_PUBLIC_* được nội suy vào bundle lúc build nên hàm này chạy đúng ở
 * cả server lẫn client, và bằng rỗng khi `npm run dev`.
 */

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** asset('/images/logo.png') → '/plc-textbook/images/logo.png' khi deploy */
export function asset(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_PATH}${p}`;
}
