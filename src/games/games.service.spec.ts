import { Test, TestingModule } from '@nestjs/testing';
import { GamesService } from './games.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { GameIdDto } from './dto/create-game.dto';

describe('GamesService', () => {
  let service: GamesService;

  const mockPrismaService = {
    game: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    user_rating: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    }
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [GamesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        }],
    }).compile();

    service = module.get<GamesService>(GamesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll => Should return all users', async () => {
    const game = { "id": 13536, "pulse_rating": 0 };
    const games = [game];
    mockPrismaService.game.findMany.mockResolvedValue(games);

    //act
    const result = await service.findAll();

    expect(result).toEqual(games);
    expect(mockPrismaService.game.findMany).toHaveBeenCalledTimes(1);
  });

  it('findOne => Should return user, get by id', async () => {
    const id = 1;
    const game = { "id": 13536, "pulse_rating": 0 };
    mockPrismaService.game.findUnique.mockResolvedValue(game);

    //act
    const result = await service.findOne(id);

    expect(result).toEqual(game);
    expect(mockPrismaService.game.findUnique).toHaveBeenCalledTimes(1);
    expect(mockPrismaService.game.findUnique).toHaveBeenCalledWith({ where: { id }});
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

  it('createOrUpdateRating => Should update the existing rating if it already exists', async () => {
    const user_id = 1;
    const game_id = 13536;
    const starsCount = 4;
    const existingRating = { id: 1, user_id, game_id, ratings_count: 3 };
  
    mockPrismaService.user_rating.findMany.mockResolvedValue([existingRating]);
    mockPrismaService.user_rating.update.mockResolvedValue({
      ...existingRating,
      ratings_count: starsCount,
    });
  
    await service.createOrUpdateRating(user_id, game_id, starsCount);
  
    expect(mockPrismaService.user_rating.findMany).toHaveBeenCalledWith({
      where: { user_id, game_id },
    });
    expect(mockPrismaService.user_rating.update).toHaveBeenCalledWith({
      where: { id: existingRating.id },
      data: { ratings_count: starsCount },
    });
    expect(mockPrismaService.user_rating.create).not.toHaveBeenCalled();
  });
  
  it('createOrUpdateRating => Should create a new rating if it does not exist', async () => {
    const user_id = 1;
    const game_id = 13536;
    const starsCount = 4;
  
    mockPrismaService.user_rating.findMany.mockResolvedValue([]);
    mockPrismaService.user_rating.create.mockResolvedValue({
      user_id,
      game_id,
      ratings_count: starsCount,
    });
  
    await service.createOrUpdateRating(user_id, game_id, starsCount);
  
    expect(mockPrismaService.user_rating.findMany).toHaveBeenCalledWith({
      where: { user_id, game_id },
    });
    expect(mockPrismaService.user_rating.create).toHaveBeenCalledWith({
      data: { user_id, game_id, ratings_count: starsCount },
    });
    expect(mockPrismaService.user_rating.update).not.toHaveBeenCalled();
  });
  
  it('calculateAndUpdateRating => Should correctly calculate and update the game rating', async () => {
    const game_id = 13536;
    const userratings = [
      { user_id: 1, game_id, ratings_count: 4 },
      { user_id: 2, game_id, ratings_count: 5 },
    ];
    const totalRatings = 9;
    const totalUserCount = userratings.length;
    const avgRating = totalRatings / totalUserCount;
  
    mockPrismaService.user_rating.findMany.mockResolvedValue(userratings);
    mockPrismaService.game.update.mockResolvedValue({
      id: game_id,
      pulse_rating: avgRating,
      rated_userscount: totalUserCount,
    });
  
    const result = await service.calculateAndUpdateRating(game_id);
  
    expect(result).toEqual({
      id: game_id,
      pulse_rating: avgRating,
      rated_userscount: totalUserCount,
    });
    expect(mockPrismaService.user_rating.findMany).toHaveBeenCalledWith({
      where: { game_id },
    });
    expect(mockPrismaService.game.update).toHaveBeenCalledWith({
      where: { id: game_id },
      data: {
        pulse_rating: avgRating,
        rated_userscount: totalUserCount,
      },
    });
  });
  
  it('updateRating => Should create the game if it does not exist', async () => {
    const game_id = 13536;
    const rateGameDto = { user_id: 1, stars_count: 4 };
    const game = { id: game_id, pulse_rating: 0, rated_userscount: 0 };
    const updatedGame = { ...game, pulse_rating: 4, rated_userscount: 1 };
  
    jest.spyOn(service, 'createIfNotExist').mockResolvedValue(game);
    jest.spyOn(service, 'createOrUpdateRating').mockResolvedValue(undefined);
    jest.spyOn(service, 'calculateAndUpdateRating').mockResolvedValue(updatedGame);
  
    const result = await service.updateRating(game_id, rateGameDto);
  
    expect(service.createIfNotExist).toHaveBeenCalledWith({ id: game_id });
    expect(service.createOrUpdateRating).toHaveBeenCalledWith(rateGameDto.user_id, game_id, rateGameDto.stars_count);
    expect(service.calculateAndUpdateRating).toHaveBeenCalledWith(game_id);
    expect(result).toEqual(updatedGame);
  });
  
  it('updateRating => Should update the user rating and return the updated game', async () => {
    const game_id = 13536;
    const rateGameDto = { user_id: 1, stars_count: 5 };
    const game = { id: game_id, pulse_rating: 4, rated_userscount: 1 };
    const updatedGame = { id: game_id, pulse_rating: 4.5, rated_userscount: 2 };
  
    jest.spyOn(service, 'createIfNotExist').mockResolvedValue(game);
    jest.spyOn(service, 'createOrUpdateRating').mockResolvedValue(undefined);
    jest.spyOn(service, 'calculateAndUpdateRating').mockResolvedValue(updatedGame);
  
    const result = await service.updateRating(game_id, rateGameDto);
  
    expect(service.createIfNotExist).toHaveBeenCalledWith({ id: game_id });
    expect(service.createOrUpdateRating).toHaveBeenCalledWith(rateGameDto.user_id, game_id, rateGameDto.stars_count);
    expect(service.calculateAndUpdateRating).toHaveBeenCalledWith(game_id);
    expect(result).toEqual(updatedGame);
  });

});
