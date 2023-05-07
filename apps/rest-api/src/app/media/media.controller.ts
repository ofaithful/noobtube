import { Controller, Get, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { AuthGuard } from '../guards/auth.guard';
import { GetFilesQueryDto } from './dto';
import { LocalUploaderService } from './local-uploader.service';
import { MediaService } from './media.service';
@Controller('media')
export class MediaController {
    constructor(
        private readonly uploadService: LocalUploaderService,
        private readonly mediaService: MediaService
    ) {}

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

    @Get(':id')
    async getMedia(@Param('id') id: string, @Req() req, @Res() res: FastifyReply) {
        const result = await this.mediaService.getFile(id, req);

        res.code(result.code)
            .headers(result.headers)
            .send(result.fileStream)
    }

    @Get()
    async getMediaFiles(@Query() query: GetFilesQueryDto) {
        return this.mediaService.getAllFiles(query);
    }
}