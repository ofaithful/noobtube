import { Injectable } from '@nestjs/common';
import { BaseTransportService } from '../../../base';
import { LoginUserParams, LoginUserResult } from './dto';
import { MessageEnvelope } from '../../../helpers';

export const AUTH_SERVICE_METHODS = {
    LOGIN_USER: 'loginUser',
}

@Injectable()
export class AuthTransportService
    extends BaseTransportService<keyof typeof AUTH_SERVICE_METHODS, typeof AUTH_SERVICE_METHODS> {

    get methods() {
        return AUTH_SERVICE_METHODS;
    }

    async login(data: LoginUserParams): Promise<MessageEnvelope<LoginUserResult>> {
        return this.send(AUTH_SERVICE_METHODS.LOGIN_USER, data);
    }
}