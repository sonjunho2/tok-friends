ALTER TABLE "Report" DROP CONSTRAINT IF EXISTS "Report_reporterId_fkey";
ALTER TABLE "Report" DROP CONSTRAINT IF EXISTS "Report_reportedId_fkey";
ALTER TABLE "Report" DROP CONSTRAINT IF EXISTS "Report_postId_fkey";

-- 컬럼 타입 변경 (Int -> UUID)
-- 기존 값이 Int였다면 캐스팅이 실패할 수 있으니, 데이터가 있다면 먼저 정리하거나
-- 임시로 null 허용 후 업데이트하는 절차가 필요합니다.
ALTER TABLE "Report" ALTER COLUMN "reporterId" TYPE uuid USING ("reporterId"::text)::uuid;
ALTER TABLE "Report" ALTER COLUMN "reportedId" TYPE uuid USING (CASE WHEN "reportedId" IS NULL THEN NULL ELSE ("reportedId"::text)::uuid END);
ALTER TABLE "Report" ALTER COLUMN "postId"     TYPE uuid USING (CASE WHEN "postId" IS NULL THEN NULL ELSE ("postId"::text)::uuid END);

ALTER TABLE "Report" ADD CONSTRAINT "Report_reporterId_fkey"
  FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Report" ADD CONSTRAINT "Report_reportedId_fkey"
  FOREIGN KEY ("reportedId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Report" ADD CONSTRAINT "Report_postId_fkey"
  FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
