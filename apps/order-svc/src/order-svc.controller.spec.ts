import { Test, TestingModule } from '@nestjs/testing';
import { OrderSvcController } from './order-svc.controller';
import { OrderSvcService } from './order-svc.service';

describe('OrderSvcController', () => {
  let orderSvcController: OrderSvcController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OrderSvcController],
      providers: [OrderSvcService],
    }).compile();

    orderSvcController = app.get<OrderSvcController>(OrderSvcController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(orderSvcController.getHello()).toBe('Hello World!');
    });
  });
});
