const Property = require('../models/property');
const Review = require('../models/review');

// Handle creating review
module.exports.createReview = async (req, res) => {
	const property = await Property.findById(req.params.id); // Property the review belongs to
	const review = new Review(req.body.review); // Create the review
	review.author = req.user._id; // Set author to the user
	property.reviews.push(review); // Add review to property listing
	await review.save();
	await property.save();
	req.flash('success', 'Successfully added review.');
	res.redirect(`/properties/${property._id}`);
};

// Handle deleting review
module.exports.deleteReview = async (req, res) => {
	const { id, reviewId } = req.params;
	await Property.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
	await Review.findByIdAndDelete(reviewId);
	req.flash('success', 'Successfully deleted review.');

	res.redirect(`/properties/${id}`);
};
