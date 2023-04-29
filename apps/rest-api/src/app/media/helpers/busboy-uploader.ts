import { Writable } from 'stream';
import fs from 'fs/promises';
import { createWriteStream } from 'fs';
import { BusboyFileStream, Busboy } from '@fastify/busboy';
import { FastifyRequest } from 'fastify';
import path from 'path';

const exists = async (path:string): Promise<boolean> => {
    return fs.access(path).then(() => true, () => false);
}

export interface IFormData {
    id?: string;
    startByte?: number;
    endByte?: number;
    name?: string;
}

enum FormDataKeys {
    ID = 'id',
    FILE = 'file',
    START_BYTE = 'startByte',
    END_BYTE = 'endByte',
    NAME = 'name'
}
export class BusboyUploader {
    private fileStream: Writable;
    private metaData: IFormData = {};
    private bb: Busboy;

    constructor(private readonly request: FastifyRequest) {
        
    }

    upload = async () => {
        return new Promise((resolve, reject) => {
            this.bb = this.request.multipart(
                this.multipartHandler,
                this.nextHandler(resolve, reject)
            );
        
            this.bb.on('field', this.fieldHandler);
            this.bb.on('finish', this.finishHandler);
        });
    }

    private multipartHandler = async (field: string, file: BusboyFileStream) => {
        const tmpPath = path.resolve('tmp', this.metaData.id);
        const dirExists = await exists(tmpPath);

        if (!dirExists) {
            await fs.mkdir(tmpPath, { recursive: true });
        }

        const destFileName = path.join(tmpPath, this.metaData.name);

        this.fileStream = createWriteStream(destFileName, { flags: 'a' });

        file.on('data', this.dataHandler);
        file.on('end', this.endHandler);

        file.pipe(this.fileStream);
    }

    private dataHandler = (chunk: Buffer) => {
        // TODO: revisit puspose 
    }

    private endHandler = () => {
        // TODO: revisit puspose 
    }

    private nextHandler = (resolve, reject) => {
        return (error: Error) => {
            if (error) {
                return reject({
                    error,
                    name: this.metaData.name,
                    startByte: this.metaData.startByte,
                    endByte: this.metaData.endByte
                });
            }

            this.fileStream.end(() => {
                resolve(this.metaData);
            });
        }
    };

    private fieldHandler = (key: string, value: any) => {
        if (Object.values(FormDataKeys).includes(key as FormDataKeys)) {
            this.metaData[key] = Number.isInteger(Number(value)) ? Number(value) : value;
        }
    };

    private finishHandler = () => {
        // TODO: revisit puspose 
    };
}