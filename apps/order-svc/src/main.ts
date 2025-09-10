// import { NestFactory } from '@nestjs/core';
// import { OrderSvcModule } from './order-svc.module';

// async function bootstrap() {
//   const app = await NestFactory.create(OrderSvcModule);
//   await app.listen(process.env.port ?? 3000);
// }
// bootstrap();



import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.GRPC,
        options: { 
            url: process.env.ORDER_SVC_URL, 
            package: 'order', 
            protoPath: join(process.cwd(), 'libs/proto/src/order.proto') 
        },
    });
    
    await app.startAllMicroservices();
}

bootstrap();