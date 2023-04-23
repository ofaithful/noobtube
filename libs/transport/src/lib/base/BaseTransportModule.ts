import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

export class BaseTransportModule implements OnModuleInit {
    @Inject(ClientKafka)
    protected readonly client: ClientKafka;

    async onModuleInit(): Promise<void> {
        await this.client.connect();
    }
}