import { Controller, Post, Req, Res } from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { LocalUploaderService } from './local-uploader.service';

@Controller('media')
export class MediaController {
    constructor(private readonly uploadService: LocalUploaderService) {}



    @Post()
    async upload(@Req() req, @Res() res: FastifyReply) {
        // TODO: add errors handling and response type
        const result = await this.uploadService.handleUpload(req);
        res.send(result);
    }
}