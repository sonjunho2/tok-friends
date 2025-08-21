// services/api/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

function parseCorsOrigin(value?: string): true | string[] {
  // CORS_ORIGIN이 비어있거나 "*"면 모든 오리진 허용(요청 오리진 반사) -> credentials와 함께 사용 가능
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

  // CORS
  const corsOrigin = parseCorsOrigin(process.env.CORS_ORIGIN);
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  // Helmet (Swagger와 CSP 충돌 방지)
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
  const PORT = Number(process.env.PORT) || 8000;
  await app.listen(PORT, '0.0.0.0');

  const url = await app.getUrl();
  console.log(`API running on ${url} (docs: ${url.replace(/\/$/, '')}/docs)`);
}

bootstrap();
