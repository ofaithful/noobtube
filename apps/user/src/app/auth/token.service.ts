import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@streams/db';
import { sign } from 'jsonwebtoken';

@Injectable()
export class TokenService {
    constructor(private readonly configService: ConfigService) {}

    async signToken(user: User): Promise<string> {
        const secret = this.configService.get('JWT_SECRET');
        const expiresIn = this.configService.get('JWT_EXPIRES') + 'd';

        return sign(user, secret, { expiresIn });
    }
}