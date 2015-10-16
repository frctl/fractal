
/*
 * Export the component route callbacks.
 */

var components = exports = module.exports = {};

/*
 * Render the component list page.
 */

components.index = function(req, res) {

    res.send('component index');
};

/*
 * Render the component view page.
 */

components.component = function(req, res) {

    res.send('component');
};