// import { NestFactory } from '@nestjs/core';
// import { ProductSvcModule } from './product-svc.module';

// async function bootstrap() {
//   const app = await NestFactory.create(ProductSvcModule);
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
            url: process.env.PRODUCT_SVC_URL, 
            package: 'product',
            protoPath: join(process.cwd(), 'libs/proto/src/product.proto') 
        },
    });
    // Kafka consumer (logs order events)
    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.KAFKA,
        options: { 
            client: { 
                brokers: [process.env.KAFKA_BROKER!] 
            }, 
            consumer: {
            groupId: 'product-svc' } 
        },
    });
    await app.startAllMicroservices();
}
bootstrap();