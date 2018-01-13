// profile page with buddy matches (render page and process info)
module.exports = (app, client) => {
	app.get('/profile', (req, res) => {
	    res.render('profile', {
	    	session: req.session.user
		});
	});
	// app.post('/profile', function(req, res) {
	// 	client.query(`SELECT * from user_accounts WHERE email = '${req.body.email}'`, (err, result) => {
	// 		if (err) throw (err)
};