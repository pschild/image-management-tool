import * as path from 'path';
import { getConnectionOptions } from 'typeorm';

export const ormOptions = async (config) => {
    const connectionOptions = await getConnectionOptions();
    // overwrite the dynamic config parts
    Object.assign(connectionOptions, {
        database: path.join(config.workingDirPath, config.databaseName),
        entities: [path.join(config.electronAppPath, 'server/src/entity/**/*.js')],
        migrations: [path.join(config.electronAppPath, 'server/src/migration/**/*.js')],
        subscribers: [path.join(config.electronAppPath, 'server/src/subscriber/**/*.js')]
    });
    return connectionOptions;
};
