'use client';

import React, { useEffect, useState } from 'react';
import { adminAnnouncementsApi, type AnnouncementInput } from '@/lib/api';
import Table, { type Column } from '@/components/Table';

type AnnouncementRow = {
  id: string;
  title: string;
  body: string;
  isActive: boolean;
  createdAt?: string;
};

export default function AnnouncementsPage() {
  const [rows, setRows] = useState<AnnouncementRow[]>([]);
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
        setRows(res.data as AnnouncementRow[]);
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

  const columns: Column<AnnouncementRow>[] = [
    { key: 'id', header: 'ID', className: 'w-24' },
    { key: 'title', header: '제목' },
    { key: 'body', header: '내용', className: 'max-w-[280px] truncate' },
    { key: 'isActive', header: '활성화', render: (a) => (a.isActive ? '✅' : '❌') },
    {
      key: 'actions',
      header: '액션',
      className: 'w-28',
      render: (a) => (
        <button
          onClick={() => remove(a.id)}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
        >
          삭제
        </button>
      ),
    },
  ];

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

      <Table<AnnouncementRow>
        columns={columns}
        rows={rows}
        loading={loading}
        emptyText="공지사항이 없습니다."
        rowKey={(row) => row.id}
      />
    </main>
  );
}
