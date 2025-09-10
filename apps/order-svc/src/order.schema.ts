import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


@Schema({ timestamps: true })

export class Order {
    _id: string;
    @Prop({ required: true }) userId: string;
    @Prop({ required: true }) productId: string;
    @Prop({ required: true, min: 1 }) qty: number;
    @Prop({ required: true, min: 0 }) total: number;
}

export type OrderDoc = HydratedDocument<Order>;

export const OrderSchema = SchemaFactory.createForClass(Order);