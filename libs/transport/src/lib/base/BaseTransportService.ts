import { ClientKafka } from '@nestjs/microservices';
import { Inject, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getTopicName } from '../helpers';

export abstract class BaseTransportService<K extends string, T extends Record<K, string>> implements OnModuleInit {
    @Inject(ClientKafka)
    private readonly client: ClientKafka;

    @Inject(ConfigService)
    private readonly config: ConfigService;

    private readonly logger: Logger = new Logger(BaseTransportService.name);

    abstract get methods(): T;

    onModuleInit(): void {
        const methods = Object.values(this.methods);
        methods.forEach((method: string) => this.client.subscribeToResponseOf(
            getTopicName(this.config.get('ENVIRONMENT'), method)
        ));
    }

    // todo: add types
    async send<ReqData, ResData>(topicName: string, data: ReqData) {
        console.log({sendData: data});
        const topic = getTopicName(this.config.get('ENVIRONMENT'), topicName);

        this.logger.debug('Send transport message', {
            topic,
            data
        });


        return this.client.send(topic, JSON.stringify(data)).toPromise();
    }
}