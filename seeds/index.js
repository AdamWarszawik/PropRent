const mongoose = require('mongoose');
const { types, descriptors } = require('./seedHelpers');
const Property = require('../models/property');
const User = require('../models/user');
const data = require('polskie-miejscowosci');
const ObjectId = require('mongodb').ObjectId;

mongoose.connect('mongodb://localhost:27017/prop-rent');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Database connected');
});

// function to get random entry from an array
const sample = (array) => array[Math.floor(Math.random() * array.length)];

// Fetch random apartment pictures
// Returns a url string
// const query = 'https://source.unsplash.com/random/100×100/?apartment';
// const getImage = async () => {
// 	await fetch(query).then((response) => {
// 		x = response.url;
// 	});
// 	return x;
// };

const imageUrl =
	'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8aG91c2V8fHx8fHwxNzEwMTE4Mjk5&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=720';
const imageUrl2 =
	'https://images.unsplash.com/photo-1529408686214-b48b8532f72c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8YXBhcnRtZW50fHx8fHx8MTcwOTkyODQ0MQ&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=720';

// Populate database with dummy data
const seedDb = async () => {
	await Property.deleteMany({});
	for (let i = 0; i < 100; i++) {
		const price = Math.floor(Math.random() * 20) + 10;
		const random1000 = Math.floor(Math.random() * 1000);
		// const imageUrl = await getImage(); // Generate different picture for every property (Very Slow)!!!
		const prop = new Property({
			author: '65ecad8333484e8c49d2fcaa',
			location: `${data[random1000].Name}, ${data[random1000].Province.charAt(
				0
			).toUpperCase()}${data[random1000].Province.slice(1)}`,
			title: `${sample(descriptors)} ${sample(types)}`,
			images: [
				{
					url: imageUrl,
					filename: 'file 1',
				},
				{
					url: imageUrl2,
					filename: 'file 2',
				},
			],
			description:
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis iste alias ullam sequi perspiciatis ipsam quia nesciunt aut! Velit, dicta.',
			price: price,
			geometry: {
				type: 'Point',
				coordinates: [data[random1000].Longitude, data[random1000].Latitude],
			},
		});
		await prop.save();
	}

	await User.deleteMany({});

	const user = new User({
		_id: new ObjectId('65ecad8333484e8c49d2fcaa'),
		email: 'admin@gmail.com',
		username: 'admin',
		salt: '0d35f19f58f64760c8f5237699eeb5556b886783e6df9a27697d020eb5205e95',
		hash: 'c644ecc53d2c843c5ee3a6e1a1937fe7fe3bff529b21927c52203ae7009ac7fb22ae255a38234e67bf7807521c9a4cb55d5de220a8bfa3b8589db1a9a64095568cc3c5f0bb18e016ca2e93ee95f9a69c41fb7f9ee327f4d99532ce2ad5f81b83cbe71f196fbcda1af8f8e1ad10011432875c92837f5400ac13c3a965835f8d27349d978916059254f79bbaba143f93a9829bd9107d9a10c2ebdbd9d16fb960799306d789e70551e47028616c8badaf26bb5b8318ffda0aa0cf3769e1dbbc555da5394c7f0c09e3f9a251a0557b52ca9307db10c253d1df659c3f23027440721e634011e2efaf233bd2ddebdb2e1151fd1db60dbf7d14b403fb5c4eec56f563e9e865dbd4bc905f49ba4f07e918469490c1cfffe8a6e8bd64b67072ffe049304060af3d9e95866d7740fa16f80faf6c7cab76a69be13a241a73013447956ec82eae4de8932ca5b10d7c69466cb25a2c07bb7c750f20952404aa57979220f932162b38b4807452242d135b937e789413fd35254d63bcb0bfceb79f903f40103e47fff96373de677d680ef3ca880b7a6d018b2fc2177edf8a01ab384e91bdc4e92a6100f713c8cf47271ee19bca1441919f1341de442336e679896133cd57a9b694ad17b96342fcb5442b4acedaccbd1611d78a4bd9d78e435402754dfb2637facaaabb52001aef0d44e548912b0caed329819a34d59be4eb1a686fc48495efa65c',
		__v: 0,
	});
	await user.save();
};

seedDb().then(() => {
	mongoose.connection.close();
});
