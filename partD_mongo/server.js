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

const reportSchema = new mongoose.Schema({
	id: Number,
	report_id: Number,
	report: String,
	date: String
})

const idSchema = new mongoose.Schema({
	staffID: Number,
	customerID: Number,
	reportID: Number
});

const staffModel = mongoose.model("staff", staffSchema);
const customerModel = mongoose.model("customer", customerSchema);
const reportModel = mongoose.model("report", reportSchema);
const idModel = mongoose.model("id", idSchema);

app.post('/registerstaff', (req, res) => {
	var response = new Object();
	
	idModel.find()
	.then((result) => {
		var staffID = result[0].staffID;
		
		// Register new staff with ID
		var staff = new staffModel({
			id: staffID,
			firstname: req.body.fname,
			lastname: req.body.lname,
			role: req.body.role,
			joindate: new Date()
		});
	
		staff.save()
		.then((result) => {
			response.answer = "Registration Success";
			res.send(JSON.stringify(response));
		})
		.catch((err) => {
			console.log(err);
			response.answer = "Registration Failure"
		});

		// Increment ID in database
		idModel.findOneAndUpdate({staffID: result[0].staffID}, {$inc : {'staffID':1}})
		.then((result) => {
			console.log("Updated staff ID");
		})
		.catch((err) => {
			console.log(err);
		})
	})
	.catch((err) => {
		console.log(err);
	})
});

app.put('/editstaff', (req, res) => {
	var response = new Object();
	var staff = {
		firstname: req.body.first_name,
		lastname: req.body.last_name,
		role: req.body.role
	};

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

/* Accepts customer registrations */
app.post('/registercustomer', (req, res) => {
	var response = new Object();
	idModel.find()
	.then((result) => {
		var customerID = result[0].customerID;
		
		// Register new staff with ID
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
			response.answer = "Registration Success";
			res.send(JSON.stringify(response));
		})
		.catch((err) => {
			console.log(err);
			response.answer = "Registration Failure"
		});

		// Increment ID in database
		idModel.findOneAndUpdate({customerID: result[0].customerID}, {$inc : {'customerID':1}})
		.then((result) => {
			console.log("Updated customer ID");
		})
		.catch((err) => {
			console.log(err);
		})
	})
	.catch((err) => {
		console.log(err);
	})
	
});

/* Sends the latest content to customer page*/
app.get('/refreshcustomers', (req, res) => {
	var response = new Object();
	customerModel.find()
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

/* Handles request for deleting a staff member */
app.delete('/deletecustomer', (req, res) => {
	var response = new Object();
	customerModel.deleteOne({id: req.body.delete_id})
	.then((result) => {
		reportModel.deleteMany({id: req.body.delete_id})
		.then((result) => {
			console.log("Deleted repots associated with customer");
		})
		.catch((err) => {
			console.log(err);
		})
		response.answer = "Deleted customer with ID: " + req.body.delete_id;
		res.send(response);
	})
	.catch((err) => {
		console.log(err);
		response.answer = "Error deleting customer";
		res.send(response);
	})
});

app.put('/editcustomer', (req, res) => {
	var response = new Object();
	var customer = {
		firstname: req.body.first_name,
		lastname: req.body.last_name,
		birthday: req.body.birthday,
		address: req.body.address
	};

	staffModel.findOneAndUpdate({id: req.body.id}, customer)
	.then((result) => {
		response.answer = "Updated info for customer with ID: " + req.body.id;
		res.send(response);
	})
	.catch((err) => {
		console.log(err);
		response.answer = "Error updating customer";
		res.send(response);
	})
});

app.post('/newreport', (req, res) => {
	var response = new Object();
	console.log(req.body.id);
	idModel.find()
	.then((result) => {
		var reportID = result[0].reportID;
		
		// Register new report with ID
		var report = new reportModel({
			id: req.body.id,
			report_id: reportID,
			report: req.body.report,
			date: new Date()
		});
	
		report.save()
		.then((result) => {
			response.answer = "New report registered";
			res.send(JSON.stringify(response));
		})
		.catch((err) => {
			console.log(err);
			response.answer = "Report send Failure"
		});

		// Increment ID in database
		idModel.findOneAndUpdate({reportID: result[0].reportID}, {$inc : {'reportID':1}})
		.then((result) => {
			console.log("Updated report ID");
		})
		.catch((err) => {
			console.log(err);
		})
	})
	.catch((err) => {
		console.log(err);
	})
});

app.post('/getreports', (req, res) => {
	var response = new Object();
	reportModel.find({id: req.body.customer_id})
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

app.delete('/deletereport', (req, res) => {
	var response = new Object();
	reportModel.deleteOne({request_id: req.body.report_id})
	.then((result) => {
		response.answer = "Deleted report with ID: " + req.body.report_id;
		res.send(response);
	})
	.catch((err) => {
		console.log(err);
		response.answer = "Error deleting report";
		res.send(response);
	})
});


app.use(express.static(__dirname + '/Style'));
app.use('/', express.static('pages'));

app.listen(PORT, HOST);

console.log("running");