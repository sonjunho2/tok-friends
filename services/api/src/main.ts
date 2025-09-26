// tok-friends/services/api/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

function parseOrigins(env?: string): (string | RegExp)[] | boolean {
  if (!env) return true; // 개발 편의: 모든 오리진 허용(운영은 반드시 설정)
  const parts = env
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length === 0 ? true : parts;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOrigins = parseOrigins(process.env.CORS_ORIGIN);
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Disposition'],
  });

  const port = Number(process.env.PORT) || 4000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`API listening on port ${port} (CORS origins: ${process.env.CORS_ORIGIN || 'ALL'})`);
}

bootstrap();
