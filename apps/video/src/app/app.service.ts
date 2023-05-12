import { Injectable } from '@nestjs/common';
import { CommonDocumentData, File, FileRepository } from '@streams/db';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
console.log(path.join('tmp', 'asdf', 'foobar.jp'));

@Injectable()
export class AppService {

    constructor(
        private readonly fileRepository: FileRepository
    ) {}
    
    async attachThumbnail(file: CommonDocumentData<File>): Promise<string> {
        const thumbnailPath = await this.createThumbnail(file);
        await this.fileRepository.updateOne({ uuid: file.uuid }, { 
            $set: {
                thumbnail: thumbnailPath
            }
        });
        return thumbnailPath;
    }

    private async createThumbnail(file: CommonDocumentData<File>) : Promise<string> {
        const fileName = path.basename(file.location, path.extname(file.location));
        const thumbnailName = `${fileName}_thumbnail.jpg`;
        const thumbnailPath = path.join('public', file.uuid, thumbnailName);

        return new Promise((res, rej) => {
            ffmpeg(file.location).screenshots({
                count: 1,
                folder: path.join('tmp', file.uuid),
                filename: thumbnailName,
                size: '640x320',
                timemarks: ['00:00:01']
            })
            .on('end', () => {
                console.log('image created');
                res(thumbnailPath);
            })
            .on('error', (error) => {
                console.log(error);
                rej();
            });
        });
    }
}
