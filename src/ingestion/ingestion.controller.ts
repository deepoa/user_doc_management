import {
    Controller,
    Get,
    Param,
    Post,
    Req,
    UseGuards,
  } from '@nestjs/common';
  import { IngestionService } from './ingestion.service';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Roles } from '../auth/decorators/roles.decorator';
  import { UserRole } from '../shared/enums/user-role.enum';
  import { Request } from 'express';
  import { User } from '../users/entities/user.entity';
  
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