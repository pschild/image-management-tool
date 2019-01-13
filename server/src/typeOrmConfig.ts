import * as path from 'path';
import { getConnectionOptions } from 'typeorm';

export const ormOptions = async (databaseName: string, appHomeDirPath: string, electronAppPath: string) => {
    const connectionOptions = await getConnectionOptions();
    // overwrite the dynamic config parts
    Object.assign(connectionOptions, {
        database: path.join(appHomeDirPath, databaseName),
        entities: [path.join(electronAppPath, 'server/src/entity/**/*.js')],
        migrations: [path.join(electronAppPath, 'server/src/migration/**/*.js')],
        subscribers: [path.join(electronAppPath, 'server/src/subscriber/**/*.js')]
    });
    return connectionOptions;
};
