import {
    Controller,
    Get,
    Param,
    Post,
    Req,
    UseGuards,
  } from '@nestjs/common';
  import { IngestionService } from './ingestion.service';
  import { UserRole } from '../shared/enums/user-role.enum';
  import { Request } from 'express';
  import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.gaurd';
import { RolesGuard } from 'src/auth/guards/roles.gaurd';
import { Roles } from 'src/auth/decorators/roles.decorator';
  
  @Controller('ingestion')
  @UseGuards(JwtAuthGuard, RolesGuard)
  export class IngestionController {
    constructor(private readonly ingestionService: IngestionService) {}
  
    @Post(':documentId/trigger')
    @Roles(UserRole.ADMIN, UserRole.EDITOR)
    async triggerIngestion(
      @Param('documentId') documentId: string,
      @Req() req: Request,
    ) {
      const user = req.user as User;
      return this.ingestionService.triggerIngestion(documentId);
    }
  
    @Get(':documentId/status')
    @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER)
    async getIngestionStatus(
      @Param('documentId') documentId: string,
      @Req() req: Request,
    ) {
      const user = req.user as User;
      return this.ingestionService.getIngestionStatus(documentId);
    }
  }