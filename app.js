// configuration ==================
const express = require('express');
const app = express();
const pg = require('pg');
const bodyParser = require('body-parser')
const cookieparser = require('cookie-parser')
const morgan = require('morgan');
const session = require('express-session');
require('dotenv').load();
const bcrypt = require('bcrypt')

const Client = pg.Client
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
const query1 = {
  text:`CREATE TABLE IF NOT EXISTS user_accounts(
    id serial primary key,
    fullname text,
    email text,  
    password text not null,
    age integer,
    gender text);`
}

// TRUNCATE user_interests, user_accounts;

// const query2 = {
//   text:`CREATE TABLE IF NOT EXISTS interests(
//     hobby text,
//     email text,  
//     password text not null,
//     age integer,
//     gender text);`
// }


client.query(query1, (err, result) => {
  if (err) throw err
});

// client.query(query2, (err, result) => {
//   if (err) throw err
// });

// views/middleware =============
app.use(morgan('dev'));
app.use(cookieparser());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine', 'pug')

// sessions ==========
app.use(session({
  secret: '23j354jl45j',
  resave: true,
  saveUnininitialized: true
}));

// routes =========================
require('./routes/index.js')(app, client)
require('./routes/signup.js')(app, client)
require('./routes/profile.js')(app, client)
require('./routes/logout')(app)

// launch app =====================
app.listen(process.env.webport, () => {
    console.log('listening to port', process.env.webport)
});
