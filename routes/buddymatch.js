const MultiRange = require('multi-integer-range').MultiRange;

module.exports = (app, dbSeq) => {
	app.get('/buddymatch', (req, res) => {
		var age = req.session.user.age;
		console.log(age)
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

		dbSeq.Agepref.findAll({
			where: rangeObject, 
			include: [{ model: dbSeq.User }]
		}).then((results) => {
			console.log('results', results[0].dataValues.user_account.dataValues)
			for(i = 0; i < results.length; i ++) {
			console.log(results[i].dataValues.user_account.dataValues.age)
			// console.log('results', results[1].dataValues.user_account.dataValues.age)
				// JSON.parse(results.dataValues.user_account))
			}
			// dbSeq.User.findAll({
			// 	where:
			// })
		})
		res.render('buddymatch', {
			user: req.session.user
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

// let age = 26
// let age = results.dataValues.user_account.age

// get session.user.Agepref --> put in let rangePref
// get match users' age and put in var --> let age = results.dataValues.user_account.age
// loop through ageArray, see if age is present --> if so, push to array
// give users which match

let rangePref = '20-30'
let ageRange = new MultiRange(rangePref);
let ageArray = ageRange.toArray();
console.log(ageArray);
