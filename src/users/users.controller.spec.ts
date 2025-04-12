import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UserRole } from '../shared/enums/user-role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.gaurd';
import { RolesGuard } from 'src/auth/guards/roles.gaurd';


describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUser: User = {
    id: '1',
    email: 'admin@example.com',
    password: 'hashed',
    role: UserRole.ADMIN,
    name: 'Admin',
    emailToLowerCase: function (): void {
      throw new Error('Function not implemented.');
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockUser]),
            findOne: jest.fn().mockResolvedValue(mockUser),
            update: jest.fn().mockResolvedValue(mockUser),
            remove: jest.fn().mockResolvedValue(undefined),
            updateRole: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('findAll', () => {
    it('should return array of users', async () => {
      expect(await controller.findAll()).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should return single user', async () => {
      expect(await controller.findOne('1')).toEqual(mockUser);
      expect(usersService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('updateRole', () => {
    it('should update user role', async () => {
      expect(await controller.updateRole('1', { role: UserRole.ADMIN })).toEqual(mockUser);
      expect(usersService.updateRole).toHaveBeenCalledWith('1', UserRole.ADMIN);
    });
  });
});