
const codes = {
    200: "OK",
    201: "Created",
    202: "Accepted",
    203: "Non-Autoritive Information",
    204: "No Content",
    302: "Found",
    304: "Not Modified",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found"
}

module.exports.success = async (res, status, data, message, {action, params, options}) => {

    return res.status(status).json({
        status: {
            text: codes[status],
            code: status
        },
        message,
        data,
        type: "Success",
        action: {
            status: "Status",
            log: "Lorem Ipsum here"
        }      
    })

}

module.exports.error = (res, status, errors, message) => res.status(status).json({
    status: {
        text: codes[status],
        code: status
    },
    errors,
    message,
    type: "Error"
})