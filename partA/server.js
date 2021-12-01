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
	config.query(query_string, function (err, result) {
		if (err) {
			console.log(err);
		}
		var parsed_result = JSON.parse(JSON.stringify(result));
		if (parsed_result[0]["count(*)"] == 1) {
			response.answer = "Yes";
		}
		else {
			response.answer = "No";
		}
		res.send(JSON.stringify(response));
	})
});

app.post('/registerstaff', (req, res) => {
	var response = new Object();
	if (req.body.lname == "") {
		response.answer = "Staff must have a last name!";
		res.send(response);
	}
	else {
		var file_output = "INSERT INTO staff (firstname, lastname, role, joindate) VALUES ('" + req.body.fname + "', '" + req.body.lname + "', '" + req.body.role + "', '" + new Date() + "');";
		console.log(file_output);
		config.query(file_output, function (err, result) {
			if (err) {
				console.log(err);
				response.answer = "Registration Failure!";
				res.send(JSON.stringify(response));
			}
			else {
				response.answer = "Registration Success!";
				res.send(JSON.stringify(response));
			}
		});
	}
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
			res.send(JSON.stringify(response))
		}
		else {
			response.answer = "Successfully updated staff with ID: " + req.body.id;
			res.send(JSON.stringify(response));
		}
	})
});

/*  */
app.delete('/deletestaff', (req, res) => {
	var response = new Object();
	var query_string = "DELETE FROM staff where ID=" + req.body.delete_id + ";";
	config.query(query_string, function (err, result) {
		if (err) {
			console.log(err);
			response.answer = "Failed to delete staff";
			res.send(JSON.stringify(response));
		}
		else {
			response.answer = "Staff with ID: " + req.body.delete_id + " deleted";
			res.send(JSON.stringify(response));
		}
	});
});

/* Sends the latest content to staff page*/
app.get('/refreshstaff', (req, res) => {
	var response = new Object();
	var query_string = "SELECT * FROM staff;";
	// console.log(query_string);

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

// Customer calls

/* Accepts customer registrations */
app.post('/registercustomer', (req, res) => {
	var response = new Object();
	var query_string = "INSERT INTO customers (firstname, lastname, birthday, address, joindate) VALUES ('" + req.body.fname + "', '" + req.body.lname + "', '" + req.body.birthday + "', '" + req.body.address + "', '" + new Date() + "');";
	if (req.body.lname == "") {
		response.answer = "Customer must have a last name!";
		res.send(response);
	}
	else if (req.body.birthday == "") {
		response.answer = "Customer must have a birthday!";
		res.send(response);
	}
	else {
		config.query(query_string, function (err, result) {
			if (err) {
				console.log(err);
				response.answer = "Registration Failure!";
				res.send(JSON.stringify(response))
			}
			else {
				response.answer = "Registration Success!"

				res.send(JSON.stringify(response));
			}
		});
	}
});

/* Sends the latest content to customer page*/
app.get('/refreshcustomers', (req, res) => {
	var response = new Object();
	var query_string = "SELECT * FROM customers;";
	// console.log(query_string);

	config.query(query_string, function (err, result) {
		if (err) {
			console.log(err);
			response.answer = "No customers!";
			res.send(JSON.stringify(response));
		}
		else {
			var resultArray = JSON.parse(JSON.stringify(result));

			if (resultArray == "") {
				response.answer = "No customers!";
			}
			else {
				response.answer = resultArray;
			}

			res.send(JSON.stringify(response));
		}
	});
});

app.delete('/deletecustomer', (req, res) => {
	var response = new Object();
	var query_string = "DELETE FROM customers where ID=" + req.body.delete_id;
	config.query(query_string, function (err, result) {
		if (err) {
			console.log(err);
			response.answer = "Failed to delete customer";
			res.send(JSON.stringify(response));
		}
		else {
			var query_string2 = `DELETE FROM reports where ID=${req.body.delete_id}`;
			config.query(query_string2, function (err, result) {
				if (err) {
					console.log(err);
				}
				else {
					console.log("Deleted reports associated with customer");
				}
			})
			response.answer = "Customer with ID: " + req.body.delete_id + " deleted";
			res.send(JSON.stringify(response));
		}
	});
});

app.put('/editcustomer', (req, res) => {
	var response = new Object();
	var set_string = "firstname = '" + req.body.first_name + "', lastname = '" + req.body.last_name + "', birthday = '" + req.body.birthday + "'"

	if (req.body.address != "") {
		set_string += ", address = '" + req.body.address + "'"
	}

	var query_string = "UPDATE customers SET " + set_string + " WHERE ID=" + req.body.id;
	console.log(query_string);
	config.query(query_string, function (err, result) {
		if (err) {
			console.log(err);
			response.answer = "Error updating customer";
			res.send(JSON.stringify(response))
		}
		else {
			response.answer = "Successfully updated customer with ID: " + req.body.id;
			res.send(JSON.stringify(response));
		}
	})
});

app.post('/newreport', (req, res) => {
	var response = new Object();
	var query_string = `INSERT INTO reports (ID, report, date) VALUES (${req.body.id}, '${req.body.report}', '${new Date()}');`;
	config.query(query_string, function (err, result) {
		if (err) {
			console.log(err);
			response.answer = "Error submitting report";
			res.send(JSON.stringify(response))
		}
		else {
			response.answer = `Report for customer ID: ${req.body.id} success`;

			res.send(JSON.stringify(response));
		}
	})
});

app.post('/getreports', (req, res) => {
	var response = new Object();
	var query_string = `SELECT * FROM reports WHERE id=${req.body.customer_id};`;
	config.query(query_string, function (err, result) {
		if (err) {
			console.log(err);
			response.answer = "Error getting reports";
			res.send(JSON.stringify(response));
		}
		else {
			var resultArray = JSON.parse(JSON.stringify(result));

			if (resultArray == "") {
				response.answer = "No reports!";
			}
			else {
				response.answer = resultArray;
				console.log(resultArray);
			}
			res.send(JSON.stringify(response));
		}
	});
});

app.delete('/deletereport', (req, res) => {
	var response = new Object();
	var query_string = "DELETE FROM reports where report_id=" + req.body.report_id;
	config.query(query_string, function (err, result) {
		if (err) {
			console.log(err);
			response.answer = "Failed to delete report";
			res.send(JSON.stringify(response));
		}
		else {
			response.answer = "Report with ID: " + req.body.report_id + " deleted";
			res.send(JSON.stringify(response));
		}
	});
})


app.use(express.static(__dirname + '/Style'));
app.use('/', express.static('pages'));

app.listen(PORT, HOST);

console.log("running");