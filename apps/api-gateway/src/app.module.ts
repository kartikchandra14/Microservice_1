import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { GlobalConfigModule, ApiKeyGuard } from '@app/common';
import { APP_GUARD } from '@nestjs/core';
import { UserController } from './user.controller';
import { ProductController } from './product.controller';
import { OrderController } from './order.controller';


@Module({
imports: [
GlobalConfigModule,
ClientsModule.register([
    {
    name: 'USER_CLIENT',
    transport: Transport.GRPC,
    options: {
            url: process.env.USER_SVC_URL,
            package: 'user',
            protoPath: join(process.cwd(), 'libs/proto/src/user.proto'),
        },
    },
    {
    name: 'PRODUCT_CLIENT',
    transport: Transport.GRPC,
    options: {
            url: process.env.PRODUCT_SVC_URL,
            package: 'product',
            protoPath: join(process.cwd(), 'libs/proto/src/product.proto'),
        },
    },
    {
    name: 'ORDER_CLIENT',
    transport: Transport.GRPC,
    options: {
            url: process.env.ORDER_SVC_URL,
            package: 'order',
            protoPath: join(process.cwd(), 'libs/proto/src/order.proto'),
        },
    },
]),
],
controllers: [UserController, ProductController, OrderController],
providers: [{ provide: APP_GUARD, useClass: ApiKeyGuard }],
})
export class AppModule {}