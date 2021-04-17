const express = require('express')
const app = express()

//requiring  basic middlewares
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require('mongoose');
const session = require("express-session")
const MongoStore = require("connect-mongo")(session);
const path = require("path");
const morgan = require('morgan')
const extensions = require('./routes')

require('dotenv').config()

//database
const {connectionDB} = require('./config/db')
connectionDB()

//bodyparser
app.use(express.json({extended: true}))
app.use(express.urlencoded({extended: true}))

app.use('/public', express.static('static'))

app.use('/template', express.static('pages'))

app.use(cookieParser())
app.use(cors());
app.use(morgan('dev'))

// Express Session
app.use(
    session({
      secret: "secret-key",
      resave: false,
      saveUninitialized: true,
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 24 * 60 * 60
      }),
      cookie: {
        maxAge: 24 * 60 * 60 * 1000
      }
    })
  );

//extensions
app.use(extensions)

//exporting the file 
module.exports = app 
