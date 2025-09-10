import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GlobalConfigModule } from '@app/common';
import { User, UserSchema } from './user.schema';
import { UserGrpcController } from './user.grpc';
import { ConfigModule } from '@nestjs/config';
@Module({
imports: [
    GlobalConfigModule,
    // MongooseModule.forRoot(process.env.MONGO_URL),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URL || 'mongodb://localhost:27017/shop'),

],
controllers: [UserGrpcController],
})
export class AppModule {}