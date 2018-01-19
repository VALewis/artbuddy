// profile page with buddy matches (render page and process info)
const fs = require('fs');
const async = require('async');

module.exports = (app, client) => {
	app.get('/connect', (req, res) => {
		let cultEvents = {
			exhibitFile: async.apply(fs.readFile, 'databases/JSON/tentoonstellingen.json'),
			theatreFile: async.apply(fs.readFile, 'databases/JSON/theater.json')
		};
		async.parallel(cultEvents, (error, results) => {
			if (error) throw error
			exhibits = JSON.parse(results['exhibitFile']);
			theatre = JSON.parse(results['theatreFile']);
			res.render('connect', {
				exhibits: exhibits,
				theatre: theatre,
				user: req.session.user,
				buddymatches: req.session.user.matches
			});
		});
	});
	app.post('/connect', (req, res) => {
		dbSeq.Suggestion.create({
			timedate: req.body.timedate,
			type: req.body.type,
			eventname: req.body.eventname,
			location: req.body.location,
			url: req.body.url,
			userAccountId: req.session.user.id
		}).then(data => {
			console.log('data', data)
		// give session the user_account info and include cultural interests
			return dbSeq.User.findOne({
				where: { id: data.userAccountId }
			}) 
		}).then((user) => {
			console.log('user', user)
			//signup successful, user is redirected to secured profile route
			req.session.user = user
			res.redirect('/profile')
		});			
	});
};