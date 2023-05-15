const {constants} = require('../constants');

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;

    switch (statusCode) {
        case constants.VALIDATION_ERR:
            res.json({title: 'Validation Error', message: err.message, stackTrace: err.stack})
        case constants.NOT_FOUND:
            res.json({title: 'Not Found', message: err.message, stackTrace: err.stack})
        case constants.UNAUTHORIZE:
            res.json({title: 'unauthorized', message: err.message, stackTrace: err.stack})
        case constants.FORBIDDEN:
            res.json({title: 'forbidden', message: err.message, stackTrace: err.stack})
        case constants.SERVER_ERROR:
            res.json({title: 'server error', message: err.message, stackTrace: err.stack})
        default:
            res.json({message: 'No error!'})
            break;
    }


}
module.exports = errorHandler;