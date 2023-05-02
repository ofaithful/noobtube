import { ClientKafka, KafkaOptions, MessagePattern, Transport } from '@nestjs/microservices';
import { Provider, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

enum RESPONSE_CODES {
    USERNAME_ALREADY_EXISTS,
}

export interface MessageEnvelopeError<T> {
    errorCode?: number;
    error: Error | T;
}

export interface MessageEnvelope<T, E = string> {
    success: boolean;
    payload?: T;
    error?: E;
}

export const KafkaTopic = (pattern: string) => {
    const patternWithEnv = `${process.env.ENVIRONMENT || process.env.NODE_ENV}_${pattern}`;

    return MessagePattern(patternWithEnv);
}

export function getKafkaOptions(serviceName: string): KafkaOptions {
    const envServiceName = `${process.env.ENVIRONMENT || process.env.NODE_ENV}_${serviceName}`;
    const brokers = process.env.KAFKA_BROKERS
        ? process.env.KAFKA_BROKERS.split(',')
        : ['localhost:9092'];

    return {
        transport: Transport.KAFKA,
        options: {
            client: {
                clientId: envServiceName,
                brokers
            },
            consumer: {
                groupId: `${envServiceName}-consumer`
            }
        }
    };
}

export function getTopicName(env: string, topicName: string): string {
    return `${env}_${topicName}`;
}

export function KafkaClientProvider(serviceName: string): Provider<ClientKafka> {
    return {
        provide: ClientKafka,
        useFactory: (configService: ConfigService) => new ClientKafka(
            getKafkaOptions(`${configService.get('APP_NAME')}_${serviceName}`).options
        ),
        inject: [ConfigService]
    }
}

export async function startMicroservice(bootModule: any, serviceName: string) {
    const app = await NestFactory.createMicroservice(bootModule, {
        ...getKafkaOptions(serviceName)
    });

    process.on('unhandledRejection', (error: Error) => {
        Logger.error(`UnhandledRejection: ${error.message}`, {}, error);
    });

    app.listen()
    .then(() => {
        const microserviceName = `${process.env.ENVIRONMENT || process.env.NODE_ENV}_${serviceName}`.toUpperCase();
        Logger.log(`${microserviceName} microservice started`);
    });
}