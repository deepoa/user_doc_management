import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../documents/entities/document.entity';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { IngestionStatus } from '../shared/enums/ingestion-status.enum';
import { DocumentStatus } from 'src/shared/enums/document-status.enum';
import { toIngestionStatus } from 'src/shared/enums/status.mapper';

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);
  private pythonClient;

  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
    private configService: ConfigService,
  ) {
    this.pythonClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: this.configService.get<string>('PYTHON_BACKEND_HOST', 'localhost'),
        port: this.configService.get<number>('PYTHON_BACKEND_PORT', 3001),
      },
    });
  }

  async triggerIngestion(documentId: string): Promise<any> {
    const document = await this.documentsRepository.findOne({
      where: { id: documentId },
    });
  
    if (!document) {
      throw new Error('Document not found');
    }
  
    try {
      document.status = DocumentStatus.PROCESSING;
      await this.documentsRepository.save(document);
  
      const result = await this.pythonClient
        .send('ingest_document', { 
          documentId: document.id, 
          filePath: document.filePath 
        })
        .toPromise();
  
      document.status = DocumentStatus.COMPLETED;
      await this.documentsRepository.save(document);
  
      return result;
    } catch (error) {
      this.logger.error('Ingestion failed', error.stack);
      document.status = DocumentStatus.FAILED;
      await this.documentsRepository.save(document);
      throw error;
    }
  }

  async getIngestionStatus(documentId: string): Promise<IngestionStatus> {
    const document = await this.documentsRepository.findOne({
      where: { id: documentId },
    });
    if (!document) {
      throw new Error('Document not found');
    }
    return toIngestionStatus(document.status);
  }
}