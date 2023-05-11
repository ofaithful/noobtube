import { Module } from '@nestjs/common';
import { BaseTransportModule } from '../../base/BaseTransportModule';
import { KafkaClientProvider } from '../../helpers';
import { VideoTransport } from './video.transport.service';

export const VIDEO_SERVICE_NAME = 'video';

@Module({
    providers: [
        KafkaClientProvider(VIDEO_SERVICE_NAME),
        VideoTransport
    ],
    exports: [
        VideoTransport
    ]
})
export class VideoTransportModule extends BaseTransportModule {
}