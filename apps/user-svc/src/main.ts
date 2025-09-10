// import { NestFactory } from '@nestjs/core';
// import { UserSvcModule } from './user-svc.module';

// async function bootstrap() {
//   const app = await NestFactory.create(UserSvcModule);
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
            url: process.env.USER_SVC_URL,
            package: 'user',
            protoPath: join(process.cwd(), 'libs/proto/src/user.proto'),
        },
    });

    await app.startAllMicroservices();
}
bootstrap();