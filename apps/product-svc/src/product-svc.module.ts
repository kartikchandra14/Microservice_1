import { Module } from '@nestjs/common';
import { ProductSvcController } from './product-svc.controller';
import { ProductSvcService } from './product-svc.service';

@Module({
  imports: [],
  controllers: [ProductSvcController],
  providers: [ProductSvcService],
})
export class ProductSvcModule {}
