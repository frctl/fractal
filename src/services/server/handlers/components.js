    /**
 * Module dependencies.
 */

var Promise     = require('bluebird');

var utils = require('../../../utils');

/*
 * Export the component route handlers.
 */

var handlers = exports = module.exports = {};
handlers.params = {};

/*
 * Set some common variables for the components section
 */

handlers.common = function(req, res, next) {
    req.app.locals.section = {
        title: "Components",
        baseUrl: '/components',
        navItems: req._components.filter('hidden', false).toJSON()
    };
    next();
};

/*
 * Resolve a component from a path parameter
 */

handlers.params.component = function(req, res, next, componentPath) {
    try {
        var entity = req._components.resolve(componentPath);
        if (entity.type == 'component') {
            req._component = entity;
            req._variant = entity.getVariant('base');
        } else if (entity.type == 'variant') {
            req._component = entity._component;
            req._variant = entity;
        }
        res.locals.component = req._component.toJSON();
        res.locals.variant = req._variant.toJSON();
        var rendered = req._variant.renderView();
        Promise.join(rendered, function(rendered){
            res.locals.rendered = rendered;
            next();
        })
    } catch(e) {
        next(utils.httpError('Component not found', 404));
    }
};

/*
 * Resolve a component file from a path parameter
 */

handlers.params.componentFile = function(req, res, next, componentFile) {
    req.componentFile = componentFile;
    next();
};

/*
 * Render the component list page.
 */

handlers.index = function(req, res) {
    res.json(req.app.locals.components);
    // res.render('components/index');
};

/*
 * Show the component detail page.
 */

handlers.detail = function(req, res) {
    res.render('components/detail');
};

/*
 * Render the contents of a component file in the browser
 */

handlers.preview = function(req, res) {

};

/*
 * Display the raw contents of a component file
 */

handlers.raw = function(req, res) {

};

/*
 * Render the highlighted contents of a component file
 */

handlers.highlight = function(req, res) {

};