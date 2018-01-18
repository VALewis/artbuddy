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
							profileImage: user.dataValues.profile_img,
							// hobby: user.user_interest.dataValues.hobby,
							// cultinterests: user.cultural_interests.dataValues.interests,	
							// cultcard: user.user_interest.dataValues.cultcard,
							// talkratio: user.user_interest.dataValues.talkratio,
							// agerange: user.user_interest.dataValues.agerange,
							// gendermatch: user.user_interest.dataValues.gendermatch,
							// languages: user.user_interest.dataValues.languages
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