const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const os = require('os');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3');

const appDir = path.join(os.homedir(), '.image-management-tool');
if (!fs.existsSync(appDir)) {
    fs.mkdirSync(appDir);
}

var db = new sqlite3.Database(path.join(appDir, 'image-management-tool.db'));
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS Products (name, barcode, quantity)");

    db.run("INSERT INTO Products VALUES (?, ?, ?)", ['product001', 'xxxxx', 20]);
    db.run("INSERT INTO Products VALUES (?, ?, ?)", ['product002', 'xxxxx', 40]);
    db.run("INSERT INTO Products VALUES (?, ?, ?)", ['product003', 'xxxxx', 60]);

    db.each("SELECT * FROM Products", (err, row) => {
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

module.exports = app;