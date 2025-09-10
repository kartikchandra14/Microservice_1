import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GlobalConfigModule } from '@app/common';
import { Order, OrderSchema } from './order.schema';
import { OrderGrpcController } from './order.grpc';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
@Module({
imports: [
    GlobalConfigModule,
    // MongooseModule.forRoot(process.env.MONGO_URL),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    ClientsModule.register([
        { 
            name: 'USER_CLIENT', 
            transport: Transport.GRPC, options: { 
                url: process.env.USER_SVC_URL, 
                package: 'user', 
                protoPath: join(process.cwd(),'libs/proto/src/user.proto') 
            } 
        },
        { 
            name: 'PRODUCT_CLIENT', 
            transport: Transport.GRPC, 
            options: {
                 url: process.env.PRODUCT_SVC_URL, 
                 package: 'product', 
                 protoPath: join(process.cwd(),'libs/proto/src/product.proto') 
            } 
        },
        { 
            name: 'KAFKA_PRODUCER', 
            transport: Transport.KAFKA, 
            options: {
                client: { 
                    brokers: [process.env.KAFKA_BROKER!] 
                }, 
                producerOnlyMode: true 
            } 
        },
    ]),

    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URL || 'mongodb://localhost:27017/shop'),
],
controllers: [
    OrderGrpcController
],
})
export class AppModule {}