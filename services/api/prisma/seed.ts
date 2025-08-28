// services/api/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function seedAdminUser() {
  const email = 'admin@example.com';
  const plain = 'Admin123!';

  // ✅ 로그인 검증(argon2.verify)에 맞춰 argon2로 통일
  const passwordHash = await argon2.hash(plain);

  await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: 'SUPER_ADMIN',
      status: 'active',
      provider: 'email',     // signup과 일관성 있게 'email' 사용
      displayName: 'Super Admin',
      trustScore: 100,
      lang: 'ko',
    },
    create: {
      email,
      passwordHash,
      role: 'SUPER_ADMIN',
      status: 'active',
      provider: 'email',
      displayName: 'Super Admin',
      trustScore: 100,
      lang: 'ko',
      // 필수로 보이는 필드 채움
      dob: new Date('1990-01-01T00:00:00.000Z'),
      gender: 'unknown',
      // schema 상 선택(optional)이라면 생략 가능하지만 안전하게 기본값 지정
      phoneHash: '',
      region1: 'KR',
      region2: 'Seoul',
    },
  });
}

async function seedTopics() {
  const topics = ['일상','연애','취미','여행','운동','반려동물','요리','음악','게임','진로'];
  for (const name of topics) {
    await prisma.topic.upsert({ where: { name }, update: {}, create: { name } });
  }
}

async function main() {
  await seedAdminUser();
  await seedTopics();
  console.log('✅ Seed completed: admin user + 10 topics created/updated');
  console.log('   └─ admin email: admin@example.com / password: Admin123!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
