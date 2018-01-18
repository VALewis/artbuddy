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
						user_id: req.session.user.id
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
				// for (var i = 0; i < results2.length; i++) {
				// 	return results2[i].dataValues.user_account.dataValues
				// }
				let buddymatching = results2[0].dataValues.user_account.dataValues
				console.log(buddymatching)
				res.render('buddymatch', {
					user: user,
					buddymatching: buddymatching
				});
			});

		});
	});
};


// function ageMatch(rangePref) {
// 	if (rangePref '20-30') {
// 		for (var i = 0; i > 19; i++) {
// 			Things[i]
// 		}
// 	}
// }


// dbSeq.User.findOne({
// 	where: 
// })
// get session.user.Agepref --> put in let rangePref
// get match users' age and put in var --> let age = results.dataValues.user_account.age
// loop through ageArray, see if age is present --> if so, push to array
// give users which match

// let rangePref = '20-30'
// let ageRange = new MultiRange(rangePref);
// let ageArray = ageRange.toArray();
// console.log(ageArray);


// spread operator: [...]
// array in array


// exclude own age from list
// exclude
// where id: {[Op.not]}

/////////////////////

// dbSeq.User.findOne({
// 	where email: req.session.user.email,
// 	include: { model: Agepref },
// }).then((results) => {
// 	console.log(results)
// })

// let rangePref = user.agepref
// let ageRange = new MultiRange(rangePref);
// let ageArray = ageRange.toArray();

// dbSeq.Agepref.findAll(
// 	where rangeObject,  
// 	include: model User,
// 	where age: [...ageArray]),
// 	exclude where id: {[Op.not] req.session.id}