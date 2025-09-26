'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { adminReportsApi, type ReportStatus } from '@/lib/api';

type Row = {
  id: number | string;
  reporterId?: string | null;
  reportedId?: string | null;
  postId?: string | null;
  reason?: string | null;
  status: ReportStatus;
  createdAt?: string;
};

const STATUSES: ReportStatus[] = ['PENDING', 'REVIEWING', 'RESOLVED', 'REJECTED'];

export default function ReportsPage() {
  const [status, setStatus] = useState<ReportStatus>('PENDING');
  const [search, setSearch] = useState('');
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [acting, setActing] = useState<string | number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const title = useMemo(() => {
    switch (status) {
      case 'PENDING': return '대기 중 신고';
      case 'REVIEWING': return '검토 중 신고';
      case 'RESOLVED': return '처리 완료';
      case 'REJECTED': return '반려됨';
      default: return '신고';
    }
  }, [status]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminReportsApi.list({
        status,
        search: search || undefined,
        page: 1,
        limit: 20,
      });
      if ((res as any)?.ok) {
        setRows((res as any).data as Row[]);
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
  }, [status]);

  const changeStatus = async (id: string | number, next: ReportStatus) => {
    setActing(id);
    setError(null);
    try {
      await adminReportsApi.updateStatus(String(id), next);
      await load();
    } catch (e: any) {
      setError(e?.message || '상태 변경 실패');
    } finally {
      setActing(null);
    }
  };

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold">신고 관리</h1>

      <section className="bg-white rounded-2xl shadow p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <select
          className="border rounded px-3 py-2"
          value={status}
          onChange={(e) => setStatus(e.target.value as ReportStatus)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input
          className="border rounded px-3 py-2 md:col-span-2"
          placeholder="검색(이메일/닉네임/ID 등)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 disabled:opacity-50"
          onClick={load}
          disabled={loading}
        >
          {loading ? '불러오는 중...' : '검색'}
        </button>
      </section>

      {error && <div className="text-red-600">{error}</div>}

      <section className="bg-white rounded-2xl shadow divide-y">
        {rows.length === 0 && !loading && (
          <div className="p-4 text-gray-500">결과가 없습니다.</div>
        )}
        {rows.map((r) => (
          <div key={r.id} className="p-4 flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="font-semibold">#{String(r.id)} · {r.status}</div>
              <div className="text-sm text-gray-600">
                신고자: {r.reporterId ?? '-'} · 피신고자: {r.reportedId ?? '-'} · 포스트: {r.postId ?? '-'}
              </div>
              {r.reason && <div className="text-sm mt-1">{r.reason}</div>}
            </div>
            <div className="flex gap-2">
              {status !== 'REVIEWING' && (
                <button
                  onClick={() => changeStatus(r.id, 'REVIEWING')}
                  disabled={acting === r.id}
                  className="px-3 py-1 rounded bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50"
                >
                  검토중
                </button>
              )}
              {status !== 'RESOLVED' && (
                <button
                  onClick={() => changeStatus(r.id, 'RESOLVED')}
                  disabled={acting === r.id}
                  className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                >
                  처리완료
                </button>
              )}
              {status !== 'REJECTED' && (
                <button
                  onClick={() => changeStatus(r.id, 'REJECTED')}
                  disabled={acting === r.id}
                  className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                >
                  반려
                </button>
              )}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
