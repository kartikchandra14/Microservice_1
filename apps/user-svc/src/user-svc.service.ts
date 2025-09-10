import { Injectable } from '@nestjs/common';

@Injectable()
export class UserSvcService {
  getHello(): string {
    return 'Hello World!';
  }
}
