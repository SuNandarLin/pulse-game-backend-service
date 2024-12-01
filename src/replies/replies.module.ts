import { Module } from '@nestjs/common';
import { RepliesService } from './replies.service';
import { RepliesController } from './replies.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [RepliesController],
  providers: [RepliesService],
  imports: [PrismaModule],
})
export class RepliesModule {}
