// home page with login links and form (render page and process info)
const bcrypt = require('bcrypt')

module.exports = (app, client) => {
	app.get('/', (req, res) => {
	    res.render('index', {
	    	session: req.session.user
		});
	});
	app.post('/', function(req, res) {
		console.log(req.body.email)
		client.query(`SELECT * from user_accounts WHERE email = '${req.body.email}'`, (err, result) => {
			console.log(result)
			if (err) throw (err)
			else {
				if (result.rows.length === 0){
					console.log('Specified user does not exist')
				}
				else {
					console.log('Specified user exists', result.rows)
					bcrypt.compare(req.body.password, result.rows[0].password, (err, query) => {
						if (query) {
							req.session.user = {
								fullname: result.rows[0].fullname,
								email: result.rows[0].email,
								id: result.rows[0].id
							},
							res.redirect('/profile')
						}
						else {							
							res.redirect('/')}							
					});
				};
			};
		});
	});
};