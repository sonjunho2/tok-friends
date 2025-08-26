// services/api/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedAdminUser() {
  // 관리자 계정 기본값
  const email = 'admin@local';
  const plain = 'Admin123!';

  const passwordHash = await bcrypt.hash(plain, 10);

  // User 테이블에 관리자 계정 업서트
  await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: 'ADMIN',       // text 컬럼이므로 문자열로 저장
      status: 'ACTIVE',
      displayName: 'Super Admin',
      provider: 'email',
      trustScore: 100,     // 선택값
      lang: 'ko',          // 선택값
    },
    create: {
      email,
      passwordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
      displayName: 'Super Admin',
      provider: 'email',
      trustScore: 100,
      lang: 'ko',
    } as any,
  });
}

async function seedTopics() {
  const topics = [
    '일상',
    '연애',
    '취미',
    '여행',
    '운동',
    '반려동물',
    '요리',
    '음악',
    '게임',
    '진로',
  ];

  for (const name of topics) {
    await prisma.topic.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
}

async function main() {
  await seedAdminUser();
  await seedTopics();

  console.log('✅ Seed completed: admin user + 10 topics created/updated');
  console.log('   └─ admin email: admin@local / password: Admin123!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
