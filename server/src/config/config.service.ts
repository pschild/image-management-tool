import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { IAppConfig } from './IAppConfig';

@Injectable()
export class ConfigService {

    private readonly appHomeDirPath: string;
    private readonly appRootPath: string;

    private readonly envConfig: { [key: string]: string };

    constructor(config: IAppConfig) {
        const envContent = dotenv.config({ path: path.resolve(config.appRootPath, '.env') });
        if (!envContent || !envContent.parsed) {
            throw new Error(`.env file could not be found at location "${config.appRootPath}/.env"`);
        }
        this.envConfig = envContent.parsed;

        this.appHomeDirPath = config.appHomeDirPath;
        this.appRootPath = config.appRootPath;
    }

    get(key: string): string {
        return this.envConfig[key];
    }

    getAppHomeDirPath(): string {
        return this.appHomeDirPath;
    }

    getAppRootPath(): string {
        return this.appRootPath;
    }
}
