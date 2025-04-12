import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';
import { Document } from '../src/documents/entities/document.entity';
import { UserRole } from '../src/shared/enums/user-role.enum';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let adminToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User, Document],
          synchronize: true,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Create test admin user
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'admin@example.com',
        password: 'admin123',
        name: 'Admin',
      });

    // Login to get tokens
    const authResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'admin123',
      });

    adminToken = authResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    it('should register new user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'test123',
          name: 'Test User',
        })
        .expect(201);
    });

    it('should login with valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'test123',
        })
        .expect(200);

      expect(response.body).toHaveProperty('access_token');
      authToken = response.body.access_token;
    });
  });

  describe('Users', () => {
    it('should get all users (admin only)', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect(res => {
          expect(Array.isArray(res.body)).toBeTruthy();
        });
    });
  });

  describe('Documents', () => {
    it('should upload document', async () => {
      return request(app.getHttpServer())
        .post('/documents')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', Buffer.from('test'), 'test.pdf')
        .field('title', 'Test Document')
        .expect(201);
    });
  });
});