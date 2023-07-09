import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { VerifyGatePassHandler } from './handlers/verify-gatepass.handler';
import { GeneratePassHandler } from './handlers/generate-pass.handler';
import { GetUsersHandler } from './handlers/get-users.handler';
import { AddUserHandler } from './handlers/add-user.handler';
import { AddUserDTO } from './dtos/add-user.dto';
import { LoginHandler } from './handlers/login.handler';
import { LoginDTO } from './dtos/login.dto';
import { AdminAuthGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';
import { GeneratePassDTO } from './dtos/generate-pass.dto';
import { AuthUser } from './decorators/user.decorator';
import { ChangePasswordDTO } from './dtos/change-password.dto';
import { ChangePasswordHandler } from './handlers/change-password.handler';
import { SecurityPersonnelGuard } from './guards/security.guard';

@Controller()
export class AppController {
  constructor(
    private addUserHandler: AddUserHandler,
    private loginHandler: LoginHandler,
    private getUsersHandler: GetUsersHandler,
    private generateGatePassHandler: GeneratePassHandler,
    private changePasswordHandler: ChangePasswordHandler,
    private verifyGatePassHandler: VerifyGatePassHandler,
  ) {}

  @Post('/auth/login')
  @ApiTags('Auth')
  loginUser(@Body() dto: LoginDTO) {
    return this.loginHandler.handle(dto);
  }

  @Post('/auth/change-password')
  @ApiTags('Auth')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  changePassword(
    @Body() dto: ChangePasswordDTO,
    @AuthUser() user: Partial<User>,
  ) {
    return this.changePasswordHandler.handle(user.id, dto);
  }

  @Post('/users')
  @ApiTags('Users')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  addUserAccount(@Body() dto: AddUserDTO) {
    return this.addUserHandler.handle(dto);
  }

  @Get('/users')
  @ApiTags('Users')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  getUsers(@Query() query) {
    return this.getUsersHandler.handle(query);
  }

  @Get('/users/me')
  @ApiTags('Users')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  getAuthUserInfo() {
    // handler goes here
  }

  @Get('/users/:id')
  @ApiTags('Users')
  @UseGuards(AdminAuthGuard)
  getUserDetail() {
    // handler goes here
  }

  @Post('/passes/generate')
  @ApiTags('Gatepass')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  generateGatePass(
    @Body() dto: GeneratePassDTO,
    @AuthUser() user: Partial<User>,
  ) {
    return this.generateGatePassHandler.handle(user.id, dto?.allowMultipleUses);
  }

  @Get('/passes/verify/:passCode')
  @ApiTags('Gatepass')
  @UseGuards(SecurityPersonnelGuard)
  @ApiBearerAuth()
  verifyGatePass(@Param('passCode') passCode: string) {
    return this.verifyGatePassHandler.handle(passCode);
  }
}
