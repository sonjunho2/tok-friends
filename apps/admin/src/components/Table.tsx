tok-friends/apps/admin/src/components/Table.tsx
'use client';

import React from 'react';

export type Column<T extends Record<string, any>> = {
  key: keyof T | string;
  header: string;
  className?: string;
  render?: (row: T, index: number) => React.ReactNode;
};

export type TableProps<T extends Record<string, any>> = {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  emptyText?: string;
  rowKey?: (row: T, index: number) => string | number;
  onRowClick?: (row: T, index: number) => void;
};

export default function Table<T extends Record<string, any>>({
  columns,
  rows,
  loading,
  emptyText = '데이터가 없습니다.',
  rowKey,
  onRowClick,
}: TableProps<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow">
      <table className="min-w-full border-collapse">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((c) => (
              <th
                key={String(c.key)}
                className={`px-4 py-3 text-left text-sm font-semibold text-slate-700 ${c.className ?? ''}`}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-6 text-center text-sm text-slate-500">
                불러오는 중...
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-6 text-center text-sm text-slate-500">
                {emptyText}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => {
              const key = rowKey ? rowKey(row, i) : i;
              return (
                <tr
                  key={key}
                  className={onRowClick ? 'cursor-pointer hover:bg-slate-50' : undefined}
                  onClick={() => onRowClick?.(row, i)}
                >
                  {columns.map((c) => (
                    <td key={String(c.key)} className={`px-4 py-3 text-sm text-slate-800 ${c.className ?? ''}`}>
                      {c.render ? c.render(row, i) : String(row[c.key as keyof T] ?? '')}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
