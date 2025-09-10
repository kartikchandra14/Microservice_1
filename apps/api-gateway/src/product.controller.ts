import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { buildServiceMetadata, callWithAuth } from '@app/common';
import { CreateProductDto } from './dto';

interface ProductServiceClient {
    CreateProduct(data: { name: string; price: number; stock: number }, md?:any): any;
    GetProduct(data: { id: string }, md?: any): any;
}

@Controller('products')
export class ProductController {
    
    @Client({
        transport: Transport.GRPC, 
        options: { 
            url: process.env.PRODUCT_SVC_URL, 
            package: 'product', 
            protoPath: join(process.cwd(), 'libs/proto/src/product.proto') 
        } 
    })
    private client: ClientGrpc;
    private svc: ProductServiceClient;

    onModuleInit() { 
        this.svc = this.client.getService<ProductServiceClient>('ProductService'); 
    }

    @Post()
    async create(@Body() body: CreateProductDto) {
        const md = buildServiceMetadata();
        return callWithAuth(this.svc.CreateProduct(body, md));
    }

    @Get(':id')
    async get(@Param('id') id: string) {
        const md = buildServiceMetadata();
        return callWithAuth(this.svc.GetProduct({ id }, md));
    }
}