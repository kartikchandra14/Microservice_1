import { IsEmail, IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, Min } from 'class-validator';


export class CreateUserDto { @IsEmail() email: string; @IsString() @IsNotEmpty() name: string; }
export class CreateProductDto { @IsString() name: string; @IsNumber() @IsPositive() price: number; @IsInt() @Min(0) stock: number; }
export class CreateOrderDto { @IsString() userId: string; @IsString() productId: string; @IsInt() @Min(1) qty: number; }