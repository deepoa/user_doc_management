import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { Document } from './entities/document.entity';
  import { User } from '../users/entities/user.entity';
  import { UserRole } from '../shared/enums/user-role.enum';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
  
  @Injectable()
  export class DocumentsService {
    constructor(
      @InjectRepository(Document)
      private documentsRepository: Repository<Document>,
    ) {}
  
    async create(
      createDocumentDto: CreateDocumentDto,
      owner: User,
    ): Promise<Document> {
      const document = this.documentsRepository.create({
        ...createDocumentDto,
        owner,
      });
      return this.documentsRepository.save(document);
    }
  
    async findAll(user: User): Promise<Document[]> {
      if (user.role === UserRole.ADMIN) {
        return this.documentsRepository.find();
      }
      return this.documentsRepository.find({ where: { ownerId: user.id } });
    }
  
    async findOne(id: string, user: User): Promise<Document> {
      const document = await this.documentsRepository.findOne({ where: { id } });
      if (!document) {
        throw new NotFoundException('Document not found');
      }
  
      if (user.role !== UserRole.ADMIN && document.ownerId !== user.id) {
        throw new UnauthorizedException(
          'You are not authorized to access this document',
        );
      }
  
      return document;
    }
  
    async update(
      id: string,
      updateDocumentDto: UpdateDocumentDto,
      user: User,
    ): Promise<Document> {
      const document = await this.findOne(id, user);
      Object.assign(document, updateDocumentDto);
      return this.documentsRepository.save(document);
    }
  
    async remove(id: string, user: User): Promise<void> {
      const document = await this.findOne(id, user);
      await this.documentsRepository.remove(document);
    }
  }