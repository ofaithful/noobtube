import { Injectable } from '@nestjs/common';
import { BaseMongoRepository } from '../base';
import { Repository } from '../decorators/repository';
import { File } from '../models';

const FILE_COLLECTION_NAME = 'files';

@Repository(FILE_COLLECTION_NAME)
@Injectable()
export class FileRepository extends BaseMongoRepository<File> {
    async saveFile(data: File): Promise<File> {
        const result = await this.insertOne(data);
        return data;
    }
}