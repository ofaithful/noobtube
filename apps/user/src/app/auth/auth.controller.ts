import { Injectable } from '@nestjs/common';
import { AUTH_SERVICE_METHODS, KafkaTopic, LoginUserParams, LoginUserResult, MessageEnvelope } from '@streams/transport';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';
import { UserRepository } from '@streams/db';

@Injectable()
export class AuthController {

    constructor(
        private readonly passwordService: PasswordService,
        private readonly tokenService: TokenService,
        private readonly userRepository: UserRepository
    ) {}

    @KafkaTopic(AUTH_SERVICE_METHODS.LOGIN_USER)
    async login(data: LoginUserParams): Promise<MessageEnvelope<LoginUserResult>> {
        try {
            const user = await this.userRepository.findOne({ username: data.username });
            if (!user) {
                return {
                    success: false,
                    error: 'No such user'
                }
            }

            const passwordCorrect = await this.passwordService.isPasswordCorrect(user, data.password);
            if (!passwordCorrect) {
                return {
                    success: false,
                    error: 'incorrect password'
                }
            }

            return {
                success: true,
                payload: {
                    token: await this.tokenService.signToken(user)
                }
            }
        } catch (error) {
            console.log('login controller error:', error);
            return {
                success: false,
                error: error.message
            }
        }
    }
}