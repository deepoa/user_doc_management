import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should return user without password when credentials are valid', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: await bcrypt.hash('password', 10),
        role: 'viewer',
      } as User;

      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(mockUser);
      
      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toEqual({
        id: '1',
        email: 'test@example.com',
        role: 'viewer',
      });
    });

    it('should return null when user not found', async () => {
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(null);
      expect(await service.validateUser('nonexistent@example.com', 'password')).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token', async () => {
      const mockUser = { id: '1', email: 'test@example.com', role: 'viewer' } as User;
      const result = await service.login(mockUser);
      expect(result).toEqual({ access_token: 'mock-token' });
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: 'test@example.com',
        sub: '1',
        role: 'viewer',
      });
    });
  });

  describe('register', () => {
    it('should create user with hashed password', async () => {
      const mockUser = { id: '1', email: 'test@example.com', password: 'hashed', role: 'viewer' } as User;
      jest.spyOn(usersService, 'create').mockResolvedValue(mockUser);
      
      const result = await service.register({
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
      });
      
      expect(result).toEqual(mockUser);
      expect(usersService.create).toHaveBeenCalledWith(expect.objectContaining({
        email: 'test@example.com',
        password: expect.not.stringMatching('password'), // Should be hashed
      }));
    });
  });
});