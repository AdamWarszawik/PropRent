const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const properties = require('../controllers/properties');
const { isLoggedIn, isAuthor, validateProperty } = require('../middleware');
const multer = require('multer');
const storage = require('../cloudinary');
const upload = multer(storage);

router
	.route('/')
	.get(catchAsync(properties.index))
	.post(
		isLoggedIn,
		upload.array('image'),
		validateProperty,
		catchAsync(properties.createProperty)
	);

router.get('/new', isLoggedIn, properties.renderNewForm);

router
	.route('/:id')
	.get(catchAsync(properties.showProperty))
	.put(
		isLoggedIn,
		isAuthor,
		upload.array('image'),
		validateProperty,
		catchAsync(properties.updateProperty)
	)
	.delete(isLoggedIn, isAuthor, catchAsync(properties.deleteProperty));

router.get(
	'/:id/edit',
	isLoggedIn,
	isAuthor,
	catchAsync(properties.renderEditForm)
);

module.exports = router;
