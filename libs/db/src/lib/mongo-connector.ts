import { Db, MongoClient } from 'mongodb';
import { Injectable, Logger } from '@nestjs/common';
import type { DbOptions } from './types';

@Injectable()
export class MongoConnector {
    private readonly _client: MongoClient;

    constructor(
        private readonly options: DbOptions,
        private readonly logger = new Logger(MongoConnector.name)
    ) {
        this._client = new MongoClient(options.mongoUri);
    }

    get db(): Db {
        return this._client.db();
    }

    async connect() {
        try {
            await this._client.connect();
            this.logger.log(`Connected to DB @${this.options.mongoUri}`);
        } catch (error) {
            this.logger.error('Connection to DB failed', error);
        }
    }
}