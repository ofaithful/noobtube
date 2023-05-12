import { Injectable } from '@nestjs/common';
import { BaseTransportService } from '../../base';
import { RegisterUserParams, RegisterUserResult } from './dto';
import { MessageEnvelope } from '../../helpers';

export const USER_SERVICE_METHODS = {
    REGISTER: 'register'
}

@Injectable()
export class UserTransportService
    extends BaseTransportService<keyof typeof USER_SERVICE_METHODS, typeof USER_SERVICE_METHODS> {

    get methods() {
        return USER_SERVICE_METHODS;
    }

    async register(data: RegisterUserParams): Promise<MessageEnvelope<RegisterUserResult>> {
        return this.send(USER_SERVICE_METHODS.REGISTER, data);
    }
}
