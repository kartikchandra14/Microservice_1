import { Controller, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GrpcMethod, EventPattern, Payload } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { Product } from './product.schema';
import { assertServiceAuth } from '@app/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
@Controller()
export class ProductGrpcController {
constructor(@InjectModel(Product.name) private model: Model<Product>,
@Inject(CACHE_MANAGER) private cache: Cache) {}
@GrpcMethod('ProductService', 'CreateProduct')
async CreateProduct(data: { name: string; price: number; stock: number },
md: Metadata) {
assertServiceAuth(md);
const created = await this.model.create(data);
await this.cache.set(`prod:${created.id}`, { id: created.id, name:
created.name, price: created.price, stock: created.stock });
return { id: created.id, name: created.name, price: created.price,
stock: created.stock };
}
@GrpcMethod('ProductService', 'GetProduct')
async GetProduct(data: { id: string }, md: Metadata) {
    assertServiceAuth(md);
const cached = await this.cache.get<any>(`prod:${data.id}`);
if (cached) return cached;
const doc = await this.model.findById(data.id).lean();
if (!doc) return { id: '', name: '', price: 0, stock: 0 };
const prod = { id: doc._id.toString(), name: doc.name, price: doc.price,
stock: doc.stock };
await this.cache.set(`prod:${doc._id}`, prod);
return prod;
}
@GrpcMethod('ProductService', 'ReserveStock')
async ReserveStock(data: { productId: string; qty: number }, md: Metadata){
    assertServiceAuth(md);
    const updated = await this.model.findOneAndUpdate(
        { _id: data.productId, stock: { $gte: data.qty } },
        { $inc: { stock: -data.qty } },
        { new: true }
    ).lean();
    const ok = !!updated;

    if (ok) await this.cache.set(`prod:${data.productId}`, { 
        id: updated!._id.toString(), 
        name: updated!.name, 
        price: updated!.price, 
        stock: updated!.stock 
    });
    console.log("ProductService_ReserveStock", { ok } );
    return { ok };
}

// Kafka consumer 
@EventPattern('order.created')
async onOrderCreated(@Payload() message: any) {
    // message.value has order payload
    // You could sync projections, etc.
    // Keeping it simple: just log
    console.log('product-svc received order.created', message?.value);
}
}