import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { Document } from './entities/document.entity';
import { DocumentStatus } from '../shared/enums/document-status.enum';
import { Express } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.gaurd';
import { User } from 'src/users/entities/user.entity';

describe('DocumentsController', () => {
  let controller: DocumentsController;
  let documentsService: DocumentsService;

  const mockDocument: Document = {
    id: '1',
    title: 'Test Document',
    filePath: '/uploads/test.pdf',
    mimeType: 'application/pdf',
    status: DocumentStatus.UPLOADED,
    owner: { id: '1', email: 'user@example.com' } as User,
    ownerId: '1',
    description: '',
    createdAt: new Date(), 
    updatedAt: new Date(), 
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [
        {
          provide: DocumentsService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockDocument),
            findAll: jest.fn().mockResolvedValue([mockDocument]),
            findOne: jest.fn().mockResolvedValue(mockDocument),
            update: jest.fn().mockResolvedValue(mockDocument),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<DocumentsController>(DocumentsController);
    documentsService = module.get<DocumentsService>(DocumentsService);
  });

  describe('create', () => {
    it('should create document with file', async () => {
      const mockFile = {
        path: '/uploads/test.pdf',
        mimetype: 'application/pdf',
      } as Express.Multer.File;

      const result = await controller.create(
        mockFile,
        { title: 'Test Document' },
        { user: { id: '1' } } as any,
      );

      expect(result).toEqual(mockDocument);
      expect(documentsService.create).toHaveBeenCalledWith(
        {
          title: 'Test Document',
          filePath: '/uploads/test.pdf',
          mimeType: 'application/pdf',
        },
        { id: '1' },
      );
    });
  });

  describe('findAll', () => {
    it('should return documents for current user', async () => {
      expect(await controller.findAll({ user: { id: '1' } } as any)).toEqual([mockDocument]);
    });
  });
});