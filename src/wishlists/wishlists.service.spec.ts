import { Test, TestingModule } from '@nestjs/testing';
import { WishlistsService } from './wishlists.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { GameIdDto } from '../games/dto/create-game.dto';

describe('WishlistsService', () => {
  let service: WishlistsService;

  const mockPrismaService = {
    user_wishlist: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    game: {
      create: jest.fn(),
      findUnique: jest.fn(),
    }
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [WishlistsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        }],
    }).compile();

    service = module.get<WishlistsService>(WishlistsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('createIfNotExist => Should return the existing game if it already exists', async () => {
    // arrange
    const gameIdDto = { "id": 1} as GameIdDto;

    const game = { "id": 13536, "pulse_rating": 0 };

    mockPrismaService.game.findUnique.mockResolvedValue(game);

    // act
    const result = await service.createIfNotExist(gameIdDto);

    // assert
    expect(result).toEqual(game);

    expect(mockPrismaService.game.findUnique).toHaveBeenCalledTimes(1);
    expect(mockPrismaService.game.findUnique).toHaveBeenCalledWith({
      where: { id: gameIdDto.id },
    });
    expect(mockPrismaService.game.create).not.toHaveBeenCalledWith();
  });

  it('createIfNotExist =>  Should create and return a new game if it does not exist', async () => {
    // arrange
    const gameIdDto = { id: 13536 };
    const createdGame = { id: 13536, pulse_rating: 0 };
  
    mockPrismaService.game.findUnique.mockResolvedValue(null);
    mockPrismaService.game.create.mockResolvedValue(createdGame);
  
    const result = await service.createIfNotExist(gameIdDto);
  
    expect(result).toEqual(createdGame);
    expect(mockPrismaService.game.findUnique).toHaveBeenCalledWith({
      where: { id: gameIdDto.id },
    });
    expect(mockPrismaService.game.create).toHaveBeenCalledWith({
      data: {
        id: gameIdDto.id,
        pulse_rating: 0,
      },
    });
  });

  it('create => Should return a message if the game is already in the wishlist', async () => {
    const createWishlistDto = {
      id: 1,
      user_id: 2,
      game_id: 13536,
    };
  
    const wishlistedGames = [createWishlistDto];
    jest.spyOn(service, 'findWishListByUserIdAndGameId').mockResolvedValue(wishlistedGames);
  
    const result = await service.create(createWishlistDto);
  
    expect(result).toEqual({ message: 'Game is already added to Wish List' });
    expect(service.findWishListByUserIdAndGameId).toHaveBeenCalledWith(
      createWishlistDto.user_id,
      createWishlistDto.game_id,
    );
    expect(mockPrismaService.user_wishlist.create).not.toHaveBeenCalled();
  });

  it('create => Should add the game to the wishlist if not already present', async () => {
    const createWishlistDto = {
      id: 1,
      user_id: 2,
      game_id: 13536,
    };
  
    jest.spyOn(service, 'findWishListByUserIdAndGameId').mockResolvedValue([]);
    jest.spyOn(service, 'createIfNotExist').mockResolvedValue(undefined);
    mockPrismaService.user_wishlist.create.mockResolvedValue(createWishlistDto);
  
    const result = await service.create(createWishlistDto);
  
    expect(result).toEqual(createWishlistDto);
    expect(service.findWishListByUserIdAndGameId).toHaveBeenCalledWith(
      createWishlistDto.user_id,
      createWishlistDto.game_id,
    );
    expect(service.createIfNotExist).toHaveBeenCalledWith({ id: createWishlistDto.game_id });
    expect(mockPrismaService.user_wishlist.create).toHaveBeenCalledWith({ data: createWishlistDto });
  });
  
  

//   it('create => Should create a new wishlist and return its data', async () => {
//     // arrange
//   const createWishlistDto = {
//     "user_id": 2,
//     "game_id": 13536
// };

//   const wishlist = {
//     "id": 2,
//     "user_id": 2,
//     "game_id": 13536
//   } as CreateWishlistDto;

//   const gameDto = {
//     "id": 1
// } as GameIdDto;

//     // jest.spyOn(mockUserRepository, 'save').mockReturnValue(user);
//     mockPrismaService.user_wishlist.create.mockResolvedValue(wishlist);

//     // act
//     const result = await service.create(createWishlistDto);
//     // const gameresult = await service.createIfNotExist(gameDto);

//     // assert
//     expect(mockPrismaService.findWishListByUserIdAndGameId).toHaveBeenCalledTimes(1);
//     expect(mockPrismaService.user_wishlist.create).toHaveBeenCalledTimes(1);
//     expect(mockPrismaService.user_wishlist.create).toHaveBeenCalledWith({ data: createWishlistDto });
//     expect(result).toEqual(wishlist);
//   });

  it('findAll => Should return all wishlists', async () => {
    const wishlist = {
      "id": 2,
      "user_id": 2,
      "game_id": 13536
    };
    const wishlists = [wishlist];
    mockPrismaService.user_wishlist.findMany.mockResolvedValue(wishlists);

    //act
    const result = await service.findAll();

    expect(result).toEqual(wishlists);
    expect(mockPrismaService.user_wishlist.findMany).toHaveBeenCalledTimes(1);
  });

  it('findWishListByUserId => Should return wishlist, get by id', async () => {
    const id = 1;
    const wishlist = {
      "id": 2,
      "user_id": 2,
      "game_id": 13536
    };
    const wishlists = [wishlist];
    mockPrismaService.user_wishlist.findMany.mockResolvedValue(wishlists);

    //act
    const result = await service.findWishListByUserId(id);

    expect(result).toEqual(wishlists);
    expect(mockPrismaService.user_wishlist.findMany).toHaveBeenCalledTimes(1);
    expect(mockPrismaService.user_wishlist.findMany).toHaveBeenCalledWith({ where: { user_id: id }});
  });

  it('findWishListByUserIdAndGameId => Should return wishlist, get by firebaseuserid', async () => {
    const user_id = 1;
    const game_id = 1;
    const wishlist = {
      "id": 2,
      "user_id": 2,
      "game_id": 13536
    };
    const wishlists = [wishlist];
    mockPrismaService.user_wishlist.findMany.mockResolvedValue(wishlists);

    //act
    const result = await service.findWishListByUserIdAndGameId(user_id,game_id);

    expect(result).toEqual(wishlists);
    expect(mockPrismaService.user_wishlist.findMany).toHaveBeenCalledTimes(1);
    expect(mockPrismaService.user_wishlist.findMany).toHaveBeenCalledWith({
      where: {
        user_id,
        game_id,
      },
    });

  });

  it('remove => Should delete the wishlist by id and return the deleted wishlist', async () => {
    const user_id = 1;
    const game_id = 1;
    const wishlist = {
      "id": 2,
      "user_id": 2,
      "game_id": 13536
    };
    const wishlists = [wishlist];
    mockPrismaService.user_wishlist.deleteMany.mockResolvedValue(wishlists);

    //act
    const result = await service.remove(user_id,game_id);

    expect(result).toEqual(wishlists);
    expect(mockPrismaService.user_wishlist.deleteMany).toHaveBeenCalledTimes(1);
    expect(mockPrismaService.user_wishlist.deleteMany).toHaveBeenCalledWith({
      where: {
        user_id,
        game_id,
      },
    });
  });
});
