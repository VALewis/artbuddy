//load all info
var LocalStrategy = require('passport-local').Strategy;
var pg = require('pg');
const Client = pg.Client;

// load usermodel
var User = require('../app/models/user');

module.exports = function(passport) {
    // passport session setup (required for persistent login sessions)

    // serialize user from session
    passport.serializeUser((user, done) => {
        console.log(user.id)
        done(null, user.id);
    });

    //deserialize user from session
    passport.deserializeUser((id, done) => {
        console.log(id)
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

    // local signup
    passport.use('local-signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallBack: true
        },
        function(req, email, password, done) {
            process.nextTick(() => {
                User.findOne(email, (err, isNotAvailable, user) => {
                    //check for errors
                    if (err)
                        return done(err);
                    //check if there is already user with that email
                    if (isNotAvailable == true) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {
                        console.log('new local user')
                        //create user
                        newUser = new User();
                        // set user's local credentials
                        newUser.email = req.body.email;
                        newUser.password = req.body.password;

                        //save user
                        newUser.save((newUser) => {
                            console.log('the user is:', newUser);
                            passport.authenticate()
                            return done(null, newUser);
                        })
                    }
                })
            })
        }
    ));

	// local login
	passport.use('local-login', new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallBack: true
		},
		function(req, email, password, done) {
			User.findOne({ 'local.email': email }, (err, user) => {
				// if error, return error
				if (err)
					return done(err);
				// if user not found
				else if (!user) {
					return done(null, false, req.flash('loginMessage', 'No user found.'));
				}
				// if user found, but wrong password
				else if (!user.passwordValidation(password)) {
					return done(null, false, req.flash('loginMessage', 'Wrong password, try again!'));
				}
				// all is well, return successful user
				return done(null, user);
			});
		}));
};