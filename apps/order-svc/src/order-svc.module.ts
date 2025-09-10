import { Module } from '@nestjs/common';
import { OrderSvcController } from './order-svc.controller';
import { OrderSvcService } from './order-svc.service';

@Module({
  imports: [],
  controllers: [OrderSvcController],
  providers: [OrderSvcService],
})
export class OrderSvcModule {}
