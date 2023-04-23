import { Module } from '@nestjs/common';
import { BaseTransportModule } from '../../base/BaseTransportModule';
import { KafkaClientProvider } from '../../helpers';
import { UserTransportService } from './user.transport.service';

export const USER_SERVICE_NAME = 'user';

@Module({
    providers: [
        KafkaClientProvider(USER_SERVICE_NAME),
        UserTransportService
    ],
    exports: [UserTransportService]
})
export class UserTransportModule extends BaseTransportModule {
}