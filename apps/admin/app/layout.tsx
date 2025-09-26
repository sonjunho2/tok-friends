import './globals.css';
import React from 'react';
import { I18nProvider, useI18n } from '@/i18n';
import { redirect } from 'next/navigation';

const ADMIN_JWT_STORAGE_KEY = 'tokfriends.admin.jwt';

function LocaleSwitcher() {
  const { locale, setLocale } = useI18n();
  return (
    <div className="flex gap-2 text-sm">
      <button
        onClick={() => setLocale('ko')}
        className={`px-2 py-1 rounded ${locale === 'ko' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
      >
        한국어
      </button>
      <button
        onClick={() => setLocale('en')}
        className={`px-2 py-1 rounded ${locale === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
      >
        English
      </button>
    </div>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(ADMIN_JWT_STORAGE_KEY);
    const path = window.location.pathname;
    if (!token && path !== '/login') {
      redirect('/login');
    }
  }
  return <>{children}</>;
}

export const metadata = { title: 'TokFriends Admin' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <I18nProvider>
          <AuthGuard>
            <div className="mx-auto max-w-6xl p-6 space-y-4">
              <header className="flex justify-between items-center">
                <h1 className="text-lg font-bold">TokFriends Admin</h1>
                <LocaleSwitcher />
              </header>
              {children}
            </div>
          </AuthGuard>
        </I18nProvider>
      </body>
    </html>
  );
}
