require('dotenv').config();

// Set Up Mongoose
const mongoose = require('mongoose');
// Default port	( 27017 ) --> mongoose.connect('mongodb://localhost:27017/personDB');
const mySecret = process.env['MONGO_URI'];
mongoose.connect(mySecret, { useNewUrlParser: true, useUnifiedTopology: true });

// Create a Model ( CRUD Part I - CREATE )
// Each schema defines the shape of the "documents" within that collection and maps to a MongoDB collection. 
const personSchema = new mongoose.Schema({
	name: String,
	age: Number,
	favoriteFoods: [String]
});
// A model allows you to create instances of your objects, called 'documents'.
let Person = mongoose.model('Person', personSchema);

// Create and Save a Record of a Model
const createAndSavePerson = (done) => {
	const john = new Person({
		name: 'John',
		age: 26,
		favoriteFoods: ["Biryani", "Tomato", "Brinjal"]
	});
	john.save(function (err, data) {
		if (err) return console.error(err);
		console.log(data);
		done(null, data)
	});
};

// Create Many Records with Model.create()
const createManyPeople = (arrayOfPeople, done) => {
	Person.create(arrayOfPeople, function (err, data) {
		if (err) return console.error(err);
		done(null, data)
	})
};

// Use Model.find() to Search Your Database
const findPeopleByName = (personName, done) => {
	Person.find({ name: personName }, function (err, data) {
		if (err) return console.log(err);
		done(null, data)
	})
};

// Use Model.findOne() to Return a Single Matching Document from Your Database
const findOneByFood = (food, done) => {
	Person.findOne({ favoriteFoods: food }, function (err, data) {
		if (err) return console.log(err);
		done(null, data)
	})
};

// Use model.findById() to Search Your Database By _id
const findPersonById = (personId, done) => {
	Person.findById(personId, function (err, data) {
		if (err) return console.log(err);
		done(null, data)
	})
};

// Updates by Running Find, Edit, then Save
const findEditThenSave = (personId, done) => {
	const foodToAdd = "hamburger";
	Person.findById(personId, (err, person) => {
		person.favoriteFoods.push(foodToAdd);
		person.save((err, updatedPerson) => {
			if (err) return console.log(err);
			done(null, updatedPerson)
		})
	})
};

// Updates on a Document Using model.findOneAndUpdate()
const findAndUpdate = (personName, done) => {
	const ageToSet = 20;
	Person.findOneAndUpdate({ name: personName }, { age: ageToSet }, { new: true }, (err, data) => {
		if (err) return console.log(err);
		done(null, data)
	});
};

// Delete One Document Using model.findByIdAndRemove()
const removeById = (personId, done) => {
	Person.findByIdAndRemove(personId, function (err, data) {
		if (err) return console.log(err);
		console.log(data);
	})

};

// Delete Many Documents with model.remove()
const removeManyPeople = (done) => {
	const nameToRemove = "Mary";

	done(null /*, data*/);
};

// Chain Search Query Helpers to Narrow Search Results
const queryChain = (done) => {
	const foodToSearch = "burrito";
	let query = Person.find({ favoriteFoods: foodToSearch }).sort({ name: 'asc' }).limit(2);
	query.select('-age').exec(function (err, data) {
		if (err) throw err;
		done(null, data);
	});
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
