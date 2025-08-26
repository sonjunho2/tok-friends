// services/api/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

function parseCorsOrigin(value?: string): true | string[] {
  // CORS_ORIGIN이 비어있거나 "*"면 모든 오리진 허용
  if (!value || value.trim() === '' || value.trim() === '*') return true;
  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // CORS 설정 수정 - parseCorsOrigin 함수 실제 사용
  const corsOrigin = parseCorsOrigin(process.env.CORS_ORIGIN);
  
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Helmet
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('TokFriends API')
    .setDescription('Friend making & chat API')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Render 등 PaaS 환경에서 제공하는 PORT 사용
  const PORT = Number(process.env.PORT) || 3000;
  await app.listen(PORT, '0.0.0.0');

  const url = await app.getUrl();
  console.log(`API running on ${url} (docs: ${url.replace(/\/$/, '')}/docs)`);
}

bootstrap();
