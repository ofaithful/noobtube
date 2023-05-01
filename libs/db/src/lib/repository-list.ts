import { Provider } from '@nestjs/common';
import { UserRepository } from './repositories';
import { MongoConnector } from './mongo-connector';

const repos = [UserRepository];

export const getRepositoryProviders = (): Provider[] => repos.map(repo => ({
    provide: repo,
    useFactory: async (connector: MongoConnector) => {
        const repository = new repo(connector);
        return repository;
    },
    inject: [MongoConnector]
}))