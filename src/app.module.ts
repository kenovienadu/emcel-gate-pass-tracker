import { GatepassController } from './controllers/gate-pass.controller';
import { UserController } from './controllers/user.controller';
import { ConfigModule } from '@nestjs/config';
import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { prismaClient } from './others/database';
import { AuthController } from './controllers/auth.controller';
import { AddUserHandler } from './handlers/add-user.handler';
import { LoginHandler } from './handlers/login.handler';
import { GetUsersHandler } from './handlers/get-users.handler';
import { GeneratePassHandler } from './handlers/generate-pass.handler';
import { ChangePasswordHandler } from './handlers/change-password.handler';
import { VerifyGatePassHandler } from './handlers/verify-gatepass.handler';
import { ResetPasswordHandler } from './handlers/reset-password.handler';
import { GetUserHandler } from './handlers/get-user.handler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
  ],
  controllers: [AuthController, UserController, GatepassController],
  providers: [
    AddUserHandler,
    LoginHandler,
    GetUsersHandler,
    GeneratePassHandler,
    ChangePasswordHandler,
    VerifyGatePassHandler,
    ResetPasswordHandler,
    GetUserHandler,
  ],
})
export class AppModule implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await prismaClient.$connect();
  }

  async onModuleDestroy() {
    await prismaClient.$disconnect();
  }
}
