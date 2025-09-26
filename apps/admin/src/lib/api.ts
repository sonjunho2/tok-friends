tok-friends/apps/admin/src/lib/api.ts
// 공용 API 클라이언트 (Next.js App Router 클라이언트/서버 겸용)

const API_BASE =
  process.env.NEXT_PUBLIC_TOK_API_BASE?.replace(/\/+$/, '') || '';

const ADMIN_JWT =
  process.env.NEXT_PUBLIC_TOK_ADMIN_JWT || '';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export function assertApiBase() {
  if (!API_BASE) {
    throw new Error('NEXT_PUBLIC_TOK_API_BASE is not configured');
  }
}

async function req<T = any>(
  path: string,
  init: { method?: HttpMethod; body?: any; auth?: boolean } = {},
): Promise<T> {
  assertApiBase();

  const url = `${API_BASE}/${path.replace(/^\/+/, '')}`;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (init.auth) {
    if (!ADMIN_JWT) throw new Error('NEXT_PUBLIC_TOK_ADMIN_JWT is empty');
    headers['Authorization'] = `Bearer ${ADMIN_JWT}`;
  }

  const res = await fetch(url, {
    method: init.method || 'GET',
    headers,
    body: init.body ? JSON.stringify(init.body) : undefined,
    // Next.js 캐시 기본 끔(관리 화면은 최신 데이터 우선)
    cache: 'no-store',
  });

  if (res.status === 204) return {} as T;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}

/** Metrics */
export const metricsApi = {
  async summary() {
    return req<{ ok: boolean; data: any }>('metrics', { method: 'GET', auth: true });
  },
};

/** Announcements (Admin) */
export type AnnouncementInput = {
  title: string;
  body: string;
  isActive?: boolean;
  startsAt?: string;
  endsAt?: string | null;
};

export const adminAnnouncementsApi = {
  list(params?: { page?: number; limit?: number }) {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    const qs = q.toString();
    return req<{ ok: boolean; data: any[]; total?: number }>(
      `admin/announcements${qs ? `?${qs}` : ''}`,
      { method: 'GET', auth: true },
    );
  },
  create(dto: AnnouncementInput) {
    return req<{ ok: boolean; data: any }>('admin/announcements', {
      method: 'POST',
      auth: true,
      body: dto,
    });
  },
  update(id: string, dto: Partial<AnnouncementInput>) {
    return req<{ ok: boolean; data: any }>(`admin/announcements/${id}`, {
      method: 'PATCH',
      auth: true,
      body: dto,
    });
  },
  remove(id: string) {
    return req<{ ok: boolean }>(`admin/announcements/${id}`, {
      method: 'DELETE',
      auth: true,
    });
  },
};

/** Public Announcements */
export const announcementsApi = {
  active() {
    return req<{ ok: boolean; data: any[] }>('announcements/active', {
      method: 'GET',
      auth: false,
    });
  },
  list(isActive?: boolean) {
    const q = isActive === undefined ? '' : `?isActive=${String(isActive)}`;
    return req<{ ok: boolean; data: any[] }>(`announcements${q}`, {
      method: 'GET',
      auth: false,
    });
  },
};
