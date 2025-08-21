// services/api/prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
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
    '진로'
  ];

  for (const name of topics) {
    await prisma.topic.upsert({
      where: { name },
      update: {},
      create: { name }
    });
  }

  console.log('Seed completed: 10 topics created/updated');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });