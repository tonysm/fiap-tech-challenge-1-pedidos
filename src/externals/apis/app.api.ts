import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppAPI {

  @Get()
  getHello(): string {
    return 'Hello World';
  }
}
