'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { adminReportsApi, adminBlocksApi, type ReportStatus } from '@/lib/api';

type ReportRow = {
  id: number | string;
  reporterId?: string | null;
  reportedId?: string | null;
  postId?: string | null;
  reason?: string | null;
  status: ReportStatus;
  createdAt?: string;
};

const STATUSES: ReportStatus[] = ['PENDING', 'REVIEWING'];

export default function ReviewPage() {
  const [status, setStatus] = useState<ReportStatus>('PENDING');
  const [search, setSearch] = useState('');
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [acting, setActing] = useState<string | number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const title = useMemo(() => (status === 'PENDING' ? '콘텐츠 검수 대기' : '콘텐츠 검수(진행 중)'), [status]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminReportsApi.list({
        status,
        search: search || undefined,
        page: 1,
        limit: 50,
      });
      const data = res as any;
      if (data?.ok) {
        // 게시글 관련(포스트 신고)만 노출
        const onlyPosts = (data.data as ReportRow[]).filter((r) => !!r.postId);
        setRows(onlyPosts);
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

  const blockReported = async (reportedId?: string | null) => {
    if (!reportedId) return;
    setActing(reportedId);
    setError(null);
    try {
      // 관리자 정책에 따라 actor(userId)는 관리 시스템상 별도 주체가 될 수 있으나
      // 여기서는 간단히 reportedId를 차단의 대상/작성자로 데모 호출
      await adminBlocksApi.create(reportedId, reportedId);
      alert('차단 완료(데모)');
    } catch (e: any) {
      setError(e?.message || '차단 실패');
    } finally {
      setActing(null);
    }
  };

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold">{title}</h1>

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
          placeholder="검색(이메일/닉네임/ID/사유 등)"
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
          <div className="p-4 text-gray-500">검수할 항목이 없습니다.</div>
        )}
        {rows.map((r) => (
          <div key={r.id} className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-semibold">신고 #{String(r.id)} · 상태 {r.status}</div>
              <div className="text-sm text-gray-500">생성일: {r.createdAt ?? '-'}</div>
            </div>
            <div className="text-sm text-gray-700">
              신고자: {r.reporterId ?? '-'} · 피신고자: {r.reportedId ?? '-'} · 포스트ID: {r.postId ?? '-'}
            </div>
            {r.reason && <div className="text-sm">사유: {r.reason}</div>}

            <div className="flex gap-2">
              {r.status !== 'REVIEWING' && (
                <button
                  onClick={() => changeStatus(r.id, 'REVIEWING')}
                  disabled={acting === r.id}
                  className="px-3 py-1 rounded bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50"
                >
                  검토중
                </button>
              )}
              <button
                onClick={() => changeStatus(r.id, 'RESOLVED')}
                disabled={acting === r.id}
                className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              >
                승인(처리)
              </button>
              <button
                onClick={() => changeStatus(r.id, 'REJECTED')}
                disabled={acting === r.id}
                className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                반려
              </button>
              <button
                onClick={() => blockReported(r.reportedId)}
                disabled={acting === r.reportedId}
                className="px-3 py-1 rounded bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50"
                title="피신고자 빠른 차단(데모)"
              >
                빠른 차단
              </button>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
