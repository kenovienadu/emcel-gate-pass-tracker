import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/login')
  loginUser() {
    // handler goes here
  }

  @Post('/users')
  addUserAccount() {
    // handler goes here
  }

  @Get('/users')
  getUsers() {
    // handler goes here
  }

  @Get('/users/:id')
  getUserDetail() {
    // handler goes here
  }

  @Get('/passes/generate')
  generateGatePass() {
    // handler goes here
  }

  @Get('/passes/verify/:passCode')
  verifyGatePass() {
    // handler goes here
  }
}
