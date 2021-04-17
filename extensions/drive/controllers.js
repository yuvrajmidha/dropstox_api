
const fs = require('fs');
const fileTypes = require('./types.json')
const handler = require('../../scripts/handler');
const formidable = require('formidable');
const path = require('path')
const File = require('./model')


//Upload a file
exports.upload = (req, res) => {

    const form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {

        if (err) return handler.error(res, 400, err, err.message)

        //Get File Type
        const fileFamily = fileTypes.filter(({category, types}) => types.includes(`${files.file.type}`))[0]
        if(!fileFamily) return handler.error(res, 400, {file: {name: "Codbrix File Error", fileType: files.file.type, message: "Invalid File Type"}}, "Not a valid file type.")


        var oldPath = files.file.path;
        var newPath = 'content/' + files.file.name
        var rawData = fs.readFileSync(oldPath)

        fs.writeFile(newPath, rawData, function (err) {
            if (err) return handler.error(res, 400, err, err.message)
            else {

                const newFile = new File({
                    name: files.file.name,
                    capion: fields.caption,
                    category: fileFamily.category,
                    description: fields.description,
                    fileType: files.file.type,
                    tags: fields?.tags?.split(',')
                })

                newFile.save()
                    .then(result => handler.success(res, 201, result, "File uploaded succesfully", {}))
                    .catch(err => handler.error(res, 400, err, err.message))
            }
        })
    })
}

//delete a file
exports.delete = (req, res) => {

    const deleteFiles = (files, callback) => {
        if (files.length == 0) callback();
        else {
            var f = files.pop();
            fs.unlink(`content/${f}`, function (err) {
                if (err) callback(err);
                else {
                    File.deleteOne({ name: f })
                        .then(result => deleteFiles(files, callback))
                        .catch(err => callback(err))

                }
            });
        }
    }

    deleteFiles(req.body.files, (err) => {
        if (err) return handler.error(res, 400, err, err.message)
        else return handler.success(res, 200, {}, "Files deleted successfully.", {})
    })

}

//edit details
exports.edit = (req, res) => {

    File.updateOne({ name: req.body.fileName }, {
        $set: {
            caption: req.body.caption,
            tags: req.body.tags,
            description: req.body.description
        }
    })
        .then(result => handler.success(res, 201, result, "File modified succesfully", {}))
        .catch(err => handler.error(res, 400, err, err.message))

}

//Get all files with specific file type
exports.getFiles = (req, res) => {

    File.find({category: req.params.type}).or([
        {name: {$regex: req.query?.search, $options: "i"}},
        {tags: {$regex: req.query?.search, $options: "i"}},
        {description: {$regex: req.query?.search, $options: "i"}},
        {caption: {$regex: req.query?.search, $options: "i"}},
    ])
    .then(result =>
        handler.success(res, 200, result, `Found ${result.length} results.`, {})
    ).catch(err =>
        handler.error(res, 400, err, err.message)
    )

}

//File public link. Access Permissions will be released in future.
exports.getFile = (req, res) => {

    res.sendFile(path.resolve(`content/${req.params.name}`))

}

exports.getFileDetails = async (req, res) => {

    const file = await File.findOne({name: req.params.name})

    handler.success(res, 200, file, file ? "Found" : "File not found.", {})
    
}