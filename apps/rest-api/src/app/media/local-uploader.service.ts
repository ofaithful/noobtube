import { Injectable } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

import { BusboyUploader, IFormData } from './helpers';

@Injectable()
export class LocalUploaderService {

    async handleUpload(request: FastifyRequest) : Promise<IFormData> {
        const uploader = new BusboyUploader(request);
        const result = await uploader.upload();
        return result;
    }
    
}