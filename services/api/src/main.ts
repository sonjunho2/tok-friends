// services/api/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const corsOrigin = process.env.CORS_ORIGIN?.split(',') || true;
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  app.use(helmet());

  const config = new DocumentBuilder()
    .setTitle('TokFriends API')
    .setDescription('Friend making & chat API')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const PORT = Number(process.env.PORT) || 8000;
  await app.listen(PORT, '0.0.0.0');
  console.log(`API running on http://localhost:${PORT}`);
}
bootstrap();