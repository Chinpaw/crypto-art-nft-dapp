// file: app/layout.tsx

import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers'; // <-- 1. TAMBAHKAN BARIS INI

export const metadata: Metadata = {
  title: 'CryptoArt',
  description: 'Created by Chinpaw',
  generator: 'chindev',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 2. BUNGKUS {children} DENGAN <Providers> */}
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}