// set up necessary tools ========
var express = require('express');
var app = express();
const pg = require('pg');
var passport = require('passport');
var flash = require('connect-flash')

const Client = pg.Client
const bodyParser = require('body-parser')
var cookieparser = require('cookie-parser')
var morgan = require('morgan');
var session = require('express-session');
require('dotenv').load();
var bcrypt = require('bcrypt')

// configuration ==================
const client = new Client({
  user: process.env.appUser,
  host: process.env.host,
  password: process.env.password,
  database: process.env.database,
  webport: process.env.webport,
  port: 5432
});

client.connect((err) => console.log(err));

// initializing database ==========
const query1 ={
  text:`CREATE TABLE IF NOT EXISTS users(
    id serial primary key,
    fullname text,
    email text,
    username text,    
    password text,
    age integer,
    gender text);`
}

client.query(query1, (err, result) => {
  if (err) throw err
});

// set up express app =============
app.use(morgan('dev'));
app.use (cookieparser());
app.use (express.static('public'));
app.use (bodyParser.urlencoded({extended:true}));

app.set ('view engine', 'pug')

// requirements passport ==========
app.use (session({
  secret: '23j354jl45j',
  resave: true,
  saveUnininitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// routes =========================
require('./config/passport')(passport);
require('./app/routes.js')(app, passport);
require('./routes/index.js')(app)

// launch app =====================
app.listen(process.env.webport, () => {
    console.log('listening to port', process.env.webport)
});
