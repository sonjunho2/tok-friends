// services/api/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { HealthModule } from './modules/health/health.module';
import { TopicsModule } from './modules/topics/topics.module';
import { PostsModule } from './modules/posts/posts.module';
import { CommunityModule } from './modules/community/community.module';

@Module({
 imports: [
   ConfigModule.forRoot({ isGlobal: true }),
   PrismaModule.forRoot({ isGlobal: true }),
   AuthModule,
   UsersModule,
   HealthModule,
   TopicsModule,
   PostsModule,
   CommunityModule,
 ],
})
export class AppModule {}