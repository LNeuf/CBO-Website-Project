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
});

app.post('/registerstaff', (req, res) => {
	var file_output = "INSERT INTO staff (firstname, lastname, role, joindate) VALUES ('" + req.body.fname + "', '" + req.body.lname + "', '" + req.body.role + "', '" + new Date() + "');";
	console.log(file_output);
	config.query(file_output, function (err, result) {
		if (err) {
			console.log(err);
		}
		res.send("Registration received!");
	});
});

app.post('/refreshstaff', (req,res) => {
	var response = new Object();
	if (req.body == undefined) {
		response.answer = "No staff!";
	}
	else {
		var query_string = "SELECT * FROM staff;";
		console.log(query_string);

		config.query(query_string, function (err, result) {
			if (err) {
				console.log(err);
				response.answer = "No staff!";
				res.send(JSON.stringify(response));
			}
			var resultArray = JSON.parse(JSON.stringify(result));
			response.answer = resultArray;
			res.send(JSON.stringify(response));
		});
	}
})


app.use('/', express.static('pages'));

app.listen(PORT, HOST);

console.log("running");