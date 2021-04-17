const express = require('express')
const Router = express.Router()
const controllers = require("./controllers")
const {isAuthenticated, withPermission} = require('../../authentication')

Router.post('/upload', isAuthenticated, withPermission("File Manager"), controllers.upload)

Router.delete('/delete', isAuthenticated, withPermission("File Manager"), controllers.delete)

Router.patch('/edit', isAuthenticated, withPermission("File Manager"), controllers.edit)

Router.get('/:type', isAuthenticated, withPermission("File Manager"), controllers.getFiles)

Router.get('/public/:name', controllers.getFile)

Router.get('/public/details/:name', controllers.getFileDetails)


module.exports = Router