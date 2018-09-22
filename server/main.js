const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3');

var db = new sqlite3.Database('test.db');
db.serialize(() => {
    db.run("CREATE TABLE Products (name, barcode, quantity)");

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