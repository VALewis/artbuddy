// signup with signup form (render page and process info)

const multer = require('multer'); 
const upload = multer({ dest: '../public/img/user_images/' });

module.exports = (app, dbSeq, bcrypt) => {
	app.get('/signup', (req, res) => {
		res.render('signup')
	});
	app.post('/signup', upload.single('profileImage'), (req, res, next) => {
		const saltRounds = 10;
		var image = req.body.profileImage;
		var email = req.body.email;
		var password = req.body.password;
		
		//check to see if email is already used
		dbSeq.User.findOne({
			where: { email: email }
		}).then((user) => {
			if(user !== null) {
				console.log('email already taken')
				res.redirect('/?message=' + encodeURIComponent('This email address is in use, please login.'));
			} else {
			// email is new: save new user in database with hashed pw
				bcrypt.hash(password, saltRounds, (err, hash) => {
					// first: user's personal info
					dbSeq.User.create({
						fullname: req.body.fullname,
						email: email,
						password: hash,
						age: req.body.age,
						gender: req.body.gender,
						profile_img: image
					}).then((userAccount) => {					
						// second: user's cultural interests
						return dbSeq.Cultinterests.create({
							art: req.body.art,
							dance: req.body.dance,
							theatre: req.body.theatre,
							music: req.body.music,
							user_id: userAccount.dataValues.id
						})
					}).then((userInterests) => {
						//third: user's cultural cards
						console.log('user interests', userInterests)
						return dbSeq.Cultcard.create({
							museumcard: req.body.museumcard,
							musicabo: req.body.musicabo,
							wap: req.body.wap,
							indie4t: req.body.indie4t,
							stadspas: req.body.stadspas,
							cineville: req.body.cineville,
							user_id: userInterests.dataValues.user_id
						})						
					}).then((userCultcard) => {
						// fourth: user's talkratio
						console.log('user cultcard', userCultcard)
						return dbSeq.Talkratio.create({
							bla: req.body.bla,
							blabla: req.body.blabla,
							blablabla: req.body.blablabla,
							user_id: userCultcard.dataValues.user_id
						})
					}).then((userTalkratio) => {
						// fifth: user's age preference
						console.log('user talkratio', userTalkratio)
						return dbSeq.Agepref.create({
							'20-30': req.body.twenthir,
							'31-40': req.body.thirfour,
							'41-50': req.body.fourfif,
							'51-60': req.body.fifsix,
							'61-70': req.body.sixsev,
							'71-80': req.body.seveigt,
							'81-90': req.body.eigtnin,
							user_id: userTalkratio.dataValues.user_id
						})
					}).then((userAgepref) => {
						// sixth: user's gender preference
						console.log('user agepref', userAgepref)
						return dbSeq.Genderpref.create({
							male: req.body.male,
							female: req.body.female,
							transgender: req.body.transgender,
							user_id: userAgepref.dataValues.user_id
						})
					}).then((userGenderpref) => {
						// seventh: user's languages
						console.log('user genderpref', userGenderpref)
						return dbSeq.Languages.create({
							dutch: req.body.dutch,
							english: req.body.english,
							german: req.body.german,
							french: req.body.french,
							spanish: req.body.spanish,
							italian: req.body.italian,
							russian: req.body.russian,
							arabic: req.body.arabic,
							user_id: userGenderpref.dataValues.user_id
						})
					}).then(data => {
					// give session the user_account info and include cultural interests
						return dbSeq.User.findOne({
							where: { email: email }
						}) 
					}).then((user) => {
						console.log('user end', user)
						//signup successful, user is redirected to secured profile route
						req.session.user = user
						res.redirect('profile')
					})				
				}).catch(e=> {
					throw e
				})
			}
		})
	})
}

// 		client.query(`SELECT * from user_accounts WHERE email = '${req.body.email}'`)
// 		.then((result)=> {
// 			if (result.rows.length > 0) {
// 				debugger
// 				res.status(200).send({ message: 'The email address is already in use' })
// 			} 
// 			else {
				
// 				bcrypt.hash(password, saltRounds, (err, hash) => {
// 					if(err) throw err
// 					client.query(`INSERT INTO user_accounts (fullname, email, password, age, gender)
// 						VALUES ('${req.body.fullname}', '${req.body.email}', '${hash}', '${req.body.age}', '${req.body.gender}') 
// 						RETURNING id;`)
// 					.then((result2) => {
// 						//save user's interests in database
// 						client.query(`INSERT INTO user_interests (hobby, interests, cultcard, talkratio, agerange,
// 							gendermatch, languages, user_id)						
// 							VALUES ('${req.body.hobby}', '${JSON.stringify(req.body.interests)}', 
// 							'${JSON.stringify(req.body.cultcard)}','${JSON.stringify(req.body.talkratio)}', 
// 							'${JSON.stringify(req.body.agerange)}', '${JSON.stringify(req.body.gendermatch)}', 
// 							'${JSON.stringify(req.body.languages)}', '${result2.rows[0].id}')
// 							RETURNING user_id;`)
// 						.then((result3) => {
// 							//save session info and redirect to profile route
// 							console.log('Account created')
// 							req.session.user = result3.rows[0].id,
// 							res.redirect('profile')
// 						})
// 						.catch(e=> {
// 							throw e
// 						})
// 					});
// 				})
// 			}						
// 		}).catch(e=> {
// 			throw e
// 		})
// 	})
// }

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