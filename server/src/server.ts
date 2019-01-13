import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import 'reflect-metadata';

// config
const SERVER_PORT = 4201;
const APP_HOME_DIR = '.image-management-tool';

// ensure that working directory exists
const appHomeDirPath = path.join(os.homedir(), APP_HOME_DIR);
if (!fs.existsSync(appHomeDirPath)) {
    fs.mkdirSync(appHomeDirPath);
}

export const startServer = async (electronAppPath: string) => {
    const app = await NestFactory.create(
        AppModule.forRoot({
            appHomeDirPath,
            electronAppPath
        })
    );
    await app.listen(SERVER_PORT, () => {
        console.log(`Server started at port ${SERVER_PORT}`);
    });
};
