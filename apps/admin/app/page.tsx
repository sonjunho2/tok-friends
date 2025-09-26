import Link from 'next/link';

export default function Page() {
  return (
    <main>
      <h1 className="text-2xl font-semibold mb-2">TokFriends Admin</h1>
      <p className="text-sm text-slate-600 mb-6">
        관리자 대시보드. API 서버와 연동된 관리 기능에 접근하세요.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/metrics" className="rounded-2xl p-4 shadow bg-white block hover:bg-slate-50">
          <h2 className="font-medium">메트릭스</h2>
          <p className="text-sm text-slate-600">서비스 요약 지표 확인</p>
        </Link>
        <Link href="/announcements" className="rounded-2xl p-4 shadow bg-white block hover:bg-slate-50">
          <h2 className="font-medium">공지사항 관리</h2>
          <p className="text-sm text-slate-600">공지 작성/수정/삭제</p>
        </Link>
        <Link href="/reports" className="rounded-2xl p-4 shadow bg-white block hover:bg-slate-50">
          <h2 className="font-medium">신고 관리</h2>
          <p className="text-sm text-slate-600">신고 상태 변경 및 처리</p>
        </Link>
        <Link href="/users" className="rounded-2xl p-4 shadow bg-white block hover:bg-slate-50">
          <h2 className="font-medium">유저 관리</h2>
          <p className="text-sm text-slate-600">유저 검색/상태 변경</p>
        </Link>
        <Link href="/review" className="rounded-2xl p-4 shadow bg-white block hover:bg-slate-50">
          <h2 className="font-medium">콘텐츠 검수</h2>
          <p className="text-sm text-slate-600">포스트 신고 기반 검수</p>
        </Link>
      </div>
    </main>
  );
}
