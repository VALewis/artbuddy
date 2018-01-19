const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _ = require('lodash');

module.exports = (app, dbSeq) => {
	app.get('/buddymatch', (req, res) => {
		// let useragePref = {}
		let user = req.session.user
		var age = req.session.user.age;
		console.log(age)
		// console.log(req.session.user.dataValues.age_pref.age_pref.dataValues)
		dbSeq.User.findOne({
			where: { email: req.session.user.email },
			include: { 
				model: dbSeq.Agepref,
				where: {
						userAccountId: req.session.user.id
				}
			}
		}).then((results1) => {
			debugger
			console.log('results1', results1)
			let useragePref = results1.age_pref.dataValues

			let ageArray = []
			function ageRange(useragePref) {				
				debugger
				if(useragePref["20-30"]) ageArray.push(..._.range(20, 30))
				if(useragePref["31-40"]) ageArray.push(..._.range(30, 40))
				if(useragePref["41-50"]) ageArray.push(..._.range(40, 50))
				if(useragePref["51-60"]) ageArray.push(..._.range(50, 60))
				if(useragePref["61-70"]) ageArray.push(..._.range(60, 70))
				if(useragePref["71-80"]) ageArray.push(..._.range(70, 80))
				if(useragePref["81-90"]) ageArray.push(..._.range(80, 90))     
				return ageArray
				debugger
			};

			ageRange(useragePref)
			console.log('ageArray', ageArray)
			
			function findAgeRange(age) {
				if (age > 19 && age < 31) {
					return '20-30'
				} else if (age > 30 && age < 41) {
					return '31-40'
				} else if (age > 40 && age < 51) {
					return '41-50'
				} else if (age > 50 && age < 61) {
					return '51-60'
				} else if (age > 60 && age < 71) {
					return '61-70'
				} else if (age > 70 && age < 81) {
					return '71-80'
				} else if (age > 80 && age < 91) {
					return '81-90'
				}	
			};
			let rangeObject = {}
			rangeObject[findAgeRange(age)] = true

			let userId = { id: req.session.user.id }
			console.log(userId)
			dbSeq.Agepref.findAll({
				where: rangeObject, 
				include: [{ 
					model: dbSeq.User, 
					where: {
						age: [...ageArray],
						[Op.not]: userId
					}
				}]
			}).then((results2) => {
				console.log('results2', results2)
				let matches = []
				for (var i = 0; i < results2.length; i++) {
					matches.push(results2[i].dataValues.user_account.dataValues)
				}
				console.log('matches', matches)

				let idMatches = []
				for (var i = 0; i < matches.length; i++) {
					idMatches.push(matches[i].id)
				}
				console.log('idMatches', idMatches)
				let usersId = { id: idMatches}
				dbSeq.User.findAll({
					where: {
							id: idMatches							
						},
					include: [
						{ model: dbSeq.Cultcard },
						{ model: dbSeq.Cultinterests },
						{ model: dbSeq.Talkratio },
						{ model: dbSeq.Languages }
					]
				}).then((results3) => {
				console.log('results3 userinfo', results3[0].dataValues)
				let buddymatches = []
				for (var i = 0; i < results3.length; i++) {
					buddymatches.push(results3[i].dataValues)
				}
				console.log('buddymatches', buddymatches)
				req.session.user.matches = buddymatches;				
				res.render('buddymatch', {
					user: user,
					buddymatches: buddymatches
					});
				});
			});
		});
	});
};