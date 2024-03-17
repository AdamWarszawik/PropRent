const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
});

// Passport plugin that will add username and password with salt and hash
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
