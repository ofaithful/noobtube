import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { MongoConnector } from './mongo-connector';
import { getRepositoryProviders } from './repository-list';
import { DbOptions } from './types';

@Global()
@Module({})
export class DbModule {
    static async forRoot(options: DbOptions): Promise<DynamicModule> {
        const providers: Provider[] = [
            {
                provide: MongoConnector,
                useFactory: async () => {
                    const connector = new MongoConnector(options);
                    await connector.connect();
                    return connector;
                },
            },
            ...getRepositoryProviders()
        ];

        return {
            module: DbModule,
            providers,
            exports: providers,
        };
    }
}
