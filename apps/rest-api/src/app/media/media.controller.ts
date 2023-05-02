import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { FastifyReply } from 'fastify';

import fs, { createReadStream } from 'fs';
import { AuthGuard } from '../guards/auth.guard';
import { LocalUploaderService } from './local-uploader.service';
@Controller('media')
export class MediaController {
    constructor(private readonly uploadService: LocalUploaderService) {}

    @Post()
    @UseGuards(AuthGuard)
    async upload(@Req() req, @Res() res: FastifyReply) {
        try {
            const result = await this.uploadService.handleUpload(req);
            res.send(result);
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    }

    @Get()
    async getMedia(@Req() req, @Res() res: FastifyReply) {
        const filePath = 'tmp/dab34ffb-addb-4b09-9194-d567acfa07f1/stalker0.mkv';

        const stat = await fs.promises.stat(filePath);

        const range = req.headers['range'];

        if (range) {
            console.log({range});
            const parts = range.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
            const chunkSize = end - start + 1;
            const file = fs.createReadStream(filePath, { start, end });
            const head = {
            'Content-Type': 'video/mp4',
            'Content-Length': chunkSize,
            'Content-Range': `bytes ${start}-${end}/${stat.size}`,
            };
            res.headers(head);
            res.code(206);
            res.send(file);
        } else {
          const head = {
            'Content-Type': 'video/mp4',
            'Content-Length': stat.size,
          };
          res.headers(head).send(createReadStream(filePath));
        }
    }
}