/**
 * Module dependencies.
 */
var logger          = require('winston');
var NotFoundError   = require('../../../errors/notfound');
var highlighter     = require('../../../highlighter');

/*
 * Export the misc route handlers.
 */

var handlers = exports = module.exports = {};

/*
 * Respond to a favicon request
 */

handlers.favicon = function(req, res) {
    // TODO: Add a favicon option
    return res.status(404).send('Not found');
};

/*
 * Error handler
 */

handlers.error = function(err, req, res, next) {
    logger.error(err.message);
    if (res.headersSent) {
        return next(err);
    }
    if (err instanceof NotFoundError) {
        return res.status(404).render('pages/404', {
            message: err.message,
            stack: highlighter(err.stack),
            error: err
        });
    } else {
        return res.render('pages/500', {
            message: err.message,
            stack: highlighter(err.stack),
            error: err
        });
    }

};
