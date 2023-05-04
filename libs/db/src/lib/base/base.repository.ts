import { Injectable } from '@nestjs/common';
import { Collection, Db, Filter, FindOptions, OptionalUnlessRequiredId } from 'mongodb';
import { MongoConnector } from '../mongo-connector';
import { CommonDocumentData } from './common.document.data';

@Injectable()
export abstract class BaseMongoRepository<T> {
    protected readonly db: Db;

    protected readonly collectionName: string;

    constructor(protected readonly connector: MongoConnector) {
        this.db = connector.db;
    }

    protected get collection(): Collection<T> {
        return this.db.collection(this.collectionName);
    }

    find(query?: Filter<T>, options?: FindOptions<T>) {
        return this.collection.find(query, options);
    }

    findOne(query?: Filter<T>, options?: FindOptions<T>) {
        return this.collection.findOne(query, options);
    }

    async countDocuments(query?: Filter<T>, options?: FindOptions<T>): Promise<number> {
        return this.collection.countDocuments(query, options);
    }

    protected async insertOne(doc: T): Promise<CommonDocumentData<T>> {
        const now = new Date();

        const toInsert = {
            ...doc,
            created_at: now,
        } as OptionalUnlessRequiredId<T>;

        const result = await this.collection.insertOne(toInsert);
        
        return {
            ...doc,
            created_at: now,
            _id: result.insertedId
        };
    }
}