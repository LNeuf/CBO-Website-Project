'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const PORT = 8080;
const HOST = '0.0.0.0';
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require('mongoose');

const connectionString = 'mongodb+srv://admin:admin@cluster0.iqghx.mongodb.net/cbo_db?retryWrites=true&w=majority';

mongoose
	.connect(connectionString)
	.catch(err => {
		console.log(err)
	});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const staffSchema = new mongoose.Schema({
	id: Number,
	firstname: String,
	lastname: String,
	role: String,
	joindate: String
});

const customerSchema = new mongoose.Schema({
	id: Number,
	firstname: String,
	lastname: String,
	birthday: String,
	address: String,
	joindate: String
})

const staffModel = mongoose.model("staff", staffSchema);
const customerModel = mongoose.model("customer", customerSchema);

var staffID = 1;

app.post('/registerstaff', (req, res) => {
	var response = new Object();
	var staff = new staffModel({
		id: staffID,
		firstname: req.body.fname,
		lastname: req.body.lname,
		role: req.body.role,
		joindate: new Date()
	});

	staff.save()
	.then((result) => {
		response.answer = result;
		staffID += 1;
		res.send(JSON.stringify(response));
	})
	.catch((err) => {
		console.log(err);
		response.answer = "Registration Failure"
	});
});

app.put('/editstaff', (req, res) => {
	var response = new Object();
	var staff = new staffModel({
		id: req.body.id,
		firstname: req.body.first_name,
		lastname: req.body.last_name,
		role: req.body.role,
	});

	staffModel.findOneAndUpdate({id: req.body.id}, staff)
	.then((result) => {
		response.answer = "Updated info for staff with ID: " + req.body.id;
		res.send(response);
	})
	.catch((err) => {
		console.log(err);
		response.answer = "Error updating staff";
		res.send(response);
	})
});

/* Handles request for deleting a staff member */
app.delete('/deletestaff', (req, res) => {
	var response = new Object();
	staffModel.deleteOne({id: req.body.delete_id})
	.then((result) => {
		response.answer = "Deleted staff with ID: " + req.body.delete_id;
		res.send(response);
	})
	.catch((err) => {
		console.log(err);
		response.answer = "Error deleting staff";
		res.send(response);
	})
});

/* Sends the latest content to staff page*/
app.get('/refreshstaff', (req, res) => {
	var response = new Object();
	staffModel.find()
	.then((result) => {
		response.answer = result;
		res.send(response);
	})
	.catch((err) => {
		console.log(err);
		response.answer = "Refresh Failed";
		res.send(response);
	})
});

// Customer calls
var customerID = 1;

/* Accepts customer registrations */
app.post('/registercustomer', (req, res) => {
	var response = new Object();
	var customer = new customerModel({
		id: customerID,
		firstname: req.body.fname,
		lastname: req.body.lname,
		birthday: req.body.birthday,
		address: req.body.address,
		joindate: new Date()
	});

	customer.save()
	.then((result) => {
		response.answer = result;
		customerID += 1;
		res.send(JSON.stringify(response));
	})
	.catch((err) => {
		console.log(err);
		response.answer = "Registration Failure"
	});
});

// /* Sends the latest content to customer page*/
// app.get('/refreshcustomers', (req, res) => {
// 	var response = new Object();
// 	var query_string = "SELECT * FROM customers;";
// 	// console.log(query_string);

// 	config.query(query_string, function (err, result) {
// 		if (err) {
// 			console.log(err);
// 			response.answer = "No customers!";
// 			res.send(JSON.stringify(response));
// 		}
// 		var resultArray = JSON.parse(JSON.stringify(result));

// 		if (resultArray == "") {
// 			response.answer = "No customers!";
// 		}
// 		else {
// 			response.answer = resultArray;
// 		}

// 		res.send(JSON.stringify(response));
// 	});
// });

// app.delete('/deletecustomer', (req, res) => {
// 	var response = new Object();
// 	var query_string = "DELETE FROM customers where ID=" + req.body.delete_id;
// 	config.query(query_string, function (err, result) {
// 		if (err) {
// 			console.log(err);
// 			response.answer = "Failed to delete customer";
// 			res.send(JSON.stringify(response));
// 		}
// 		else {
// 			response.answer = "Customer with ID: " + req.body.delete_id + " deleted";
// 			res.send(JSON.stringify(response));
// 		}
// 	});
// });

// app.put('/editcustomer', (req, res) => {
// 	var response = new Object();
// 	var set_string = "firstname = '" + req.body.first_name + "', lastname = '" + req.body.last_name + "', birthday = '" + req.body.birthday + "'"

// 	if (req.body.address != "") {
// 		set_string += ", address = '" + req.body.address + "'"
// 	}

// 	var query_string = "UPDATE customers SET " + set_string + " WHERE ID=" + req.body.id;
// 	console.log(query_string);
// 	config.query(query_string, function (err, result) {
// 		if (err) {
// 			console.log(err);
// 			response.answer = "Error updating customer";
// 			res.send(JSON.stringify(response))
// 		}
// 		else {
// 			response.answer = "Successfully updated customer with ID: " + req.body.id;
// 			res.send(JSON.stringify(response));
// 		}
// 	})
// });


app.use(express.static(__dirname + '/Style'));
app.use('/', express.static('pages'));

app.listen(PORT, HOST);

console.log("running");