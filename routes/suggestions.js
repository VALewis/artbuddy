module.exports = (app, dbSeq) => {
	app.get('/suggestions', (req, res) => {
		res.render('suggestions', {
			user: req.session.user
		});
	});
};