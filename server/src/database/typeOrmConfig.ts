import * as path from 'path';
import { getConnectionOptions } from 'typeorm';

export const ormOptions = async (databaseName: string, appHomeDirPath: string, appRootPath: string) => {
    if (!databaseName) {
        throw new Error(`No database name was defined. Define DB_NAME property in your .env file.`);
    }

    const connectionOptions = await getConnectionOptions();
    // overwrite the dynamic config parts
    Object.assign(connectionOptions, {
        database: path.join(appHomeDirPath, databaseName),
        entities: [path.join(appRootPath, 'server/src/entity/**/*.{ts,js}')],
        migrations: [path.join(appRootPath, 'server/src/migration/**/*.{ts,js}')],
        subscribers: [path.join(appRootPath, 'server/src/subscriber/**/*.{ts,js}')]
    });
    return connectionOptions;
};
