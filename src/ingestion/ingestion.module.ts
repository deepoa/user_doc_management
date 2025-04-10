import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';
import { Document } from '../documents/entities/document.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Document]), ConfigModule],
  controllers: [IngestionController],
  providers: [IngestionService],
})
export class IngestionModule {}