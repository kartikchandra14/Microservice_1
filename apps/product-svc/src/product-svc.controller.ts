import { Controller, Get } from '@nestjs/common';
import { ProductSvcService } from './product-svc.service';

@Controller()
export class ProductSvcController {
  constructor(private readonly productSvcService: ProductSvcService) {}

  @Get()
  getHello(): string {
    return this.productSvcService.getHello();
  }
}
