// services/api/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedAdminUser() {
  const email = 'admin@local';
  const plain = 'Admin123!';
  const passwordHash = await bcrypt.hash(plain, 10);

  await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: 'SUPER_ADMIN',   // DB에 이미 이렇게 들어가 있었음
      status: 'active',      // 소문자
      provider: 'local',     // DB 값에 맞춤
      displayName: 'Super Admin',
      trustScore: 100,
      lang: 'ko',
      // update에는 필수값 추가 불필요(이미 존재할 수 있으니 변경 최소화)
    },
    create: {
      email,
      passwordHash,
      role: 'SUPER_ADMIN',
      status: 'active',
      provider: 'local',
      displayName: 'Super Admin',
      trustScore: 100,
      lang: 'ko',
      // ✅ 필수로 보이는 필드들 채움
      dob: new Date('1990-01-01T00:00:00.000Z'),
      gender: 'unknown',     // 텍스트 컬럼: 'male'/'female' 등 가능. 우선 'unknown'
      // 아래는 NOT NULL일 가능성 대비 값 채움(문자열 컬럼이므로 빈문자/기본값)
      phoneHash: '',         // NOT NULL이면 빈문자라도 들어가게
      region1: 'KR',         // 대분류 지역(한국)
      region2: 'Seoul',      // 소분류 지역(서울)
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
