'use client';

import React, { useEffect, useState } from 'react';
import { metricsApi } from '@/lib/api';
import Table, { type Column } from '@/components/Table';

type MetricRow = {
  key: string;
  value: number;
};

export default function MetricsPage() {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<MetricRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await metricsApi.summary();
      if (res?.ok) {
        const data = res.data as Record<string, number>;
        setRows(Object.entries(data).map(([k, v]) => ({ key: k, value: v })));
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

  const columns: Column<MetricRow>[] = [
    { key: 'key', header: '항목' },
    { key: 'value', header: '값' },
  ];

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold">메트릭스 요약</h1>
      {error && <p className="text-red-600">{error}</p>}
      <Table<MetricRow>
        columns={columns}
        rows={rows}
        loading={loading}
        emptyText="데이터 없음"
        rowKey={(r) => r.key}
      />
      <button
        onClick={fetchData}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        새로고침
      </button>
    </main>
  );
}
