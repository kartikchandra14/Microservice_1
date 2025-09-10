import { Controller } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { User } from './user.schema';
import { assertServiceAuth } from '@app/common';
@Controller()
export class UserGrpcController {

    constructor(@InjectModel(User.name) private model: Model<User>) {}

    @GrpcMethod('UserService', 'CreateUser')
    async CreateUser(data: { email: string; name: string }, md: Metadata) {
        assertServiceAuth(md);
        const created = await this.model.create(data);
        return { id: created.id, email: created.email, name: created.name };
    }

    @GrpcMethod('UserService', 'GetUser')
    async GetUser(data: { id: string }, md: Metadata) {
        assertServiceAuth(md);
        const doc = await this.model.findById(data.id).lean();
        console.log("UserService_GetUser", doc, data.id);
        if (!doc) return { id: '', email: '', name: '' };
        return { id: doc._id.toString(), email: doc.email, name: doc.name };
    }
}