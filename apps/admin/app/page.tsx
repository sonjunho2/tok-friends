export default function Page() {
  return (
    <main>
      <h1 className="text-2xl font-semibold mb-2">TokFriends Admin</h1>
      <p className="text-sm text-slate-600 mb-6">
        Minimal admin starter. Connect to the API server at <code>http://localhost:4000</code>.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl p-4 shadow bg-white">
          <h2 className="font-medium">신고 큐</h2>
          <p className="text-sm text-slate-600">대기 중 신고를 검토하세요.</p>
        </div>
        <div className="rounded-2xl p-4 shadow bg-white">
          <h2 className="font-medium">유저 검색</h2>
          <p className="text-sm text-slate-600">이메일/닉네임으로 조회.</p>
        </div>
        <div className="rounded-2xl p-4 shadow bg-white">
          <h2 className="font-medium">콘텐츠 검수</h2>
          <p className="text-sm text-slate-600">사진/소개문 점수 기반.</p>
        </div>
      </div>
    </main>
  );
}
