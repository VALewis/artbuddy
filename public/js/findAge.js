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
var age = req.body.age
var theRange = []
theRange.push(findAgeRange(age))

console.log(theRange);

// User.findAll({
// 	where: {
// 		Agepref: theRange
// 	}
// })