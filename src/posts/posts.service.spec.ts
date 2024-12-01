import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CreatePostDto } from './dto/create-post.dto';

describe('PostsService', () => {
  let service: PostsService;

  const mockPrismaService = {
    post: {
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
        PostsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        }
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create => Should create a new post and return its data', async () => {
    // arrange
    const createPostDto = {
      "post_title": "Issues in games",
      "post_desc": "I wonder how you guys solve these issues!!!",
      "user_id": 2
  } as CreatePostDto;

    const post = {
      "id": 3,
      "post_title": "Issues in games",
      "post_desc": "I wonder how you guys solve these issues!!!",
      "upvote_count": 0,
      "downvote_count": 0,
      "upvoted_userids": [],
      "downvoted_userids": [],
      "user_id": 2,
      "game_id": null
  };

    // jest.spyOn(mockUserRepository, 'save').mockReturnValue(post);
    mockPrismaService.post.create.mockResolvedValue(post);

    // act
    const result = await service.create(createPostDto);

    // assert
    expect(mockPrismaService.post.create).toHaveBeenCalledTimes(1);
    expect(mockPrismaService.post.create).toHaveBeenCalledWith({data: createPostDto});
    expect(result).toEqual(post);
  });

  it('findAll => Should return all posts', async () => {
    const current_user_id = 1;
    const post = {
      "id": 1,
      "post_title": "",
      "post_desc": "",
      "upvote_count": 2,
      "downvote_count": 1,
      "upvoted_userids": [
          2,
          3
      ],
      "downvoted_userids": [
          2
      ],
      "user_id": 2,
      "game_id": 13536,
      "comments": [
          {
              "id": 1,
              "comment_text": "I also love it a lotttt",
              "vote": 1,
              "user_id": 2,
              "post_id": 1
          }
      ],
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
      "upvoted": true,
      "downvoted": false
  };
    const posts = [post];
    mockPrismaService.post.findMany.mockResolvedValue(posts);

    //act
    const result = await service.findAll(current_user_id);

    expect(result).toEqual(posts);
    expect(mockPrismaService.post.findMany).toHaveBeenCalledTimes(1);
    expect(mockPrismaService.post.findMany).toHaveBeenCalledWith({
      include: {
        comments: true,
        user: true,
      },
    });
    
  });

  it('findOne => Should return post, get by id', async () => {
    const id = 1;
    const post = {
      "id": 1,
      "post_title": "",
      "post_desc": "",
      "upvote_count": 2,
      "downvote_count": 1,
      "upvoted_userids": [
          2,
          3
      ],
      "downvoted_userids": [
          2
      ],
      "user_id": 2,
      "game_id": 13536,
      "comments": [
          {
              "id": 1,
              "comment_text": "I also love it a lotttt",
              "vote": 1,
              "user_id": 2,
              "post_id": 1
          }
      ],
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
      "upvoted": true,
      "downvoted": false
  };
    mockPrismaService.post.findUnique.mockResolvedValue(post);

    //act
    const result = await service.findOne(id);

    expect(result).toEqual(post);
    expect(mockPrismaService.post.findUnique).toHaveBeenCalledTimes(1);
    expect(mockPrismaService.post.findUnique).toHaveBeenCalledWith({ where: { id }});
  });

  it('upvote => Should return updated post', async () => {
    const user_id = 3;
    const post_id = 2;
    const updated_upvoted_userids = [2, 3, 3];
    const post = {
      "id": 3,
      "post_title": "Issues in games",
      "post_desc": "I wonder how you guys solve these issues!!!",
      "upvote_count": 2,
      "downvote_count": 0,
      "upvoted_userids": [2, 3, 3],
      "downvoted_userids": [],
      "user_id": 2,
      "game_id": null
  };
    mockPrismaService.post.update.mockResolvedValue(post);

    //act
    const result = await service.upVote(user_id,post_id);

    expect(mockPrismaService.post.findUnique).toHaveBeenCalledTimes(1);
    expect(mockPrismaService.post.findUnique).toHaveBeenCalledWith({ where: { id: post_id } });
    expect(mockPrismaService.post.update).toHaveBeenCalledTimes(1);
    expect(mockPrismaService.post.update).toHaveBeenCalledWith({
      where: { id: post_id },
      data: {
        upvoted_userids: updated_upvoted_userids,
        upvote_count: {
          increment: 1,
        },
      },
    });
    expect(result).toEqual(post);

  });

  it('downvote => Should return updated post', async () => {
    const user_id = 3;
    const post_id = 2;
    const updated_downvoted_userids = [2, 3];
    const post = {
      "id": 3,
      "post_title": "Issues in games",
      "post_desc": "I wonder how you guys solve these issues!!!",
      "upvote_count": 2,
      "downvote_count": 0,
      "upvoted_userids": [],
      "downvoted_userids": [2, 3],
      "user_id": 2,
      "game_id": null
  };
    mockPrismaService.post.update.mockResolvedValue(post);

    //act
    const result = await service.downVote(user_id,post_id);

    expect(mockPrismaService.post.findUnique).toHaveBeenCalledTimes(1);
    expect(mockPrismaService.post.findUnique).toHaveBeenCalledWith({ where: { id: post_id } });
    expect(mockPrismaService.post.update).toHaveBeenCalledTimes(1);
    expect(mockPrismaService.post.update).toHaveBeenCalledWith({
      where: { id: post_id },
      data: {
        downvoted_userids: updated_downvoted_userids,
        downvote_count: {
          increment: 1,
        },
      },
    });
    expect(result).toEqual(post);

  });
  
  it('remove => Should delete the post by id and return the deleted post', async () => {
    const id = 1;
    const post = {
      "id": 3,
      "post_title": "Issues in games",
      "post_desc": "I wonder how you guys solve these issues!!!",
      "upvote_count": 2,
      "downvote_count": 0,
      "upvoted_userids": [
          3,
          2
      ],
      "downvoted_userids": [],
      "user_id": 2,
      "game_id": null
  };
    mockPrismaService.post.delete.mockResolvedValue(post);

    //act
    const result = await service.remove(id);

    expect(result).toEqual(post);
    expect(mockPrismaService.post.delete).toHaveBeenCalledTimes(1);
    expect(mockPrismaService.post.delete).toHaveBeenCalledWith({ where: { id }});
  });
});
