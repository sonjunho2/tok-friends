import './globals.css';
import React from 'react';

export const metadata = { title: 'TokFriends Admin' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-6xl p-6">{children}</div>
      </body>
    </html>
  );
}
