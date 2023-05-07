import { Injectable, NotFoundException } from '@nestjs/common';
import { CommonDocumentData, File, FileRepository } from '@streams/db';
import { ReadStream, createReadStream } from 'fs';
import { stat } from 'fs/promises';

type GetFileResponse = {
    code: number,
    headers: Record<string, string | number>,
    fileStream: ReadStream
}

type GetAllFilesParams = {
    page?: number,
    perPage?: number
}

@Injectable()
export class MediaService {
    constructor(private readonly fileRepository: FileRepository) {}

    async getAllFiles(params?: GetAllFilesParams): Promise<CommonDocumentData<File>[]> {
        const { page = 1, perPage = 20 } = params;
        const skip = Math.abs(page - 1) * perPage;

        return this.fileRepository.find({}, {
            sort: { _id: -1 },
            skip,
            ...perPage ? { limit: perPage } : {}
        });
    }

    async getFile(id: string, req: Request): Promise<GetFileResponse> {
        const fileDocument = await this.fileRepository.findOneById(id);
        if (!fileDocument) {
            throw new NotFoundException();
        }

        const fileStat = await stat(fileDocument.location);

        const range = req.headers['range'];
        if (range) {
            const parts = range.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileStat.size - 1;
            const chunkSize = end - start + 1;

            const headers = {
                'Content-Type': 'video/mp4',
                'Content-Length': chunkSize,
                'Content-Range': `bytes ${start}-${end}/${fileStat.size}`,
            };

            return {
                code: 206,
                headers,
                fileStream: createReadStream(fileDocument.location, { start, end })
            }
        } else {
            const headers = {
                'Content-Type': 'video/mp4',
                'Content-Length': fileStat.size,
            };
            return {
                code: 200,
                headers: headers,
                fileStream: createReadStream(fileDocument.location)
            }
        }
    }
}