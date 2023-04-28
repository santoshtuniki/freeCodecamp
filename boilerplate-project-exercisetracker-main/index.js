const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())

// require 'body-parser'
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// require 'mongoose'
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

// user schema & user model
const userSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true
	}
}, { versionKey: '' })
const User = mongoose.model('User', userSchema);

// exercise schema & exercise model
const exerciseSchema = new mongoose.Schema({
	username: String,
	description: String,
	duration: Number,
	date: Date,
	userId: String
}, { versionKey: '' });
const Exercise = mongoose.model('Exercise', exerciseSchema);

app.use(express.static('public'))

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/views/index.html')
});

// create a new user
app.post('/api/users', async (req, res) => {
	const { username } = req.body;
	const foundUser = await User.findOne({ 'username': username });
	if (foundUser) {
		res.json(foundUser);
	}
	const user = await User.create({ 'username': username })
	// returns a response that's an object with username and _id properties
	res.json(user);
});

// get a list of all users
app.get('/api/users', async (req, res) => {
	const users = await User.find();
	res.json(users);
});

// add exercise fields
app.post('/api/users/:_id/exercises', async (req, res) => {
	const userId = req.params._id;
	let { description, duration, date } = req.body;
	// find user by userId
	const foundUser = await User.findById(userId);

	// If no user exists with that id
	if (!foundUser) {
		res.json({ error: "No user exists with that id" })
	}

	// If no date is supplied, the current date will be used
	if (!date) {
		date = new Date();
	} else {
		date = new Date(date);
	}

	// add exercise of user to collection
	await Exercise.create({
		username: foundUser.username,
		description: description,
		duration: Number(duration),
		date: date,
		userId: userId
	});

	// The response is a user object with the exercise fields added
	res.json({
		username: foundUser.username,
		description: description,
		duration: Number(duration),
		date: date.toDateString(),
		_id: userId
	});
});

// retrieve a full exercise log of any user 
app.get('/api/users/:_id/logs', async (req, res) => {
	let { from, to, limit } = req.query;
	const userId = req.params._id;
	// find user by userId
	const foundUser = await User.findById(userId);

	// If no user exists with that id
	if (!foundUser) {
		res.json({ error: "No user exists with that id" })
	}

	let filter = { userId };
	let dateFilter = {};
	if (from) {
		dateFilter['$gte'] = new Date(from);
	}
	if (to) {
		dateFilter['$lte'] = new Date(to);
	}
	if (from || to) {
		filter.date = dateFilter;
	}

	if (!limit) {
		limit = 100;
	}

	// find exercises by filter
	let exercises = await Exercise.find(filter).limit(limit);
	exercises = exercises.map(exercise => {
		return {
			description: exercise.description,
			duration: exercise.duration,
			date: exercise.date.toDateString()
		}
	});

	/*
		returns a user object with a "count" property representing the number of exercises that belong to that user,
		return the user object with a "log" array of all the exercises added,
		Each item in the log array is an object that should have a "description, duration, and date" properties.
	*/
	res.json({
		username: foundUser.username,
		count: exercises.length,
		_id: userId,
		log: exercises
	});
});

const listener = app.listen(process.env.PORT || 3000, () => {
	console.log('Your app is listening on port ' + listener.address().port)
});