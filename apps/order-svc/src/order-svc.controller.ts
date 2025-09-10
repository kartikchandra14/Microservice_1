import { Controller, Get } from '@nestjs/common';
import { OrderSvcService } from './order-svc.service';

@Controller()
export class OrderSvcController {
  constructor(private readonly orderSvcService: OrderSvcService) {}

  @Get()
  getHello(): string {
    return this.orderSvcService.getHello();
  }
}
