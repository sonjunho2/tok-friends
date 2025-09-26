// tok-friends/apps/admin/app/announcements/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { adminAnnouncementsApi, AnnouncementInput } from '@/lib/api';

export default function AnnouncementsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isActive, setIsActive] = useState(true);

  const fetchList = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminAnnouncementsApi.list();
      if (res?.ok) {
        setRows(res.data);
      } else {
        setError('공지사항 목록 불러오기 실패');
      }
    } catch (e: any) {
      setError(e?.message || '에러 발생');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const create = async () => {
    try {
      const dto: AnnouncementInput = { title, body, isActive };
      await adminAnnouncementsApi.create(dto);
      setTitle('');
      setBody('');
      setIsActive(true);
      fetchList();
    } catch (e: any) {
      alert(e?.message || '생성 실패');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('삭제하시겠습니까?')) return;
    try {
      await adminAnnouncementsApi.remove(id);
      fetchList();
    } catch (e: any) {
      alert(e?.message || '삭제 실패');
    }
  };

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-bold">공지사항 관리</h1>

      {error && <p className="text-red-600">{error}</p>}
      {loading && <p>불러오는 중...</p>}

      <section className="bg-white shadow rounded-2xl p-4 space-y-2">
        <h2 className="font-medium">새 공지 작성</h2>
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full border rounded px-3 py-2"
          placeholder="내용"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          활성화
        </label>
        <button
          onClick={create}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          등록
        </button>
      </section>

      <section className="grid grid-cols-1 gap-3">
        {rows.map((a) => (
          <div key={a.id} className="bg-white shadow rounded-2xl p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{a.title}</h3>
                <p className="text-sm text-slate-600">{a.body}</p>
                <p className="text-xs text-gray-500">
                  {a.isActive ? '활성화' : '비활성화'}
                </p>
              </div>
              <button
                onClick={() => remove(a.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
