// signup with signup form (render page and process info)
const bcrypt = require('bcrypt')

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
		console.log(req.body)  
		const saltRounds = 10;
	    var password = req.body.password
	    //check to see if email is already used
	    
		client.query(`SELECT * from user_accounts WHERE email = '${req.body.email}'`)
		.then((result)=> {
			if (result.rows.length > 0) {
				debugger
				res.status(200).send({ message: 'The email address is already in use' })
			} 
			else {
				// email is new: save new user in database with hashed pw
				bcrypt.hash(password, saltRounds, (err, hash) => {
					if(err) throw err
					client.query(`INSERT INTO user_accounts (fullname, email, password, age, gender)
						VALUES ('${req.body.fullname}', '${req.body.email}', '${hash}', '${req.body.age}', '${req.body.gender}') 
						RETURNING id;`)
					.then((result2) => {
						//save user's interests in database
						client.query(`INSERT INTO user_interests (hobby, interests, cultcard, talkratio, agerange,
							gendermatch, languages, user_id)						
							VALUES ('${req.body.hobby}', '${JSON.stringify(req.body.interests)}', 
							'${JSON.stringify(req.body.cultcard)}','${JSON.stringify(req.body.talkratio)}', 
							'${JSON.stringify(req.body.agerange)}', '${JSON.stringify(req.body.gendermatch)}', 
							'${JSON.stringify(req.body.languages)}', '${result2.rows[0].id}')
							RETURNING user_id;`)
						.then((result3) => {
							//save session info and redirect to profile route
							console.log('Account created')
							req.session.user = result3.rows[0].id,
							res.redirect('profile')
						})
						.catch(e=> {
							throw e
						})
					});
				})
			}						
		}).catch(e=> {
			throw e
		})
	})
}

/*INSERT INTO user_accounts (fullname, email, password, age, gender)
		VALUES ('${req.body.fullname}', '${req.body.email}', '${hash}', '${req.body.age}', '${req.body.gender}') 
		RETURNING id AS userId
	, 
INSERT INTO user_interests (hobby, interests, cultcard, talkratio, agerange, gendermatch, languages, user_id)
	VALUES ('${req.body.hobby}', '${JSON.stringify(req.body.interests)}', '${JSON.stringify(req.body.cultcard)}', '${JSON.stringify(req.body.talkratio)}', '${JSON.stringify(req.body.agerange)}', '${JSON.stringify(req.body.gendermatch)}', '${JSON.stringify(req.body.languages)}', userId)
/**/
/*
									WITH data (fullname, email, password, age, gender, hobby, interests, cultcard, talkratio, agerange, gendermatch, languages, user_id) AS (
								VALUES ('${req.body.fullname}', '${req.body.email}', '${hash}', '${req.body.age}', '${req.body.gender}', '${req.body.hobby}', '${JSON.stringify(req.body.interests)}', '${JSON.stringify(req.body.cultcard)}', '${JSON.stringify(req.body.talkratio)}', '${JSON.stringify(req.body.agerange)}', '${JSON.stringify(req.body.gendermatch)}', '${JSON.stringify(req.body.languages)}'))
								, ins1 AS (
									INSERT INTO user_accounts (fullname, email, password, age, gender)
									SELECT fullname, email, password, age, gender FROM data
									RETURNING id AS user_id
								), ins2 AS (
									INSERT INTO user_interests (hobby, interests, cultcard, talkratio, agerange, gendermatch, languages, user_id)
									SELECT hobby, interests, cultcard, talkratio, agerange, gendermatch, languages, user_id FROM data
									JOIN ins1 USING (email, user_id)
								)*/