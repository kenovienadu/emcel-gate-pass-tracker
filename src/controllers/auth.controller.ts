import { AdminAuthGuard } from './../guards/admin.guard';
import { ResetPasswordHandler } from './../handlers/reset-password.handler';
import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginHandler } from '../handlers/login.handler';
import { LoginDTO } from '../dtos/login.dto';
import { AuthGuard } from '../guards/auth.guard';
import { AuthUser } from '../decorators/user.decorator';
import { ChangePasswordDTO } from '../dtos/change-password.dto';
import { ChangePasswordHandler } from '../handlers/change-password.handler';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private loginHandler: LoginHandler,
    private changePasswordHandler: ChangePasswordHandler,
    private resetPasswordHandler: ResetPasswordHandler,
  ) {}

  @Post('/login')
  loginUser(@Body() dto: LoginDTO) {
    return this.loginHandler.handle(dto);
  }

  @Post('/change-password')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  changePassword(
    @Body() dto: ChangePasswordDTO,
    @AuthUser() user: Partial<User>,
  ) {
    return this.changePasswordHandler.handle(user.id, dto);
  }

  @Post('/reset-password/:userIdOrEmail')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  resetUserPassword(@Param('userIdOrEmail') userIdOrEmail: string) {
    return this.resetPasswordHandler.handle(userIdOrEmail);
  }
}
