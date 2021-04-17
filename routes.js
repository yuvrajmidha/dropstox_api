const express = require('express')
const Router = express.Router()

const authRoutes = require("./authentication/routes")
const driveRoutes = require('./extensions/drive/routes')
const formRoutes = require("./extensions/forms/routes")

Router.use('/auth', authRoutes)
Router.use('/forms', formRoutes)
Router.use('/drive', driveRoutes)

module.exports = Router