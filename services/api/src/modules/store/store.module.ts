import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';

@Module({
  controllers: [StoreController],
  providers: [StoreService, PrismaService],
})
export class StoreModule {}
