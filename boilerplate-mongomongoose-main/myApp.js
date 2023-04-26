require('dotenv').config();

// Set Up Mongoose
const mongoose = require('mongoose');
// Default port	( 27017 ) --> mongoose.connect('mongodb://localhost:27017/myapp');
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
		done(null, data)
	});
};

const createManyPeople = (arrayOfPeople, done) => {
	done(null /*, data*/);
};

const findPeopleByName = (personName, done) => {
	done(null /*, data*/);
};

const findOneByFood = (food, done) => {
	done(null /*, data*/);
};

const findPersonById = (personId, done) => {
	done(null /*, data*/);
};

const findEditThenSave = (personId, done) => {
	const foodToAdd = "hamburger";

	done(null /*, data*/);
};

const findAndUpdate = (personName, done) => {
	const ageToSet = 20;

	done(null /*, data*/);
};

const removeById = (personId, done) => {
	done(null /*, data*/);
};

const removeManyPeople = (done) => {
	const nameToRemove = "Mary";

	done(null /*, data*/);
};

const queryChain = (done) => {
	const foodToSearch = "burrito";

	done(null /*, data*/);
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
