// services/api/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

function parseCorsOrigin(value?: string): true | string[] {
  if (!value || value.trim() === '' || value.trim() === '*') return true;
  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const corsOrigin = parseCorsOrigin(process.env.CORS_ORIGIN);

  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    optionsSuccessStatus: 204, // ✅ 프리플라이트 응답 코드
    maxAge: 86400,             // ✅ 프리플라이트 캐시(초) - 1일
  });

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('TokFriends API')
    .setDescription('Friend making & chat API')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const PORT = Number(process.env.PORT) || 3000;
  await app.listen(PORT, '0.0.0.0');

  const url = await app.getUrl();
  console.log(`[CORS] origin =`, corsOrigin);
  console.log(`API running on ${url} (docs: ${url.replace(/\/$/, '')}/docs)`);
}
bootstrap();
