const Form = require('./model')
const mongoose = require("mongoose");
const handler = require('../../scripts/handler');
const fs = require('fs');
const path = require('path')

//Create a Form
exports.createForm = (req, res) => {

    const newForm = new Form({
        _id: new mongoose.Types.ObjectId,
        title: req.body.name,
        cover: req.body.cover,
        description: req.body.description,
        name: req.body.name,
        config: req.body.config       
    })

    fs.mkdir(`extensions/forms/data/${newForm.name}/`, (err) => { 

        if (err) { 
            return handler.error(res, 400, err, err.message); 
        } 

        newForm.save()
        .then(result => handler.success(res, 201, result, "Form created successfuly.", {}))
        .catch(err => handler.error(res, 400, err, err.code === 11000 ? "Form name must be unique" : err.message))

    })

    
}

//Form Details
exports.getForms = async (req, res) => {

    const forms = await Form.find({"config.status": req.query.status})
    handler.success(res, 200, forms, `Found ${forms.length} results`, {})

}

exports.getForm = async (req, res) => {

    const form = await Form.findOne({name: req.params.name}, {_id: 0, name: 1, title:1, description: 1, cover: 1, fields: 1, config: 1})
    handler.success(res, 200, form, `Found.`, {})

}

exports.getFormSubmissions = async (req, res) => {

    const form = await Form.findOne({name: req.params.name}, {submissions: 1, _id: 0})
    handler.success(res, 200, form.submissions, `Total Submissions: ${form.submissions.length}`, {})

}

//Export the submissions

//Update Properties
exports.updateDetails = async (req, res) => {

    const property = req.params.property
    const fields = ["title", "name", "description", "config", "fields"]
    var toUpdate = {}

    if(fields.includes(property)) toUpdate[`${property}`] = req.body.value

    Form.updateOne({name: req.params.name}, {$set: toUpdate})
    .then(result => handler.success(res, 200, result, "Updated Successfully", {}))
    .catch(err => handler.error(res, 400, err, err.code === 11000 ? "Form name must be unique" : err.message))

}


exports.deleteForm = async (req, res) => {

    Form.deleteOne({name: req.query.name})
    .then(result => handler.success(res, 200, result, "Deleted Successfully", {}))
    .catch(err => handler.error(res, 400, err, err.message))

}

//Validate form Configrations
exports.validateConfig = async (req, res, next) => {

    const form = await Form.findOne({name: req.params.name})
    if(!form) return handler.error(res, 404, {form : {name: "Codbirx Form Error", error: "Form Not Found Error", message: "We are unable to find this form."}}, "Please check your request url.")

    //Check if Live
    if(form.config.status !== "Accepting") return handler.error(res, 400, {form : {name: "Codbirx Form Error", error: "Form Status Error", message: "This form is not accpeting responses."}}, "This form is currently down.")

    //Check for maximum submissions
    if(form.submissions.length >= form.config.maximumSubmissions) return handler.error(res, 400, {form : {name: "Codbirx Form Error", error: "Form Status Error", message: "This form has reached its maximum submissions limit."}}, "This form responses limit has been reached.")

    //Check for expires status

    //Check if form requires authentication
    const isAuthenticated = req.session.account || false
    if(!isAuthenticated && form.config.authentication) return handler.error(res, 401, {form : {name: "Codbirx Form Error", error: "Form Authentication Error", message: "You are not authorized to fill this form."}}, "Please sign in to continue")

    if(form.config.authentication && isAuthenticated){

        //Check if form has blocked emails
        const isEmailBlocked = form.config.blockedEmails.includes(req.session.account.email)
        if(isEmailBlocked) return handler.error(res, 401, {form : {name: "Codbirx Form Error", error: "Form Authetication Error", message: "You are not authorized to fill this form."}}, "Sorry, You cannot fill this form.")

        //Check if already submitted
        const alreadySubmitted = form.submissions.filter(submission => submission.userId === req.session.account.email).length
        if(!alreadySubmitted && form.config.oneSubmissionPerPerson) return handler.error(res, 401, {form : {name: "Codbirx Form Error", error: "Form Authetication Error", message: "You cannot fill form two times."}}, "You have already submitted this form.")
    }

    req.form.id = form.name
    // req.form.config = form.config
    // req.form.schema = form.fields
    
    next()

}


//Submit the form
exports.submit = (req, res) => {
    

    //Make a id
    const id = new mongoose.Types.ObjectId()
    

    fs.mkdir(`extensions/forms/data/${req.form.id}/${id}`, (err) => { 
        if (err) { 
            return handler.error(res, 400, err, err.message); 
        } 

        var files = []
        
        Object.entries(req.form.files).map(file => {

            var oldPath = file[1].path;
            var newPath = `extensions/forms/data/${req.form.id}/${id}/` + file[0]  + "." + file[1].type.split('/')[1]
            var rawData = fs.readFileSync(oldPath)

            fs.writeFile(newPath, rawData, function (err) {
                if (err) return handler.error(res, 400, err, err.message)
                
            })
            
            files.push(`forms/file/${req.form.id}/${id}/` + file[0] + "." + file[1].type.split('/')[1])

        })

         //Add submission
        Form.updateOne({name: req.form.id}, {$push: {
            submissions: {
                _id: id,
                identity : req.session.account ? req.session.account._id : "Anonymous",
                fields: req.fields,
                files: files,
                submittedOn: Date.now()
            }
        }})
        .then(result => handler.success(res, 200, result, "Form submitted Successfully", {}))
        .catch(err => handler.error(res, 400, err, err.message))

    });

}

exports.getFile = (req, res) => {

    res.sendFile(path.resolve(`extensions/forms/data/${req.params.name}/${req.params.submissionId}/${req.params.fileName}`))

}