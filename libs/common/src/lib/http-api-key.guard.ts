import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';


@Injectable()
export class ApiKeyGuard implements CanActivate {
canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const key = req.header('x-api-key');
    console.log("canActivate_1", key, process.env.API_GATEWAY_KEY);
    if (!key || key !== process.env.API_GATEWAY_KEY) throw new UnauthorizedException('Invalid API key');
    return true;
}
}