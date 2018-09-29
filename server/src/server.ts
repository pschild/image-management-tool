import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import * as express from 'express';
import { Application, Request, Response } from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import 'reflect-metadata';
import { createConnection, getConnectionOptions } from 'typeorm';
import { Routes } from './routes';

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
    const connectionOptions = await getConnectionOptions();
    // overwrite path to database
    Object.assign(connectionOptions, { database: path.join(workingDirPath, DB_NAME) });
    // overwrite paths to entities, migrations and subscribers
    Object.assign(connectionOptions, { entities: [path.join(electronAppPath, 'server/src/entity/**/*.js')] });
    Object.assign(connectionOptions, { migrations: [path.join(electronAppPath, 'server/src/migration/**/*.js')] });
    Object.assign(connectionOptions, { subscribers: [path.join(electronAppPath, 'server/src/subscriber/**/*.js')] });

    createConnection(connectionOptions).then(connection => {
        const app: Application = express();

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(cors());

        // register express routes from defined application routes dynamically
        Routes.forEach(route => {
            (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
                try {
                    const actionResult = (new (route.controller as any))[route.action](req, res, next);
                    if (actionResult instanceof Promise) {
                        actionResult.then(result => result !== null && result !== undefined ? res.send(result) : res.send(null));
                    } else if (actionResult !== null && actionResult !== undefined) {
                        res.json(actionResult);
                    } else {
                        res.json(null);
                    }
                } catch (e) {
                    res.json({ error: e });
                }
            });
        });

        app.listen(SERVER_PORT, () => {
            console.log(`Server started at port ${SERVER_PORT}`);
        });
    });
};
