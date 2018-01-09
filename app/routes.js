module.exports = (app, passport) => {

	// home page with login links
	app.get("/", (req, res) => {
		res.render ('index')
	});

	// login with login form (render page and process info)
	app.get('/login', (req, res) => {
		res.render('login', {user: req.session.user},
		{message: req.flash('loginMessage')});
	});

	// app.post('/login');

	// signup with signup form (render page and process info)
	app.get('/signup', (req, res) => {
		res.render('signup', {user: req.session.user}, 
		{message: req.flash('signupMessage')});
	});
	// app.post('/signup');
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile', //will redirect to secured profile
		failureRedirect: '/signup', //will redirect back to signup page if error
		failureFlash: true // allows flash messages
	}));

	// profile (verification loggedin)
	app.get('/profile', isLoggedIn, (req, res) => {
		res.render('profile', {
			user: req.session.user // get the user out of session and pass to template
		});
	});

	// logout
	app.get('/logout', (req, res) => {
		req.session.destroy();
		req.logout();
		res.redirect('/');
	});
};

// route middleware verification isLoggedIn
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated())
		return next();
	//if user not authenticated redirect to home page
	res.redirect('/');
}