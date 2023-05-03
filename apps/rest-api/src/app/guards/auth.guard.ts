import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly configService: ConfigService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const secret = this.configService.get('JWT_SECRET');
            const payload = await verify(token, secret);

            request['user'] = payload;
        } catch (error) {
            throw new UnauthorizedException();
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        if (!request.headers['authorization']) {
            return undefined;
        }

        const [type, token] = request.headers['authorization'].split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}