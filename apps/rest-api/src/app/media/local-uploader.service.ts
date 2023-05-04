import { BusboyFileStream } from '@fastify/busboy';
import { Injectable } from '@nestjs/common';
import { CommonDocumentData, File, FileRepository, User } from '@streams/db';
import { randomUUID } from 'crypto';
import { FastifyRequest } from 'fastify';
import fs from 'fs';
import { access, mkdir } from 'fs/promises';
import path from 'path';
import { pipeline } from 'stream/promises';
import { IFormData } from './helpers';


const exists = async (path:string): Promise<boolean> => {
    return access(path).then(() => true, () => false);
}
@Injectable()
export class LocalUploaderService {

    constructor(private readonly fileRepository: FileRepository) {}

    async handleUpload(request: FastifyRequest) : Promise<IFormData & { savedFileId?: string }> {
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
            const savedFile = await this.saveFile(request['user'], fileName, path.join('tmp', id));
            result['savedFileId'] = savedFile._id.toString();
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

    private async saveFile(user: CommonDocumentData<User>, fileName: string, filePath: string): Promise<CommonDocumentData<File>> {
        const location = path.join(filePath, fileName);
        return this.fileRepository.saveFile({
            userId: user._id,
            name: fileName,
            location
        });
    }
}