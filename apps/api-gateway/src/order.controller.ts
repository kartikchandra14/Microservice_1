import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { buildServiceMetadata, callWithAuth } from '@app/common';
import { CreateOrderDto } from './dto';
import { Response } from 'express';

export interface OrderSuccess {
  id: string;
  userId: string;
  productId: string;
  qty: number;
  total: number;
}

export interface OrderError {
  statusCode: number;
  message: string;
}

export type OrderResult = OrderSuccess | OrderError;


interface OrderServiceClient { 
    CreateOrder(data: { userId: string; productId: string; qty: number }, md?: any): any; 
    GetOrder(data: { id:string }, md?: any): any; 
}

@Controller('orders')
export class OrderController {
@Client({ 
    transport: Transport.GRPC, 
    options: { 
        url:process.env.ORDER_SVC_URL, 
        package: 'order', 
        protoPath: join(process.cwd(), 'libs/proto/src/order.proto') 
    } 
}) 
private client: ClientGrpc;
private svc: OrderServiceClient;

onModuleInit() { 
    this.svc = this.client.getService<OrderServiceClient>('OrderService'); 
}


@Post()
async create(@Body() body: CreateOrderDto, @Res() res: Response) {
    const md = buildServiceMetadata();
    const result: OrderResult  = await callWithAuth(this.svc.CreateOrder(body, md));
    console.log("OrderController_create_1", result)
    if ("statusCode" in result) {
        return res.status(result.statusCode).json(result);
    }
   return res.status(201).json(result);
}

@Get(':id')
async get(@Param('id') id: string) {
    const md = buildServiceMetadata();
    return callWithAuth(this.svc.GetOrder({ id }, md));
}

}