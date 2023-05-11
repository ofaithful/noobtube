import { Injectable } from '@nestjs/common';
import { BaseTransportService } from '../../base';

export const VIDEO_SERVICE_METHODS = {

}

@Injectable()
export class VideoTransport
    extends BaseTransportService<keyof typeof VIDEO_SERVICE_METHODS, typeof VIDEO_SERVICE_METHODS> {
        
    get methods() {
        return VIDEO_SERVICE_METHODS;
    }
}