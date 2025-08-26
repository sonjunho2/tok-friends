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
      // ✅ DB 실제 규칙에 맞춤
      role: 'SUPER_ADMIN',     // 기존 DB 값
      status: 'active',        // 소문자
      provider: 'local',       // 기존 DB 값
      displayName: 'Super Admin',
      trustScore: 100,
      lang: 'ko',
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
      dob: new Date('1990-01-01T00:00:00.000Z'),
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
main().catch((e) => {
  console.error('❌ Seed failed:', e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
