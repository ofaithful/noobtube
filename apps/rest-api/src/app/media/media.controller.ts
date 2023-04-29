import { Controller, Post, Req, Res, Body } from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { LocalUploaderService } from './local-uploader.service';
@Controller('media')
export class MediaController {
    constructor(private readonly uploadService: LocalUploaderService) {}

    @Post()
    async upload(@Req() req, @Res() res: FastifyReply) {
        try {
            const result = await this.uploadService.handleUpload(req);
            res.send(result);
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    }
}