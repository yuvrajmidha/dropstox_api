const Routes = require('./routes')
const Middlewares = require('./middlewares')

//Everything will be exported from here.
module.exports.authRoutes = Routes
module.exports.isAuthenticated = Middlewares.isAuthenticated
module.exports.withPermission = Middlewares.withPermission
module.exports.isVerified = Middlewares.isVerified