import { Test, TestingModule } from '@nestjs/testing';
import { ProductSvcController } from './product-svc.controller';
import { ProductSvcService } from './product-svc.service';

describe('ProductSvcController', () => {
  let productSvcController: ProductSvcController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProductSvcController],
      providers: [ProductSvcService],
    }).compile();

    productSvcController = app.get<ProductSvcController>(ProductSvcController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(productSvcController.getHello()).toBe('Hello World!');
    });
  });
});
