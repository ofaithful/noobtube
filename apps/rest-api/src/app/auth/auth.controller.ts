import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthTransportService, UserTransportService } from '@streams/transport';
import { LoginDto, LoginResultDto, RegisterDto, RegisterResultDto } from './dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly auth: AuthTransportService,
        private readonly user: UserTransportService
    ) {}


    @Post('login')
    async loginUser(@Body() data: LoginDto): Promise<LoginResultDto> {
        const result = await this.auth.login(data);

        if (result.success) {
            return result.payload;
        }

        throw new UnauthorizedException(result.error);
    }

    @Post('register')
    async register(@Body() data: RegisterDto): Promise<RegisterResultDto> {
        const result = await this.user.register(data);

        if (result.success) {
            return result.payload;
        }

        throw new UnauthorizedException(result.error);
    }
}
