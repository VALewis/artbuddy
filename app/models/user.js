var bcrypt = require('bcrypt-nodejs');
const pg = require('pg');
const Client = pg.Client

const client = new Client({
  user: process.env.appUser,
  host: process.env.host,
  password: process.env.password,
  database: process.env.database,
  webport: process.env.webport,
  port: 5432
});

client.connect();
function User(){
	this.id = '';
	this.fullname ='';
	this.email = '';
	this.username = '';
	this.password = '';
	this.age = '';
	this.gender = '';
	this.save = (callback) => {
		// calling the 'save function' to object USER initiates insert query which will save it into the database
		bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(req.body.password, salt, function(err, hash) {
				client.query(`SELECT * from user_profiles WHERE email = '${req.body.email}';`, (err, result) => {
					if (err) {
						return callback(null);
					}
					else { 
						if (result.rows.length > 0){
						console.log("email is already in use")
						} else if (result.rows.length === 0){
								client.query(`INSERT INTO user_profiles (fullname, email, username, password, age, gender) VALUES ('${this.fullname}', '${this.email}', '${this.username}', '${this.password}', '${this.age}', '${this.gender}');`, (err, result) => {
									if (err) throw (err)
									else {	
										var user = new User();
										user.fullname= result.rows[0].fullname;
										user.email= result.rows[0].email;
										user.username= result.rows[0].username;
										user.password = result.rows[0].password;
										user.age= result.rows[0].age;
										console.log(user.email);
										return callback(user);
									}
								})
							}
					}					
				})
			})
		})
	}
};


// checking if password is valid
User.passwordValidation = (password, callback) => {
	client.query(`SELECT * from user_profiles WHERE email = '${req.body.email}'`, (err, result) => {
		if (err) console.log(err)
		else {
			if (result.rows.length == 0){
				console.log("can't find user")
			}
			else {
				console.log("user found", result)
				bcrypt.compare(req.body.password, result.rows[0].password, (err, resultQuery) => {
					if (resultQuery) {
						req.session.user = {
							name: result.rows[0].name,
							email: result.rows[0].email
						}
						return callback(null, user);
					} else {
						return callback(err, null);
					}
				})
			}
		}
	})
};

// module to find user by id passport serialize
User.findById = function(id, callback){
    client.query(`SELECT * from user_profiles where id='${this.id}'`, (err, result) => {
        if(err){
            return callback(err, null);
        }
        if (result.rows.length > 0){
            var user = new User();
            user.email= result.rows[0].email;
            user.password = result.rows[0].password;
            user.id = result.rows[0].id;
            console.log(user.email);
            return callback(null, user);
        }
    });
};

User.findOne = function(email, callback) {
	var isNotAvailable = false;
	console.log(email);
	client.query(`SELECT * from user_profiles where email='${this.email}'`, (err, result) => {
        if(err){
            return callback(err, isNotAvailable, this);
        }
        if (result.rows.length > 0){
            isNotAvailable = true;
            console.log(email + 'is not available')
        } else {
        	isNotAvailable = false;
            console.log(email + 'is available');
        } 
        return callback(false, isNotAvailable, this);
    })
};

module.exports = User;

// // generating a hash
// bcrypt.genSalt(10, function(err, salt) {
// 		bcrypt.hash(req.body.password, salt, function(err, hash) {
// 			client.query(`SELECT * from user_profiles WHERE email = '${req.body.email}';`, (err, result) => {
// 			if (err) console.log(err)
// 			else { 
// 				if (result.rows.length !== 0){
// 				console.log("email is already in use")
// 				res.redirect("login")
// 				}
// 				else {
// 					const query2 = {text: `INSERT INTO user_profiles (fullname, email, username, password, age, gender) VALUES ('${req.body.fullname}', '${req.body.email}', '${req.body.username}', '${hash}', '${req.body.age}', '${req.body.gender}');`}
// 					console.log("email address is free")
// 					client.query(query2, (err, result) => {
// 						if (err) throw (err)
// 						else  {	
// 						res.redirect("profile")
// 						}
// 					})
// 				}
// 			}
// 		})
// 	})
// });

// // checking if password is valid
// client.query(`SELECT * from user_profiles WHERE email = '${req.body.email}';`, (err, result) => {
// 	if (err) console.log(err)
// 	else {
// 		if (result.rows.length == 0){
// 			console.log("can't find user")
// 		}
// 		else {
// 			console.log("user found", result)
// 			bcrypt.compare(req.body.password, result.rows[0].password, function(err, resultQuery) {
// 				if (resultQuery) {
// 					req.session.user = {
// 						name: result.rows[0].name,
// 						email: result.rows[0].email
// 					}
// 					res.redirect("/profile")
// 				}
// 				else {					
// 					res.redirect("/login")}
					
// 			})
// 		}
// 	}
// });