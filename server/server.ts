import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';

// TODO: import-syntax
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3');

// config
const SERVER_PORT = 4201;
const APP_DIR = '.image-management-tool';
const DB_NAME = 'image-management-tool.db';

const appDirPath = path.join(os.homedir(), APP_DIR);
if (!fs.existsSync(appDirPath)) {
    fs.mkdirSync(appDirPath);
}

const db = new sqlite3.Database(path.join(appDirPath, DB_NAME));
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

app.get(`/test`, (req, res) => {
    res.json({hello: 'world'});
});

export const startServer = () => {
    http.createServer(app).listen(SERVER_PORT);
};
