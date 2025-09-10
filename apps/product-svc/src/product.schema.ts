import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
@Schema({ timestamps: true })
export class Product {
_id: string;
@Prop({ required: true }) name: string;
@Prop({ required: true }) price: number;
@Prop({ required: true, min: 0 }) stock: number;
}
export type ProductDoc = HydratedDocument<Product>;
export const ProductSchema = SchemaFactory.createForClass(Product);