import { Injectable } from '@nestjs/common';
import { AUTH_SERVICE_METHODS, KafkaTopic, LoginUserParams, LoginUserResult, MessageEnvelope } from '@streams/transport';

@Injectable()
export class AuthController {

    // constructor() {}

    @KafkaTopic(AUTH_SERVICE_METHODS.LOGIN_USER)
    async login(data: LoginUserParams): Promise<MessageEnvelope<LoginUserResult>> {
        //TODO: implement
        return {
            success: true,
            payload: {
                token: 'asdlfasd'
            }
        };
    }
}