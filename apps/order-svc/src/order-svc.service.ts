import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderSvcService {
  getHello(): string {
    return 'Hello World!';
  }
}
