import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUsersHandler } from '../handlers/get-users.handler';
import { AddUserHandler } from '../handlers/add-user.handler';
import { AddUserDTO } from '../dtos/add-user.dto';
import { AdminAuthGuard } from '../guards/admin.guard';
import { AuthGuard } from '../guards/auth.guard';
import { GetUserHandler } from '../handlers/get-user.handler';

@Controller('users')
export class UserController {
  constructor(
    private addUserHandler: AddUserHandler,
    private getUsersHandler: GetUsersHandler,
    private getSingleUserHandler: GetUserHandler,
  ) {}

  @Get('/')
  @ApiTags('Users')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  getUsers(@Query() query) {
    return this.getUsersHandler.handle(query);
  }

  @Post('/')
  @ApiTags('Users')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  addUserAccount(@Body() dto: AddUserDTO) {
    return this.addUserHandler.handle(dto);
  }

  @Get('/:id')
  @ApiTags('Users')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  getUserDetails(@Param('id') id: string) {
    return this.getSingleUserHandler.handle(id);
  }

  @Get('/me')
  @ApiTags('Users')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  getAuthUserInfo() {
    // handler goes here
  }
}
