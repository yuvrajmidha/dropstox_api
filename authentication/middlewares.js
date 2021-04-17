const handler = require('../scripts/handler');


module.exports.isAuthenticated = (req, res, next) => {

    if(req.session.account) next()
    else handler.error(res, 401, {
        type: "Unauthorized", 
        message: "Please Log In to continue", 
        name: "Authentication error"
    }, "Please Log In to continue")

}

//Only allow
module.exports.withPermission = (permission) => (req, res, next) => {

    if(req.session.account.permissions.includes(permission) || req.session.account.permissions.includes("Master")) next()
    else handler.error(res, 401, {
        type: "Unauthorized", 
        message: "You dont have access to continue", 
        name: "Authentication error"
    }, `Seems like you don't have '${permission}' tag. Please contact your administrator`)

}


//IsVerified
module.exports.isVerified = (req, res, next) => {

    if(req.session.account){
        if(req.session.account.verified) next()
        else handler.error(res, 400, {
            type: "Email Validation", 
            message: "Please verify your email to continue.", 
            name: "Authentication error"
        }, "Please Log In to continue")
    }
    else handler.error(res, 401, {
        type: "Unauthorized", 
        message: "Please Log In to continue", 
        name: "Authentication error"
    }, "Please Log In to continue")
    
}