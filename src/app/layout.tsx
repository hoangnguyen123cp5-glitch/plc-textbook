import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import 'katex/dist/katex.min.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PLC Programming — International School, VNU Hanoi',
  description: 'Interactive Siemens S7-1200/1500 & TIA Portal PLC programming course — from hardware fundamentals to SCADA integration.',
  keywords: ['PLC', 'Siemens', 'S7-1200', 'TIA Portal', 'ladder logic', 'VNU-IS'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
