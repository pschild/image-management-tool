import * as path from 'path';
import { Global, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';

@Global()
export class DatabaseModule {
    public static forRoot(config: any): DynamicModule {
        return {
            module: DatabaseModule,
            imports: [
                TypeOrmModule.forRootAsync({
                    useFactory: async () => {
                        const connectionOptions = await getConnectionOptions();

                        // overwrite the dynamic config parts
                        Object.assign(connectionOptions, {
                            database: path.join(config.workingDirPath, config.databaseName),
                            entities: [path.join(config.electronAppPath, 'server/src/entity/**/*.js')],
                            migrations: [path.join(config.electronAppPath, 'server/src/migration/**/*.js')],
                            subscribers: [path.join(config.electronAppPath, 'server/src/subscriber/**/*.js')]
                        });

                        return connectionOptions;
                    }
                })
            ]
        };
    }
}
