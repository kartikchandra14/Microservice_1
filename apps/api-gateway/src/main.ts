// import { NestFactory } from '@nestjs/core';
// import { ApiGatewayModule } from './api-gateway.module';

// async function bootstrap() {
//   const app = await NestFactory.create(ApiGatewayModule);
//   await app.listen(process.env.port ?? 3000);
// }
// bootstrap();


import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {

    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    await app.listen(3000);

}

bootstrap();