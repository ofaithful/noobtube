import { Injectable } from '@nestjs/common';
import { Repository } from '../decorators/repository';
import { BaseMongoRepository, CommonDocumentData } from '../base';
import { User } from '../models';

const USER_COLLECTION_NAME = 'users';

@Repository(USER_COLLECTION_NAME)
@Injectable()
export class UserRepository extends BaseMongoRepository<User> {

    async findAll(): Promise<User[]> {
        const cursor = this.collection.find();
        const result = await cursor.toArray();
        return result;
    }

    async createUser(data: User): Promise<CommonDocumentData<User>> {
        const result = await this.insertOne(data);
        return result;
    }
}