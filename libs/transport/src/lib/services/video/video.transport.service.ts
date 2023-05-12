import { Injectable } from '@nestjs/common';
import { BaseTransportService } from '../../base';
import { MessageEnvelope } from '../../helpers';
import { CommonDocumentData, File } from '@streams/db';

export const VIDEO_SERVICE_METHODS = {
    CREATE_THUMBNAIL: 'create_thumbnail'
}

@Injectable()
export class VideoTransport
    extends BaseTransportService<keyof typeof VIDEO_SERVICE_METHODS, typeof VIDEO_SERVICE_METHODS> {
        
    get methods() {
        return VIDEO_SERVICE_METHODS;
    }

    async createThumbnail(data: CommonDocumentData<File>): Promise<MessageEnvelope<string>> {
        return this.send(VIDEO_SERVICE_METHODS.CREATE_THUMBNAIL, data);
    }
}