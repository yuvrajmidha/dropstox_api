const formidable = require('formidable');
const handler = require('../scripts/handler');

module.exports = (req, res, next) => {
    const form = new formidable.IncomingForm();
    
    form.maxFileSize = 2 * 1024 * 1024;
    //Max files size is now 2KB

    form.parse(req, async function (err, fields, files) {

        if(err) return handler.error(res, 400, err, err.message)

        req.form = {}

        req.form.fields = fields
        req.form.files = files
        
        next()

    })
}