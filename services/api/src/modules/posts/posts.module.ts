// services/api/src/modules/posts/posts.module.ts
import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService, PrismaService],
  exports: [PostsService],
})
export class PostsModule {}