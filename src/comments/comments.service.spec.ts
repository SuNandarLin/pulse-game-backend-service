import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CreateCommentDto } from './dto/create-comment.dto';

describe('CommentsService', () => {
  let service: CommentsService;

  const mockPrismaService = {
    comment: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [
        CommentsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        }
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create => Should create a new comment and return its data', async () => {
    // arrange
    const createCommentDto = {
      "comment_text":"Yeahh I also love this",
      "vote": 0,
      "user_id": 2,
      "post_id": 1
  } as CreateCommentDto;

    const comment = {
      id: 1,
      ...createCommentDto
    };

    // jest.spyOn(mockUserRepository, 'save').mockReturnValue(comment);
    mockPrismaService.comment.create.mockResolvedValue(comment);

    // act
    const result = await service.create(createCommentDto);

    // assert
    expect(mockPrismaService.comment.create).toHaveBeenCalledTimes(1);
    expect(mockPrismaService.comment.create).toHaveBeenCalledWith({data: createCommentDto});
    expect(result).toEqual(comment);
  });

  it('findAll => Should return all comments', async () => {
    const comment =  {
      "id": 1,
      "comment_text": "Yeahh I also love this",
      "vote": 0,
      "user_id": 2,
      "post_id": 1,
      "user": {
          "id": 2,
          "auth_id": null,
          "username": "gamer_snl",
          "first_name": "Su Nandar",
          "last_name": "Linn",
          "email": "hsunandar.linn98@gmail.com",
          "phone_number": "+65123243543",
          "address": "Bedok Chai Chee Street",
          "postal_code": "001122",
          "unit_number": "#01-01",
          "profile_url": null,
          "accept_marketing": false,
          "createdAt": "2024-07-21T05:20:48.270Z",
          "updatedAt": "2024-07-21T05:20:48.270Z"
      },
      "replies": []
  };
    const comments = [comment];
    mockPrismaService.comment.findMany.mockResolvedValue(comments);

    //act
    const result = await service.findAll();

    expect(result).toEqual(comments);
    expect(mockPrismaService.comment.findMany).toHaveBeenCalledTimes(1);
  });

  it('findOne => Should return comment, get by id', async () => {
    const id = 1;
    const comment =  {
      "id": 1,
      "comment_text": "Yeahh I also love this",
      "vote": 0,
      "user_id": 2,
      "post_id": 1,
      "user": {
          "id": 2,
          "auth_id": null,
          "username": "gamer_snl",
          "first_name": "Su Nandar",
          "last_name": "Linn",
          "email": "hsunandar.linn98@gmail.com",
          "phone_number": "+65123243543",
          "address": "Bedok Chai Chee Street",
          "postal_code": "001122",
          "unit_number": "#01-01",
          "profile_url": null,
          "accept_marketing": false,
          "createdAt": "2024-07-21T05:20:48.270Z",
          "updatedAt": "2024-07-21T05:20:48.270Z"
      },
      "replies": []
  };
    mockPrismaService.comment.findUnique.mockResolvedValue(comment);

    //act
    const result = await service.findOne(id);

    expect(result).toEqual(comment);
    expect(mockPrismaService.comment.findUnique).toHaveBeenCalledTimes(1);
    expect(mockPrismaService.comment.findUnique).toHaveBeenCalledWith({ where: { id }});
  });
  
  it('remove => Should delete the comment by id and return the deleted comment', async () => {
    const id = 1;
    const comment =  {
      "id": 1,
      "comment_text": "Yeahh I also love this",
      "vote": 0,
      "user_id": 2,
      "post_id": 1,
      "user": {
          "id": 2,
          "auth_id": null,
          "username": "gamer_snl",
          "first_name": "Su Nandar",
          "last_name": "Linn",
          "email": "hsunandar.linn98@gmail.com",
          "phone_number": "+65123243543",
          "address": "Bedok Chai Chee Street",
          "postal_code": "001122",
          "unit_number": "#01-01",
          "profile_url": null,
          "accept_marketing": false,
          "createdAt": "2024-07-21T05:20:48.270Z",
          "updatedAt": "2024-07-21T05:20:48.270Z"
      },
      "replies": []
  };
    mockPrismaService.comment.delete.mockResolvedValue(comment);

    //act
    const result = await service.remove(id);

    expect(result).toEqual(comment);
    expect(mockPrismaService.comment.delete).toHaveBeenCalledTimes(1);
    expect(mockPrismaService.comment.delete).toHaveBeenCalledWith({ where: { id }});
  });
});
