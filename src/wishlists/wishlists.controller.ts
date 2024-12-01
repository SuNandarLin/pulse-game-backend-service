import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('wishlists')
@UseGuards(AuthGuard)
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  create(@Body() createWishlistDto: CreateWishlistDto) {
    return this.wishlistsService.create(createWishlistDto);
  }

  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Get('byuser')
  findWishListByUserId(@Query('userid') id: string) {
    return this.wishlistsService.findWishListByUserId(+id);
  }

  @Delete()
  remove(
    @Query('userid') userid: string,
    @Query('gameid') gameid: string,
  ) {
    return this.wishlistsService.remove(+userid, +gameid);
  }
}
