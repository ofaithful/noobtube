import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { BaseMongoRepository, CommonDocumentData } from '../base';
import { Repository } from '../decorators/repository';
import { File } from '../models';

const FILE_COLLECTION_NAME = 'files';

@Repository(FILE_COLLECTION_NAME)
@Injectable()
export class FileRepository extends BaseMongoRepository<File> {

    async findOneById(id: string | ObjectId): Promise<CommonDocumentData<File> | null> {
        const objectId = new ObjectId(id);
        return this.findById({ id: objectId });
    }

    async saveFile(data: File): Promise<CommonDocumentData<File>> {
        const { userId, ...restData } = data;

        return this.insertOne({
            userId: new ObjectId(userId),
            ...restData
        });
    }
}