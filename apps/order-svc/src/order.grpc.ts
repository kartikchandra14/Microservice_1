import { Controller, Inject, OnModuleInit, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GrpcMethod, Client, ClientKafka, ClientGrpc, Transport } from
'@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { Order } from './order.schema';
import { assertServiceAuth, buildServiceMetadata, callWithAuth } from '@app/common';
import { join } from 'path';
import { response, Response } from 'express';

interface UserServiceClient { 
    GetUser(data: { id: string }, md?: any): any; 
}

interface ProductServiceClient {
    GetProduct(data: { id: string }, md?: any): any;
    ReserveStock(data: { productId: string; qty: number }, md?: any): any;
}

@Controller()
export class OrderGrpcController implements OnModuleInit {

    constructor(
        @InjectModel(Order.name) private model: Model<Order>,
        @Inject('USER_CLIENT') private userClient: ClientGrpc,
        @Inject('PRODUCT_CLIENT') private productClient: ClientGrpc,
        @Inject('KAFKA_PRODUCER') private kafka: ClientKafka,
    ){
        this.users = this.userClient.getService<UserServiceClient>('UserService');
        this.products = this.productClient.getService<ProductServiceClient>('ProductService');
        // console.log("OrderGrpcController constructor called_0", this.kafka);
        // this.kafka.connect();
        // console.log("OrderGrpcController constructor called_1", this.users, this.userClient, this.kafka);
    }
    
    // @Client({ 
    //     transport: Transport.GRPC, 
    //     options: { 
    //         url: process.env.USER_SVC_URL, 
    //         package: 'user', 
    //         protoPath: join(process.cwd(),'libs/proto/src/user.proto') 
    //     } 
    // }) private userClient: ClientGrpc;

    // @Client({ 
    //     transport: Transport.GRPC, 
    //     options: { 
    //         url: process.env.PRODUCT_SVC_URL, 
    //         package: 'product', 
    //         protoPath: join(process.cwd(),'libs/proto/src/product.proto') 
    //     } 
    // }) private productClient: ClientGrpc;

    // @Client({ 
    //     transport: Transport.KAFKA, 
    //     options: { 
    //         client: { 
    //             brokers: [process.env.KAFKA_BROKER!] 
    //         }, 
    //         producerOnlyMode: true 
    //     } 
    // }) private kafka: ClientKafka;

    private users!: UserServiceClient;

    private products!: ProductServiceClient;

    onModuleInit() {
        console.log("Order_Service_onModuleInit_0_", );
        this.users = this.userClient.getService<UserServiceClient>('UserService');
        this.products = this.productClient.getService<ProductServiceClient>('ProductService');
        // Kafka producer needs connect() before emit this.kafka.connect();
        console.log("Order_Service_onModuleInit_1_", this.users);
    }

    @GrpcMethod('OrderService', 'CreateOrder')
    async CreateOrder(data: { userId: string; productId: string; qty: number }, md: Metadata) {
        assertServiceAuth(md);
        const svcMd = buildServiceMetadata();
        console.log("OrderService_CreateOrder_1", this.users);
        // Validate user & product; reserve stock atomically in product-svc
        const user = await callWithAuth(this.users.GetUser({ id: data.userId }, svcMd))  as any;
        console.log("OrderService_CreateOrder_2", user);
        if (!user?.id){
            console.log("OrderService_CreateOrder_2_1", user);
            return { statusCode: 404, message: "User not found." };
        }

        const prod = await callWithAuth(this.products.GetProduct({ id: data.productId }, svcMd) )  as { id: string; price: number };
        if (!prod?.id){
            return { statusCode: 404, message: "Product not found." };
        }

        const reserve = await callWithAuth(this.products.ReserveStock({productId: data.productId, qty: data.qty }, svcMd) ) as { ok: boolean };
        console.log("OrderService_CreateOrder_3", reserve);
        if (!reserve?.ok){
            console.log("OrderService_CreateOrder_3_1",);
            return { statusCode: 200, message: "Insufficient stock." };
        }
        console.log("OrderService_CreateOrder_4",);
        const total = prod.price * data.qty;
        const created = await this.model.create({ userId: data.userId, productId: data.productId, qty: data.qty, total });
        // Emit Kafka event (fire-and-forget)
        this.kafka.emit('order.created', { 
            id: created.id, 
            userId: created.userId, 
            productId: created.productId, 
            qty: created.qty, 
            total: created.total }); // Send Notification once we get this message 
        return { id: created.id, userId: created.userId, productId: created.productId, qty: created.qty, total: created.total };
    }


    @GrpcMethod('OrderService', 'GetOrder')
    async GetOrder(data: { id: string }, md: Metadata) {
        assertServiceAuth(md);
        const doc = await this.model.findById(data.id).lean();
        if (!doc) return { id: '', userId: '', productId: '', qty: 0, total: 0 };
        return { id: doc._id.toString(), userId: doc.userId, productId:
        doc.productId, qty: doc.qty, total: doc.total };
    }


}