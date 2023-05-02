import { Controller } from '@nestjs/common';
import { KafkaTopic, MessageEnvelope, RegisterUserParams, RegisterUserResult, USER_SERVICE_METHODS } from '@streams/transport';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService
    ) { }

    @KafkaTopic(USER_SERVICE_METHODS.REGISTER)
    async register(data: RegisterUserParams): Promise<MessageEnvelope<RegisterUserResult>> {
        return this.appService.register(data);
    }
}
