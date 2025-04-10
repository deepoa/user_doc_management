import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors,
  } from '@nestjs/common';
  import { DocumentsService } from './documents.service';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { Document } from './entities/document.entity';
  import { Request } from 'express';
  import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.gaurd';
import { multerOptions } from './config/multer.config';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
  
  @Controller('documents')
  @UseGuards(JwtAuthGuard)
  export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) {}
  
    @Post()
    @UseInterceptors(FileInterceptor('file', multerOptions))
    async create(
      @UploadedFile() file: Express.Multer.File,
      @Body() createDocumentDto: CreateDocumentDto,
      @Req() req: Request,
    ): Promise<Document> {
      const user = req.user as User;
      return this.documentsService.create(
        {
          ...createDocumentDto,
          filePath: file.path,
          mimeType: file.mimetype,
        } as CreateDocumentDto & { filePath: string; mimeType: string },
        user,
      );
    }
  
    @Get()
    async findAll(@Req() req: Request): Promise<Document[]> {
      const user = req.user as User;
      return this.documentsService.findAll(user);
    }
  
    @Get(':id')
    async findOne(
      @Param('id') id: string,
      @Req() req: Request,
    ): Promise<Document> {
      const user = req.user as User;
      return this.documentsService.findOne(id, user);
    }
  
    @Patch(':id')
    async update(
      @Param('id') id: string,
      @Body() updateDocumentDto: UpdateDocumentDto,
      @Req() req: Request,
    ): Promise<Document> {
      const user = req.user as User;
      return this.documentsService.update(id, updateDocumentDto, user);
    }
  
    @Delete(':id')
    async remove(@Param('id') id: string, @Req() req: Request): Promise<void> {
      const user = req.user as User;
      return this.documentsService.remove(id, user);
    }
  }