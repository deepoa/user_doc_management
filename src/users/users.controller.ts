import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
  } from '@nestjs/common';
  import { UsersService } from './users.service';
  import { User } from './entities/user.entity';
  import { UpdateUserDto } from './dto/update-user.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Roles } from '../auth/decorators/roles.decorator';
  import { UserRole } from '../shared/enums/user-role.enum';
  import { UpdateUserRoleDto } from './dto/update-user-role.dto';
  
  @Controller('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}
  
    @Get()
    @Roles(UserRole.ADMIN)
    findAll(): Promise<User[]> {
      return this.usersService.findAll();
    }
  
    @Get(':id')
    @Roles(UserRole.ADMIN)
    findOne(@Param('id') id: string): Promise<User> {
      return this.usersService.findOne(id);
    }
  
    @Patch(':id')
    @Roles(UserRole.ADMIN)
    update(
      @Param('id') id: string,
      @Body() updateUserDto: UpdateUserDto,
    ): Promise<User> {
      return this.usersService.update(id, updateUserDto);
    }
  
    @Delete(':id')
    @Roles(UserRole.ADMIN)
    remove(@Param('id') id: string): Promise<void> {
      return this.usersService.remove(id);
    }
  
    @Post(':id/role')
    @Roles(UserRole.ADMIN)
    updateRole(
      @Param('id') id: string,
      @Body() updateUserRoleDto: UpdateUserRoleDto,
    ): Promise<User> {
      return this.usersService.updateRole(id, updateUserRoleDto.role);
    }
  }