// profile page with buddy matches (render page and process info)
module.exports = (app, client) => {
	app.get('/profile', (req, res) => {
		res.render('profile', {
			user: req.session.user
		});
	});
};