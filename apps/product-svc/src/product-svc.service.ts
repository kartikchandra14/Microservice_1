import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductSvcService {
  getHello(): string {
    return 'Hello World!';
  }
}
