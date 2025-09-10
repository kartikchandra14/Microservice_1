import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GlobalConfigModule } from '@app/common';
import { Product, ProductSchema } from './product.schema';
import { ProductGrpcController } from './product.grpc';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { ConfigModule } from '@nestjs/config';
@Module({
imports: [
    GlobalConfigModule,
    // MongooseModule.forRoot(process.env.MONGO_URL),
    MongooseModule.forFeature([{ name: Product.name, schema:
    ProductSchema }]),
    CacheModule.registerAsync({
        isGlobal: true,
        useFactory: async () => ({ 
            store: await redisStore(
                { 
                    url: process.env.REDIS_URL 
                }
            ), ttl: 30 
        }),
    }),

    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URL || 'mongodb://localhost:27017/shop'),
],
controllers: [ProductGrpcController],
})
export class AppModule {}