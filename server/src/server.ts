import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';

import 'reflect-metadata';
import { createConnection, getConnectionOptions } from 'typeorm';

import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// config
const SERVER_PORT = 4201;
const WORKING_DIR = '.image-management-tool';
const DB_NAME = 'image-management-tool.db';

// ensure that working directory exists
const workingDirPath = path.join(os.homedir(), WORKING_DIR);
if (!fs.existsSync(workingDirPath)) {
    fs.mkdirSync(workingDirPath);
}

export const startServer = async (electronAppPath: string) => {
    dotenv.config({ path: path.resolve(electronAppPath, '.env') });

    // await createConnection(connectionOptions);
    const app = await NestFactory.create(
        AppModule.forRoot({         // TODO: interface for config
            databaseName: DB_NAME,  // TODO: constant instead of passing as param
            workingDirPath,
            electronAppPath
        })
    );
    await app.listen(SERVER_PORT, () => {
        console.log(`Server started at port ${SERVER_PORT}`);
    });
};
