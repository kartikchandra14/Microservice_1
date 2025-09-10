import { Metadata, status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';


export function buildServiceMetadata(): Metadata {
    const md = new Metadata();
    md.add('x-service-key', process.env.SERVICE_SHARED_KEY || '');
    return md;
}


export function assertServiceAuth(md?: Metadata) {
    const key = md?.get('x-service-key')?.[0] as string | undefined;
    console.log("assertServiceAuth_1", process.env.SERVICE_SHARED_KEY, key);
    if (!key || key !== process.env.SERVICE_SHARED_KEY) {
        throw new RpcException({ code: status.UNAUTHENTICATED, message: 'Invalid service key' });
    }
}


export async function callWithAuth<T>(obs: Observable<T>): Promise<T> {
    return firstValueFrom(obs);
}