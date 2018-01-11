// signup with signup form (render page and process info)
const bcrypt = require('bcrypt')
const saltRounds = 10;

module.exports = (app, client) => {
	app.get('/signup', (req, res) => {
		if(req.session.user) {
			res.status(200).send({message: 'You are already logged in'})
		} else {
		    res.render('signup', {
				session: req.session.user
			})
		}
	})
	app.post('/signup', (req, res) => {
		console.log('Account created')
	    console.log(req.body)
	    var password = req.body.password
	    // var userId = req.session.user.id
	    console.log(req.session.user)
	    // console.log('userid', userId)
	    //check to see if email is already used
		client.query(`SELECT * from user_accounts WHERE email = '${req.body.email}'`, (err, result) => {
			if (err) throw (err)
				else { 
					// email is taken
					if (result.rows.length > 0) {
					res.status(200).send({ message: 'The email address is already in use' })
					} else {
					// email is new: save new user in database with hashed pw
						bcrypt.hash(password, saltRounds, (err, hash) => {
							if(err) throw err
							client.query(`
								INSERT INTO user_accounts (fullname, email, password, age, gender) 
								VALUES ('${req.body.fullname}', '${req.body.email}', '${hash}', '${req.body.age}', '${req.body.gender}'); 
								INSERT INTO user_interests (hobby, interests, cultcard, talkratio, agerange, gendermatch, languages, user_id) 
								VALUES ('${req.body.hobby}', '${JSON.stringify(req.body.interests)}', '${JSON.stringify(req.body.cultcard)}', '${JSON.stringify(req.body.talkratio)}', '${JSON.stringify(req.body.agerange)}', '${JSON.stringify(req.body.gendermatch)}', '${JSON.stringify(req.body.languages)}', '${10}')`, 
								(err, result) => {
								if (err) throw (err)
								else  {
								res.redirect('login')
								};
							});
						});						
					};
				};			
		});
	});
};