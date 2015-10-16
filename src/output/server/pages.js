
/*
 * Export the pages route callbacks.
 */

var pages = exports = module.exports = {};

/*
 * Render the index page.
 */

pages.index = function(req, res){

    res.send('homepage');
};

/*
 * Render a generic page.
 */

pages.page = function(req, res){

    res.send('page');
};