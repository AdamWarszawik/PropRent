const User = require('../models/user');

// Render register form
module.exports.renderRegister = (req, res) => {
	res.render('users/register');
};

// Handle registering
module.exports.register = async (req, res, next) => {
	try {
		const { email, username, password } = req.body;
		const user = new User({ email, username });
		const registeredUser = await User.register(user, password);
		req.login(registeredUser, (err) => {
			if (err) return next(err);
			req.flash('success', 'Welcome to PropRent');
			res.redirect('/properties');
		});
	} catch (e) {
		req.flash('error', e.message);
		res.redirect('/register');
	}
};

// Render login page
module.exports.renderLogin = (req, res) => {
	res.render('users/login');
};

module.exports.login = (req, res) => {
	req.flash('success', 'Welcome back');
	const redirectUrl = res.locals.returnTo || '/properties';
	delete req.session.returnTo;
	res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		req.flash('success', 'Logged out successfully!');
		res.redirect('/properties');
	});
};
