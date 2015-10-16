/**
 * Module dependencies.
 */



/*
 * Export the component route handlers.
 */

var handlers = exports = module.exports = {};

/*
 * Render the component list page.
 */

handlers.index = function(req, res) {
    var fractal = req.app.locals.fractal;
    fractal.getComponents().then(function(components){

        res.send('component index');
    });
};

/*
 * Render the component view page.
 */

handlers.component = function(req, res) {

    res.send('component');
};