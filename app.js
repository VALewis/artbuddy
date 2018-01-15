// configuration ====================================================
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cookieparser = require('cookie-parser');
require('dotenv').load();
const pg = require('pg');
const session = require('express-session');
const Sequelize = require('sequelize');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// connection to database using postgres and sequelize ==============
const Client = pg.Client
const client = new Client ({
	user: process.env.appUser,
	host: process.env.host,
	password: process.env.password,
	database: process.env.database,
	webport: process.env.webport,
	port: 5432 
});

client.connect();

const dbSeq = require('./databases/dbSequelize.js')
dbSeq.sequelize.sync()

// sessions and sequelize store =====================================
app.use(session({
	store: new SequelizeStore({
		db: dbSeq.sequelize
	}),
	secret: '23j354jl45j',
	resave: true,
	saveUnininitialized: true
}));


// views/middleware =================================================
app.use(cookieparser());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine', 'pug')

// routes ===========================================================
require('./routes/index.js')(app, dbSeq, bcrypt)
require('./routes/signup.js')(app, dbSeq, bcrypt)
require('./routes/profile.js')(app, client)
require('./routes/buddymatch.js')(app, dbSeq)
require('./routes/logout')(app)

// launch app =======================================================
app.listen(process.env.webport, () => {
	console.log('listening to port', process.env.webport)
});