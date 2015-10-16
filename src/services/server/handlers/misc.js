
/*
 * Export the misc route handlers.
 */

var handlers = exports = module.exports = {};

/*
 * Respond to a favicon request
 */

handlers.favicon = function(req, res) {

    return res.status(404).send('Not found');
};

