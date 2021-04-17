const express = require('express')
const Router = express.Router()
const controllers = require("./controllers")
const {isAuthenticated, withPermission} = require('../../authentication')
const formidable = require('../../middlewares/formidable')

Router.post('/create', isAuthenticated, withPermission("Forms Manager"), controllers.createForm)

Router.get('/', isAuthenticated, withPermission("Forms Manager"), controllers.getForms)

Router.get('/:name/details', controllers.getForm)

Router.post('/:name/submit', formidable, controllers.validateConfig, controllers.submit)

Router.get('/:name/submissions', isAuthenticated, withPermission("Forms Manager"), controllers.getFormSubmissions)

Router.get('/file/:name/:submissionId/:fileName', isAuthenticated, withPermission("Forms Manager"), controllers.getFile)

Router.patch('/:name/:property', isAuthenticated, withPermission("Forms Manager"), controllers.updateDetails)

Router.delete('/delete', isAuthenticated, withPermission("Forms Manager"), controllers.deleteForm)


module.exports = Router