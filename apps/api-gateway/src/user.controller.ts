import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { buildServiceMetadata, callWithAuth } from '@app/common';
import { CreateUserDto } from './dto';

interface User {
  id: string;
  email: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
}

interface ReserveResponse {
  ok: boolean;
}


interface UserServiceClient {
    CreateUser(data: { email: string; name: string }, md?: any): any;
    GetUser(data: { id: string }, md?: any): any;
}


@Controller('users')
export class UserController {
@Client({
    transport: Transport.GRPC,
    options: { 
        url: process.env.USER_SVC_URL, 
        package: 'user', 
        protoPath: join(process.cwd(), 'libs/proto/src/user.proto') 
    }
}) 
private client: ClientGrpc;
private svc: UserServiceClient;


onModuleInit() { 
    this.svc = this.client.getService<UserServiceClient>('UserService'); 
}


@Post()
async create(@Body() body: CreateUserDto) {
    const md = buildServiceMetadata();
    return callWithAuth(this.svc.CreateUser(body, md));
}


@Get(':id')
async get(@Param('id') id: string) {
    const md = buildServiceMetadata();
    return callWithAuth(this.svc.GetUser({ id }, md));
}


}