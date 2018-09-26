import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { Database } from 'sqlite3';

import { WelcomeController } from './controllers';

// config
const SERVER_PORT = 4201;
const APP_DIR = '.image-management-tool';
const DB_NAME = 'image-management-tool.db';

// application directory
const appDirPath = path.join(os.homedir(), APP_DIR);
if (!fs.existsSync(appDirPath)) {
    fs.mkdirSync(appDirPath);
}

// database
const db: Database = new Database(path.join(appDirPath, DB_NAME));
db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS Products (name, barcode, quantity)');

    db.run('INSERT INTO Products VALUES (?, ?, ?)', ['product001', 'xxxxx', 20]);
    db.run('INSERT INTO Products VALUES (?, ?, ?)', ['product002', 'xxxxx', 40]);
    db.run('INSERT INTO Products VALUES (?, ?, ?)', ['product003', 'xxxxx', 60]);

    db.each('SELECT * FROM Products', (err, row) => {
        console.log(row);
    });
});
db.close();

// server application
const app: express.Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use('/welcome', WelcomeController);

export const startServer = () => {
    app.listen(SERVER_PORT, () => {
        console.log(`Server started at port ${SERVER_PORT}`);
    });
};
