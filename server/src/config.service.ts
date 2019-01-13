import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { IAppConfig } from './IAppConfig';

@Injectable()
export class ConfigService {

    private readonly appHomeDirPath: string;
    private readonly electronAppPath: string;

    private readonly envConfig: { [key: string]: string };

    constructor(config: IAppConfig) {
        const envContent = dotenv.config({ path: path.resolve(config.electronAppPath, '.env') });
        if (!envContent || !envContent.parsed) {
            throw new Error(`.env file could not be found at location "${config.electronAppPath}/.env"`);
        }
        this.envConfig = envContent.parsed;

        this.appHomeDirPath = config.appHomeDirPath;
        this.electronAppPath = config.electronAppPath;
    }

    get(key: string): string {
        return this.envConfig[key];
    }

    getAppHomeDirPath(): string {
        return this.appHomeDirPath;
    }

    getElectronAppPath(): string {
        return this.electronAppPath;
    }
}
