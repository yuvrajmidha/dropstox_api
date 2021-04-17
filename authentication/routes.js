const express = require('express')
const Router = express.Router()
const controllers = require("./controllers")
const {isAuthenticated, withPermission} = require('./middlewares')

Router.post('/signup', controllers.signUp)

Router.post('/signin', controllers.signIn)

Router.get('/signout', isAuthenticated, controllers.signOut)

Router.patch('/update/email', isAuthenticated, controllers.updateEmail)

Router.patch('/update/role', isAuthenticated, withPermission("Master"), controllers.updateRole)

Router.patch('/update/password', isAuthenticated, controllers.updatePassword)

Router.delete('/delete', isAuthenticated, controllers.deleteAccount)

module.exports = Router