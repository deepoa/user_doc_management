import { Test } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './jwt-payload.interface';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: ConfigService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-secret'),
          },
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('validate', () => {
    it('should return payload', async () => {
      const payload: JwtPayload = {
        sub: '1',
        email: 'test@example.com',
        role: 'viewer',
      };

      expect(await strategy.validate(payload)).toEqual({
        userId: '1',
        email: 'test@example.com',
        role: 'viewer',
      });
    });
  });
});