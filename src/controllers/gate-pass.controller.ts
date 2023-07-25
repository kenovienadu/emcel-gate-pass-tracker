import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { VerifyGatePassHandler } from '../handlers/verify-gatepass.handler';
import { GeneratePassHandler } from '../handlers/generate-pass.handler';
import { AuthGuard } from '../guards/auth.guard';
import { GeneratePassDTO } from '../dtos/generate-pass.dto';
import { AuthUser } from '../decorators/user.decorator';
import { SecurityPersonnelGuard } from '../guards/security.guard';

@Controller('/passes')
export class GatepassController {
  constructor(
    private generateGatePassHandler: GeneratePassHandler,
    private verifyGatePassHandler: VerifyGatePassHandler,
  ) {}

  @Post('/generate')
  @ApiTags('Gatepass')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  generateGatePass(
    @Body() dto: GeneratePassDTO,
    @AuthUser() user: Partial<User>,
  ) {
    return this.generateGatePassHandler.handle(user.id, dto);
  }

  @Get('/verify/:passCode')
  @ApiTags('Gatepass')
  @UseGuards(SecurityPersonnelGuard)
  @ApiBearerAuth()
  verifyGatePass(
    @Param('passCode') passCode: string,
    @AuthUser() user: Partial<User>,
  ) {
    return this.verifyGatePassHandler.handle(passCode, user);
  }
}
