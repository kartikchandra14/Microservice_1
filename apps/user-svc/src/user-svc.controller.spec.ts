import { Test, TestingModule } from '@nestjs/testing';
import { UserSvcController } from './user-svc.controller';
import { UserSvcService } from './user-svc.service';

describe('UserSvcController', () => {
  let userSvcController: UserSvcController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserSvcController],
      providers: [UserSvcService],
    }).compile();

    userSvcController = app.get<UserSvcController>(UserSvcController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(userSvcController.getHello()).toBe('Hello World!');
    });
  });
});
