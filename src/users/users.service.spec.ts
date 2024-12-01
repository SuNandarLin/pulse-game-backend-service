import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockPrismaService = {
    user: {
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
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create => Should create a new user and return its data', async () => {
    // arrange
    const createUserDto = {
      "auth_id": "Y0dl8gt0hQcKJ5rf17XWec6eqLi2",
      "username": "gamer_snl",
      "first_name": "Su Nandar",
      "last_name": "Linn",
      "email": "hsunandar.linn98@gmail.com",
      "phone_number": "+65123243543",
      "address": "Bedok Chai Chee Street",
      "postal_code": "001122",
      "unit_number": "#01-01",
      "accept_marketing": false
    } as CreateUserDto;

    const user = {
      id: 1,
      ...createUserDto,
      profile_url: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // jest.spyOn(mockUserRepository, 'save').mockReturnValue(user);
    mockPrismaService.user.create.mockResolvedValue(user);

    // act
    const result = await service.create(createUserDto);

    // assert
    expect(mockPrismaService.user.create).toHaveBeenCalledTimes(1);
    expect(mockPrismaService.user.create).toHaveBeenCalledWith({data: createUserDto});
    expect(result).toEqual(user);
  });

  it('findAll => Should return all users', async () => {
    const user = {
      id: 1,
      "auth_id": "Y0dl8gt0hQcKJ5rf17XWec6eqLi2",
      "username": "gamer_snl",
      "first_name": "Su Nandar",
      "last_name": "Linn",
      "email": "hsunandar.linn98@gmail.com",
      "phone_number": "+65123243543",
      "address": "Bedok Chai Chee Street",
      "postal_code": "001122",
      "unit_number": "#01-01",
      "accept_marketing": false,
      profile_url: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const users = [user];
    mockPrismaService.user.findMany.mockResolvedValue(users);

    //act
    const result = await service.findAll();

    expect(result).toEqual(users);
    expect(mockPrismaService.user.findMany).toHaveBeenCalledTimes(1);
  });

  it('findOne => Should return user, get by id', async () => {
    const id = 1;
    const user = {
      id: 1,
      "auth_id": "Y0dl8gt0hQcKJ5rf17XWec6eqLi2",
      "username": "gamer_snl",
      "first_name": "Su Nandar",
      "last_name": "Linn",
      "email": "hsunandar.linn98@gmail.com",
      "phone_number": "+65123243543",
      "address": "Bedok Chai Chee Street",
      "postal_code": "001122",
      "unit_number": "#01-01",
      "accept_marketing": false,
      profile_url: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockPrismaService.user.findUnique.mockResolvedValue(user);

    //act
    const result = await service.findOne(id);

    expect(result).toEqual(user);
    expect(mockPrismaService.user.findUnique).toHaveBeenCalledTimes(1);
    expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({ where: { id }});
  });

  it('findbyFirebaseUserId => Should return user, get by firebaseuserid', async () => {
    const firebaseUserId = '12345';
    const user = {
      id: 1,
      "auth_id": "Y0dl8gt0hQcKJ5rf17XWec6eqLi2",
      "username": "gamer_snl",
      "first_name": "Su Nandar",
      "last_name": "Linn",
      "email": "hsunandar.linn98@gmail.com",
      "phone_number": "+65123243543",
      "address": "Bedok Chai Chee Street",
      "postal_code": "001122",
      "unit_number": "#01-01",
      "accept_marketing": false,
      profile_url: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const users = [user];
    mockPrismaService.user.findMany.mockResolvedValue(users);

    //act
    const result = await service.findbyFirebaseUserId(firebaseUserId);

    expect(mockPrismaService.user.findMany).toHaveBeenCalledTimes(1);
    expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({ where: { auth_id: firebaseUserId }});
    expect(result).toEqual(users);

  });

  it('update => Should return updated user', async () => {
    const id = 1;
    const userToUpdate = {
      id: 1,
      "auth_id": "Y0dl8gt0hQcKJ5rf17XWec6eqLi2",
      "username": "gamer_snl_1234",
      "first_name": "Su Nandar",
      "last_name": "Linn",
      "email": "hsunandar.linn98@gmail.com",
      "phone_number": "+65123243543",
      "address": "Bedok Chai Chee Street",
      "postal_code": "001122",
      "unit_number": "#01-01",
      "accept_marketing": false,
      profile_url: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const user = {
      id: 1,
      "auth_id": "Y0dl8gt0hQcKJ5rf17XWec6eqLi2",
      "username": "gamer_snl_1234",
      "first_name": "Su Nandar",
      "last_name": "Linn",
      "email": "hsunandar.linn98@gmail.com",
      "phone_number": "+65123243543",
      "address": "Bedok Chai Chee Street",
      "postal_code": "001122",
      "unit_number": "#01-01",
      "accept_marketing": false,
      profile_url: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockPrismaService.user.update.mockResolvedValue(user);

    //act
    const result = await service.update(id,userToUpdate);

    expect(result).toEqual(user);
    expect(mockPrismaService.user.update).toHaveBeenCalledTimes(1);
    expect(mockPrismaService.user.update).toHaveBeenCalledWith({ where: { id }, data: userToUpdate});
  });

  it('remove => Should delete the user by id and return the deleted user', async () => {
    const id = 1;
    const user = {
      id: 1,
      "auth_id": "Y0dl8gt0hQcKJ5rf17XWec6eqLi2",
      "username": "gamer_snl",
      "first_name": "Su Nandar",
      "last_name": "Linn",
      "email": "hsunandar.linn98@gmail.com",
      "phone_number": "+65123243543",
      "address": "Bedok Chai Chee Street",
      "postal_code": "001122",
      "unit_number": "#01-01",
      "accept_marketing": false,
      profile_url: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockPrismaService.user.delete.mockResolvedValue(user);

    //act
    const result = await service.remove(id);

    expect(result).toEqual(user);
    expect(mockPrismaService.user.delete).toHaveBeenCalledTimes(1);
    expect(mockPrismaService.user.delete).toHaveBeenCalledWith({ where: { id }});
  });
});

