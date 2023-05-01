import { Injectable } from '@nestjs/common';
import { Collection, Db, Filter, FindOptions, OptionalUnlessRequiredId } from 'mongodb';
import { MongoConnector } from '../mongo-connector';

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

    protected find(query?: Filter<T>, options?: FindOptions<T>) {
        return this.collection.find(query, options);
    }

    protected async insertOne(doc: OptionalUnlessRequiredId<T>) {
        const result = await this.collection.insertOne({
            ...doc,
            created_at: new Date()
        });
        
        return {
            ...doc,
            id: result.insertedId
        };
    }
}