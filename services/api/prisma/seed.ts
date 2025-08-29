// services/api/prisma/seed.cjs
const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');

const prisma = new PrismaClient();

async function seedAdminUser() {
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  const plain = process.env.SEED_ADMIN_PASSWORD || 'Admin123!';

  const passwordHash = await argon2.hash(plain);

  await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: 'SUPER_ADMIN',
      status: 'active',
      provider: 'email',
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
      dob: new Date('1990-01-01T00:00:00.000Z'),
      gender: 'unknown',
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
  console.log('✅ Seed completed');
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
// --- seed announcements (idempotent) ---
await prisma.announcement.upsert({
  where: { id: 'seed-welcome' },
  update: {},
  create: {
    id: 'seed-welcome',
    title: '관리자 패널 오픈',
    body: '딱친 관리자 패널이 준비되었습니다.',
    isActive: true,
    startsAt: new Date(),
  },
});

