import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { Document } from './entities/document.entity';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptions } from './config/multer.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document]),
    MulterModule.register(multerOptions),
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}