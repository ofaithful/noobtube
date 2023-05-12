import { BusboyFileStream } from '@fastify/busboy';
import { Injectable } from '@nestjs/common';
import { CommonDocumentData, File, FileRepository } from '@streams/db';
import { VideoTransport } from '@streams/transport';
import { randomUUID } from 'crypto';
import { FastifyRequest } from 'fastify';
import fs from 'fs';
import { access, mkdir } from 'fs/promises';
import path from 'path';
import { pipeline } from 'stream/promises';
import { IFormData } from './helpers';

type SaveFileParams = {
    user: CommonDocumentData<File>,
    fileName: string,
    filePath: string,
    uuid: string,
}

type SaveFileResult = {
    savedFileId?: string,
    thumbnail?: string
}

const exists = async (path:string): Promise<boolean> => {
    return access(path).then(() => true, () => false);
}
@Injectable()
export class LocalUploaderService {

    constructor(
        private readonly fileRepository: FileRepository,
        private readonly videoTransport: VideoTransport
    ) {}

    async handleUpload(request: FastifyRequest) : Promise<IFormData & SaveFileResult> {
        const file = await request.file();
        const id = file.fields.id ? file.fields.id['value'] : randomUUID();
        const fileName = file.fields.name['value'];
        const tmpPath = path.resolve('tmp', id);
        
        const startByte = Number(file.fields.startByte['value']);
        const endByte = Number(file.fields.endByte['value']);
        const totalSize = Number(file.fields.size['value']);

        const dirExists = await exists(tmpPath);

        if (!dirExists) {
            await mkdir(tmpPath, { recursive: true });
        }

        const destFileName = path.join(tmpPath, fileName);

        const res = await this.pipeFile(file.file, destFileName);

        const result = {
            id,
            startByte,
            endByte,
            name: fileName
        }

        if (totalSize === endByte) {
            const savedFile = await this.saveFile({
                user: request['user'],
                fileName,
                filePath: path.join('tmp', id),
                uuid: id
            });
            result['savedFileId'] = savedFile._id.toString();
            const createThumbnailResult = await this.videoTransport.createThumbnail(savedFile);
            if (createThumbnailResult.success) {
                result['thumbnail'] = createThumbnailResult.payload
            }
        }

        return result;
    }

    private async pipeFile(file: BusboyFileStream, filename: string) {
        try {
            return pipeline(file, fs.createWriteStream(filename, { flags: 'a' }));
        } catch (error) {
            console.log('upload error:', error);
        }
    }

    private async saveFile(data: SaveFileParams): Promise<CommonDocumentData<File>> {
        const location = path.join(data.filePath, data.fileName);
        return this.fileRepository.saveFile({
            userId: data.user._id,
            name: data.fileName,
            location,
            uuid: data.uuid
        });
    }
}