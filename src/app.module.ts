import { ConfigModule } from '@nestjs/config';
import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { prismaClient } from './database';
import { AppController } from './app.controller';
import { AddUserHandler } from './handlers/add-user.handler';
import { LoginHandler } from './handlers/login.handler';
import { GetUsersHandler } from './handlers/get-users.handler';
import { GeneratePassHandler } from './handlers/generate-pass.handler';
import { ChangePasswordHandler } from './handlers/change-password.handler';
import { VerifyGatePassHandler } from './handlers/verify-gatepass.handler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AddUserHandler,
    LoginHandler,
    GetUsersHandler,
    GeneratePassHandler,
    ChangePasswordHandler,
    VerifyGatePassHandler,
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
