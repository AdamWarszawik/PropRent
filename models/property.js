const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
	url: String,
	filename: String,
});

// Smaller thumbnails for deletion
ImageSchema.virtual('thumbnail').get(function () {
	return this.url.replace('&w=500', '&w=150');
});

const opts = { toJSON: { virtuals: true } };

const PropertySchema = new Schema(
	{
		title: String,
		images: [ImageSchema],
		geometry: {
			type: {
				type: String,
				enum: ['Point'],
				required: true,
			},
			coordinates: {
				type: [Number],
				required: true,
			},
		},
		price: Number,
		description: String,
		location: String,
		author: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		reviews: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Review',
			},
		],
	},
	opts
);

// Popup on the cluster map links to show page
PropertySchema.virtual('properties.popupMarkup').get(function () {
	return `<h3><a href="/properties/${this._id}">${this.title}</a></h3>
	<p>${this.description.substring(0, 50)}...</p>
	`;
});

PropertySchema.post('findOneAndDelete', async function (doc) {
	if (doc) {
		await Review.deleteMany({
			_id: {
				$in: doc.reviews,
			},
		});
	}
});

module.exports = mongoose.model('Property', PropertySchema);
