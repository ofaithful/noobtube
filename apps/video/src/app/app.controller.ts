import { Controller } from '@nestjs/common';

import { CommonDocumentData, File } from '@streams/db';
import { KafkaTopic, MessageEnvelope, VIDEO_SERVICE_METHODS } from '@streams/transport';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @KafkaTopic(VIDEO_SERVICE_METHODS.CREATE_THUMBNAIL)
    async createThumbnail(file: CommonDocumentData<File>): Promise<MessageEnvelope<string>> {
        try {
            const thumbnail = await this.appService.attachThumbnail(file);
            return {
                success: true,
                payload: thumbnail
            }
        } catch (error) {
            console.log('Create thumbnail error:', error);
            return {
                success: false,
                payload: error.message
            }
        }
    }
}
