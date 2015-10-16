
/*
 * Export the component route callbacks.
 */

var misc = exports = module.exports = {};

/*
 * Respond to a favicon request
 */

misc.favicon = function(req, res) {

    return res.status(404).send('Not found');
};

