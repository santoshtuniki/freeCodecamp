let express = require('express');
let app = express();

// "dotenv" loads environment variables from your .env file into process.env
require('dotenv').config();

// Make sure it comes before the paths it needs to be used on.
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());	// To parse JSON data sent via POST request
// The data received in the request is available in the "req.body" object.

// Root-Level Request Logger Middleware
app.use(function (req, res, next) {
	console.log(req.method + " " + req.path + " - " + req.ip);
	next();
})

// Serve an HTML file
app.get("/", function (req, res) {
	res.sendFile(__dirname + "/views/index.html");
})

// Serve Static Assets -> app.use(path, middlewareFunction)
app.use("/public", express.static(__dirname + "/public"))

// Serve JSON on a Specific Route
app.get("/json", function (req, res) {
	// Access environment variables
	const mySecret = process.env['MESSAGE_STYLE'];
	const obj = { "message": "Hello json" };
	if (mySecret === "uppercase") {
		obj["message"] = obj["message"].toUpperCase();
	} else if (mySecret === "lowercase") {
		obj["message"] = obj["message"].toLowerCase();
	}
	res.json(obj)
})

// Middleware chained within a route definition
app.get("/now", function (req, res, next) {
	req.time = new Date().toString();
	next();
}, function (req, res) {
	res.json({ time: req.time });
})

// Get Route Parameter Input from the Client
app.get("/:word/echo", function (req, res) {
	let word = req.params.word;
	res.json({ echo: word });
})

// Get Query Parameter Input from the Client
app.get("/name", function (req, res) {
	let firstname = req.query.first;
	let lastname = req.query.last;
	res.json({ name: firstname + " " + lastname });
})

// Get Data from POST Requests
app.post("/name", function (req, res) {
	const string = req.body.first + " " + req.body.last;
	res.json({ name: string });
})

module.exports = app;