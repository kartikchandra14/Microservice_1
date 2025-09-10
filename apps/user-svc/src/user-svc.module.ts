import { Module } from '@nestjs/common';
import { UserSvcController } from './user-svc.controller';
import { UserSvcService } from './user-svc.service';

@Module({
  imports: [],
  controllers: [UserSvcController],
  providers: [UserSvcService],
})
export class UserSvcModule {}
