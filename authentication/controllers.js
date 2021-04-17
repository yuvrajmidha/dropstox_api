const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const Account = require('./model');
const handler = require('../scripts/handler');
const Validator = require('validatorjs');

//Sign Up User
exports.signUp = async (req, res) => {

    //Hash Password
    const salt = await bcrypt.genSalt(10)
    var hashPassword = ""

    if (req.body.password) hashPassword = await bcrypt.hash(req.body.password, salt)
    else return handler.error(res, 400, { name: "Password", message: "Password is must." }, "Password is required")

    const newAccount = new Account({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        role: "user",
        password: hashPassword
    })

    newAccount.save()
        .then(result => handler.success(res, 201, result, "Account created successfully", {}))
        .catch(err => handler.error(res, 400, err.errors, err.code === 11000 ? "Email already exist" : err.message))

}



//Sign In With Email
exports.signIn = async (req, res) => {

    let validation = new Validator(req.body, {
        email: 'required|email',
        password: 'required'
    })

    if (validation.fails()) return handler.error(res, 400, validation.errors, "Please enter valid details.")

    //Check if user is authenticated or not.
    if (req.session.account) return handler.error(res, 400, { name: "Authorization", message: "Already logged in" }, "Somebody is already logged in. Please Logout first")

    //Check if email is correct
    const account = await Account.findOne({ email: req.body.email })
    if (!account) return handler.error(res, 400, { name: "Email", message: "Email not found" }, "Email Address doesn't exist. Please Sign Up.")

    //Check if it is old password
    const oldPassMatch = account.oldPassword ? await bcrypt.compare(req.body.password, account.oldPassword) : 0
    if (oldPassMatch) return handler.error(res, 400, { name: "Password", message: "Password was changed", date: account.passwordChangedOn}, "Your password was changed a while ago. If this was not you please reset your password.")

    //Check if password is correct
    const passMatch = await bcrypt.compare(req.body.password, account.password)
    if (!passMatch) return handler.error(res, 400, { name: "Password", message: "Password mismatched" }, "Password did not match.")

    if(validation.passes() && account && passMatch){
        //Now create a session for user
        req.session.account = account
        handler.success(res, 200, req.session.account, "Logged In Successfully.", {})
    }

}


//Sign Out
exports.signOut = (req, res) => {

    req.session.account = null
    handler.success(res, 200, {}, "Logged Out.", {})

}


//Send Code

//Verify Code and Reset Password

//Verify Code and Verify Email

//Update Email
exports.updateEmail = async (req, res) => {

    let validation = new Validator(req.body, {
        email: 'required|email',
    })

    if (validation.fails()) return handler.error(res, 400, validation.errors, "Please enter valid email address.")

    //Check if email exist
    const emailExist = await Account.findOne({ email: req.body.email })
    if(emailExist) return handler.error(res, 400, { name: "Email", message: "Email already exists" }, "Email Address already exist. Please enter another email.")

    Account.updateOne({ _id: req.session.account._id }, {
        $set: {
            email: req.body.email,
            verified: false
        }
    }).then(result => {

        req.session.account.verified = false
        req.session.account.email = req.body.email
        handler.success(res, 200, result, "Email updated successfully", {})

    }).catch(err => {

        handler.error(res, 400, err.errors, err.message)

    })

}

//Update Role and Permissions
exports.updateRole = async (req, res) => {

    let validation = new Validator(req.body, {
        role: 'required',
        permissions: 'required'
    })

    if (validation.fails()) return handler.error(res, 400, validation.errors, "Please enter valid details.")

    Account.updateOne({ _id: req.session.account._id }, {
        $set: {
            role: req.body.role,
            permissions: req.body.permissions
        }
    }).then(result => {

        handler.success(res, 200, result, "Updated role and permissions successfully.", {})

    }).catch(err => {

        handler.error(res, 400, err.errors, err.message)

    })

}

//Change Password
exports.updatePassword = async (req, res) => {

    let validation = new Validator(req.body, {
        newPassword: 'required',
        oldPassword: 'required'
    })

    if (validation.fails()) return handler.error(res, 400, validation.errors, "Please enter valid details.")

    //Check if old password is correct
    const passMatch = await bcrypt.compare(req.body.oldPassword, req.session.account.password)
    if (!passMatch) return handler.error(res, 400, { name: "Password", message: "Password mismatched" }, "Old Password did not match.")

    if(validation.passes() && passMatch){

        //Hass Password
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(req.body.newPassword, salt)

        Account.updateOne({ _id: req.session.account._id }, {
            $set: {
                password: hashPassword,
                oldPassword: req.session.account.password,
                passwordChangedOn: Date.now()
            }
        }).then(result => {
    
            handler.success(res, 200, result, "Updated password successfully.", {})
    
        }).catch(err => {
    
            handler.error(res, 400, err.errors, err.message)
    
        })
    }

}

//Delete User
exports.deleteAccount = (req, res) => {

    Account.deleteOne({_id: req.session.account._id}).then(result => {

        req.session.account = null
        handler.success(res, 200, result, "Deleted account successfully.", {})

    }).catch(err => {
        handler.error(res, 400, err.errors, err.message)  
    })

}
