const Property = require('../models/property');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxToken });

// Go to index and parse all properties from database
module.exports.index = async (req, res) => {
	const properties = await Property.find({});
	res.render('properties/index', { properties });
};

// Render form to add new property
module.exports.renderNewForm = (req, res) => {
	res.render('properties/new');
};

// Add new property to databse
module.exports.createProperty = async (req, res, next) => {
	const geoData = await geocoder
		.forwardGeocode({
			query: req.body.property.location,
			limit: 1,
		})
		.send();

	const property = new Property(req.body.property);
	property.geometry = geoData.body.features[0].geometry;

	property.images = req.files.map((f) => ({
		url: f.path,
		filename: f.filename,
	}));
	property.author = req.user._id;
	await property.save();
	req.flash('success', 'Successfully added new Property');
	res.redirect(`/properties/${property._id}`);
};

// Render page about specific property
module.exports.showProperty = async (req, res) => {
	const property = await Property.findById(req.params.id)
		.populate({
			path: 'reviews',
			populate: {
				path: 'author',
			},
		})
		.populate('author');
	if (!property) {
		req.flash('error', 'Cannot find that Property');
		return res.redirect('/properties');
	}
	res.render('properties/show', { property });
};

// Render page to edit property
module.exports.renderEditForm = async (req, res) => {
	const { id } = req.params;
	const property = await Property.findById(id);
	if (!property) {
		req.flash('error', 'Cannot find that Property');
		return res.redirect('/properties');
	}
	res.render('properties/edit', { property });
};

// Handle upadting the property
module.exports.updateProperty = async (req, res) => {
	const { id } = req.params;

	const property = await Property.findByIdAndUpdate(id, {
		...req.body.property,
	});

	const imgs = req.files.map((f) => ({
		url: f.path,
		filename: f.filename,
	}));

	property.images.push(...imgs);
	await property.save();
	if (req.body.deleteImages) {
		// for (let filename of req.body.deleteImages) {
		// 	await cloudinary.uploader.destroy(filename);
		// }
		await Property.updateOne({
			$pull: { images: { filename: { $in: req.body.deleteImages } } },
		});
	}

	req.flash('success', 'Succesffuly updated Property');
	res.redirect(`/properties/${property._id}`);
};

// Delete Property
module.exports.deleteProperty = async (req, res) => {
	const { id } = req.params;
	await Property.findByIdAndDelete(id);
	req.flash('success', 'Successfully deleted Property.');
	res.redirect('/properties');
};
