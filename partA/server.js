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

app.get('/isdbinit', (req, res) => {
	var response = new Object();
	var query_string = "SELECT count(*) FROM information_schema.tables WHERE (table_schema = 'cbo_db') AND (table_name ='staff');"
	console.log(query_string);
	config.query(query_string, function (err, result) {
		if (err) {
			console.log(err);
		}
		var parsed_result = JSON.parse(JSON.stringify(result));
		console.log(parsed_result);
		console.log(parsed_result[0]['count(*)']);
		if (parsed_result[0]["count(*)"] == 1) {
			response.answer = "Yes";
		}
		else {
			response.answer = "No";
		}
		res.send(response);
		
	})
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

app.put('/editstaff', (req, res) => {
	var response = new Object();
	var set_string = "";

	if (req.body.first_name != "") {
		set_string += "firstname = '" + req.body.first_name + "', ";
	}
	if (req.body.last_name != "") {
		set_string += "lastname = '" + req.body.last_name + "', ";
	}
	if (req.body.role != "") {
		set_string += "role = '" + req.body.role + "'"
	}

	if (set_string.slice(-2).normalize === ",") {
		set_string = set_string.substring(0, set_string.length - 2);
	}

	var query_string = "UPDATE staff SET " + set_string + " WHERE ID=" + req.body.id;
	console.log(query_string);
	config.query(query_string, function (err, result) {
		if (err) {
			console.log(err);
			response.answer = "Error updating staff";
		}
		response.answer = "Successfully updated staff with ID: " + req.body.id;
		res.send(JSON.stringify(response));
	})
});

app.delete('/deletestaff', (req, res) => {
	var response = new Object();
	var query_string = "DELETE FROM staff where ID=" + req.body.delete_id;
	config.query(query_string, function (err, result) {
		if (err) {
			console.log(err);
		}
		response.answer = "Staff with ID: " + req.body.delete_id + " deleted";
		res.send(JSON.stringify(response));
	});
});

/* Sends the latest content */
app.get('/refreshstaff', (req, res) => {
	var response = new Object();
	var query_string = "SELECT * FROM staff;";
	console.log(query_string);

	config.query(query_string, function (err, result) {
		if (err) {
			console.log(err);
			response.answer = "No staff!";
			res.send(JSON.stringify(response));
		}
		var resultArray = JSON.parse(JSON.stringify(result));

		if (resultArray == "") {
			response.answer = "No staff!";
		}
		else {
			response.answer = resultArray;
		}
		
		res.send(JSON.stringify(response));
	});
});


app.use(express.static(__dirname + '/Style'));
app.use('/', express.static('pages'));

app.listen(PORT, HOST);

console.log("running");