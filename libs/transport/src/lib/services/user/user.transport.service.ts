import { Injectable } from '@nestjs/common';
import { BaseTransportService } from '../../base';

export const USER_SERVICE_METHODS = {
    CREATE_USER: 'user_createUser'
}

@Injectable()
export class UserTransportService
    extends BaseTransportService<keyof typeof USER_SERVICE_METHODS, typeof USER_SERVICE_METHODS> {

    get methods() {
        return USER_SERVICE_METHODS;
    }

    // todo: add types
    async createUser(data: any): Promise<any> {
        return this.send(USER_SERVICE_METHODS.CREATE_USER, data);
    }
}