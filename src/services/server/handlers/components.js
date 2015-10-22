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
        var variant = components.resolve('@button::swig');
        variant.renderView(null, true).then(function(view){
            res.send(view);
        });
    });
};

/*
 * Render the component view page.
 */

handlers.component = function(req, res) {

    res.send('component');
};