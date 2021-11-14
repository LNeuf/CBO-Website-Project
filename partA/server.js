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

app.post('/editstaff', (req, res) => {
	var set_string = "";
	if (req.body.first_name == "" && req.body.last_name == "" && req.body.role == "") {
		return;
	}

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
		console.log("hey");
		set_string = set_string.substring(0, set_string.length - 2);
	}

	var query_string = "UPDATE staff SET " + set_string + " WHERE ID=" + req.body.id;
	config.query(query_string, function (err, result) {
		if (err) {
			console.log(err);
		}
	})
});

// app.get('/changetoeditstaff', (req, res) => {
// 	var changeID = encodeURIComponent(req.body.changeid);
// 	console.log(req.body.changeID);
// 	var query_string = "SELECT * FROM staff WHERE ID=" + req.body.changeid;
// 	var response = new Object();
// 	config.query(query_string, function (err, result) {
// 		if (err) {
// 			console.log(err);
// 		}
// 		var resultArray = JSON.parse(JSON.stringify(result));
// 		response.answer = resultArray;
// 		var stringified = JSON.stringify(response);
// 		res.redirect('http://localhost/staff_edit_page.html?id=' + changeID + "&fname=" + stringified.answer.firstname + "&lname=" + stringified.answer.lastname + "&role=" + stringified.answer.role);
// 	});
// });


app.post('/deletestaff', (req, res) => {
	var query_string = "DELETE FROM staff where ID=" + req.body.ID;
	config.query(query_string, function (err, result) {
		if (err) {
			console.log(err);
		}
		res.send("Staff with ID: " + req.body.ID + " deleted");
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