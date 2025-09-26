import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

function parseOrigins(env?: string): (string | RegExp)[] {
  if (!env) return ['*'];
  return env
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = Number(process.env.PORT ?? 4000);
  const origins = parseOrigins(process.env.CORS_ORIGIN);

  app.enableCors({
    origin: (origin, callback) => {
      // 서버간 통신/헬스체크 등 Origin 없는 요청 허용
      if (!origin) return callback(null, true);
      if (origins.includes('*')) return callback(null, true);
      if (origins.some((o) => o === origin)) return callback(null, true);
      callback(new Error(`CORS blocked: ${origin}`), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: [],
    maxAge: 600,
  });

  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`API listening on :${port}`);
}
bootstrap();
