'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const PORT = 8080;
const HOST = '0.0.0.0';
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

const sql = require('mysql');

var config = sql.createConnection({
	host: 'mysql1',
	user: 'root',
	database: 'cbo_db',
	password: 'admin'
});

app.get('/connect', (req, res) => {
	config.connect(function (err) {
		if (err) console.log(err);

		console.log("Connected!");
	});
})




app.use('/', express.static('pages'));

app.listen(PORT, HOST);

console.log("running");