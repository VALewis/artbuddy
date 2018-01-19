// home page with login links and form (render page and process info)
module.exports = (app, dbSeq, bcrypt) => {
	app.get('/', (req, res) => {
		res.render('index', {
			user: req.session.user
		});
	});
	app.post('/', (req, res) => {
		var email = req.body.email
		var password = req.body.password

		dbSeq.User.findOne({
			where: { email: email },
			include: [{
				model: dbSeq.Cultinterests
			}]
		}).then((user) => {
			if(user !== null) {
				bcrypt.compare(password, user.password, (err, query) => {
					if (query) {				
						req.session.user = {
							id: user.dataValues.id,
							fullname: user.dataValues.fullname,
							email: user.dataValues.email,
							age: user.dataValues.age,
							profileImage: user.dataValues.profile_img
						};
						console.log('specified user exists', req.session.user)
						res.redirect('/profile');
					} else {
						console.log('wrong entries')
						res.redirect('/?message=' + encodeURIComponent('Unsuccessful login, please try again.'));
					}	
				})
			} else {
				console.log('specified user does not exist')
				res.redirect('/?message=' + encodeURIComponent('This user does not exist, please sign up.'))
			}
		}).catch(e => {
			throw e
		});
	});		
};