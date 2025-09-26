// tok-friends/apps/admin/app/metrics/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { metricsApi } from '@/lib/api';

export default function MetricsPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await metricsApi.summary();
      if (res?.ok) {
        setData(res.data);
      } else {
        setError('메트릭스를 불러오지 못했습니다.');
      }
    } catch (e: any) {
      setError(e?.message || '에러 발생');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold">메트릭스 요약</h1>
      {loading && <p>불러오는 중...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(data).map(([k, v]) => (
            <div key={k} className="bg-white shadow rounded-2xl p-4">
              <h2 className="font-medium">{k}</h2>
              <p className="text-xl">{String(v)}</p>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={fetchData}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        새로고침
      </button>
    </main>
  );
}
