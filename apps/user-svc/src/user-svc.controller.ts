import { Controller, Get } from '@nestjs/common';
import { UserSvcService } from './user-svc.service';

@Controller()
export class UserSvcController {
  constructor(private readonly userSvcService: UserSvcService) {}

  @Get()
  getHello(): string {
    return this.userSvcService.getHello();
  }
}
