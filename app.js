var express = require('express')
var app = express()
var session = require('express-session');
const pg = require("pg")
const Client = pg.Client
const bodyParser = require("body-parser")
var cookieparser = require('cookie-parser')
require('dotenv').load();
var bcrypt = require('bcrypt')

app.use (cookieparser());
app.use (express.static("public"))
app.use (bodyParser.urlencoded({extended:true}))
app.set ('view engine', 'pug')

app.use (session({
  secret: '23j354jl45j',
  resave: true,
  saveUnininitialized: true
}))

const client = new Client({
  user: process.env.appUser,
  host: process.env.host,
  password: process.env.password,
  database: process.env.database,
  webport: process.env.webport,
  port: 5432
})

require("./routes/index.js")(app)

client.connect(function(err) {
    if (err)
        throw err;
    console.log("Connected!");
});

app.listen(process.env.webport, () => {
    console.log("listening to port", process.env.webport)
});
