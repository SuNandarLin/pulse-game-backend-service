import { Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { PrismaService } from '../prisma/prisma.service';
import { GameIdDto } from '../games/dto/create-game.dto';

@Injectable()
export class WishlistsService {
  constructor(private prisma: PrismaService) {}

  async createIfNotExist(gameIdDto: GameIdDto) {
    const existingGame = await this.prisma.game.findUnique({
      where: { id: gameIdDto.id },
    });
    if (!existingGame) {
      const createdGame = await this.prisma.game.create({
        data: {
          id: gameIdDto.id,
          pulse_rating: 0,
        },
      });
      return createdGame;
    }
    return existingGame;
  }

  async create(createWishlistDto: CreateWishlistDto) {
    const wishlistedGames = await this.findWishListByUserIdAndGameId(
      createWishlistDto.user_id,
      createWishlistDto.game_id,
    );
    if (wishlistedGames.length > 0) {
      return {
        message: 'Game is already added to Wish List',
      };
    }
    await this.createIfNotExist({
      id: createWishlistDto.game_id,
    });
    return this.prisma.user_wishlist.create({ data: createWishlistDto });
  }

  findAll() {
    return this.prisma.user_wishlist.findMany();
  }

  findWishListByUserId(id: number) {
    return this.prisma.user_wishlist.findMany({
      where: {
        user_id: id,
      },
    });
  }

  findWishListByUserIdAndGameId(user_id: number, game_id: number) {
    return this.prisma.user_wishlist.findMany({
      where: {
        user_id,
        game_id,
      },
    });
  }

  async remove(user_id: number, game_id) {
    const deleted = await this.prisma.user_wishlist.deleteMany({
      where: {
        user_id,
        game_id,
      },
    });
    if (deleted) {
      return this.findWishListByUserId(user_id);
    }
  }
}
