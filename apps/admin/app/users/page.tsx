'use client';

import React, { useEffect, useState } from 'react';
import { adminUsersApi, adminBlocksApi } from '@/lib/api';
import Table, { Column } from '@/components/Table';

type UserRow = {
  id: string;
  email?: string | null;
  displayName?: string | null;
  status?: string | null;
  createdAt?: string | null;
};

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [rows, setRows] = useState<UserRow[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [actingId, setActingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminUsersApi.list({ page, limit, search: search || undefined });
      const data = res as any;
      if (data?.ok) {
        setRows((data.items ?? data.data) as UserRow[]);
        setTotal(data.total ?? (data.items ? (data.items.length + (page - 1) * limit) : 0));
      } else {
        setError('목록을 불러올 수 없습니다.');
      }
    } catch (e: any) {
      setError(e?.message || '에러 발생');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const updateStatus = async (id: string, status: 'active' | 'suspended') => {
    setActingId(id);
    setError(null);
    try {
      await adminUsersApi.updateStatus(id, status);
      await load();
    } catch (e: any) {
      setError(e?.message || '상태 변경 실패');
    } finally {
      setActingId(null);
    }
  };

  const blockUser = async (userId: string, blockedUserId: string) => {
    setActingId(blockedUserId);
    setError(null);
    try {
      await adminBlocksApi.create(userId, blockedUserId);
      alert('차단 완료');
    } catch (e: any) {
      setError(e?.message || '차단 실패');
    } finally {
      setActingId(null);
    }
  };

  const columns: Column<UserRow>[] = [
    { key: 'id', header: 'ID' },
    { key: 'displayName', header: '닉네임' },
    { key: 'email', header: '이메일' },
    { key: 'status', header: '상태' },
    {
      key: 'actions',
      header: '액션',
      render: (u) => (
        <div className="flex gap-2">
          <button
            onClick={() => updateStatus(u.id, 'active')}
            disabled={actingId === u.id}
            className="px-2 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700 disabled:opacity-50"
          >
            활성화
          </button>
          <button
            onClick={() => updateStatus(u.id, 'suspended')}
            disabled={actingId === u.id}
            className="px-2 py-1 rounded bg-amber-600 text-white text-sm hover:bg-amber-700 disabled:opacity-50"
          >
            정지
          </button>
          <button
            onClick={() => blockUser(u.id, u.id)}
            disabled={actingId === u.id}
            className="px-2 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-50"
          >
            차단(데모)
          </button>
        </div>
      ),
    },
  ];

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold">유저 검색/관리</h1>

      <section className="bg-white rounded-2xl shadow p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          className="border rounded px-3 py-2 md:col-span-3"
          placeholder="이메일/닉네임/ID 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 disabled:opacity-50"
          onClick={() => { setPage(1); load(); }}
          disabled={loading}
        >
          {loading ? '불러오는 중...' : '검색'}
        </button>
      </section>

      {error && <div className="text-red-600">{error}</div>}

      <Table<UserRow>
        columns={columns}
        rows={rows}
        loading={loading}
        emptyText="결과가 없습니다."
        rowKey={(row) => row.id}
      />

      <section className="flex items-center justify-between">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          이전
        </button>
        <div className="text-sm text-gray-600">페이지 {page} / {totalPages}</div>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={rows.length < limit}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          다음
        </button>
      </section>
    </main>
  );
}

    
