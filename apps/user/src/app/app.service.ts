import { Injectable } from '@nestjs/common';
import { MessageEnvelope, RegisterUserParams, RegisterUserResult } from '@streams/transport';
import { UserRepository } from '@streams/db';
import { PasswordService } from './auth/password.service';
import { TokenService } from './auth/token.service';
import { inspect } from 'util';

@Injectable()
export class AppService {
    constructor(
        private readonly passwordService: PasswordService,
        private readonly userRepository: UserRepository,
        private readonly tokenService: TokenService
    ) {}
  
  
    async register(data: RegisterUserParams): Promise<MessageEnvelope<RegisterUserResult>> {
        const { password, ...userData } = data;
        try {
            const usersWithProvidedUsername = await this.userRepository.countDocuments({
                username: userData.username
            });

            if (usersWithProvidedUsername > 0) {
                return {
                    success: false,
                    error: 'username already in use'
                }
            }

            const salt = await this.passwordService.makeSalt();
            const hashedPassword = await this.passwordService.hashPassword(salt, password);

            const user = await this.userRepository.createUser({
                ...userData,
                salt,
                password: hashedPassword
            });

            return {
                success: true,
                payload: {
                    user,
                    token: await this.tokenService.signToken(user)
                }
            }
        } catch (error) {
            console.log('register user error:', error);
            return {
                success: false,
                error: error.message
            }
        }
    }
}
