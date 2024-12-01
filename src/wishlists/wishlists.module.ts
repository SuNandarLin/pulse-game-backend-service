import { Module } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [WishlistsController],
  providers: [WishlistsService],
  imports: [PrismaModule],
})
export class WishlistsModule {}
