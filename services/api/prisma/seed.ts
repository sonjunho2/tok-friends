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
      role: 'ADMIN',
      status: 'ACTIVE',
      displayName: 'Super Admin',
      provider: 'email',
      trustScore: 100,
      lang: 'ko',
      // update에는 dob 생략 (이미 값이 있을 수 있음)
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
      // ✅ 이 필드가 필수라서 반드시 넣어야 함
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

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
