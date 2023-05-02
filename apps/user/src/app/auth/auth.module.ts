import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';

@Module({
    controllers: [AuthController],
    providers: [PasswordService, TokenService],
    exports: [PasswordService, TokenService]
})
export class AuthModule {}