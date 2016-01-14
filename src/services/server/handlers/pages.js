/**
 * Module dependencies.
 */

var Promise         = require('bluebird');
var path            = require('path');
var _               = require('lodash');

var highlighter     = require('../../../highlighter');
var utils           = require('../../../utils');

/*
 * Export the pages route handlers.
 */

var handlers = exports = module.exports = {};
handlers.params = {};

/*
 * Resolve a page from a path parameter
 */

handlers.params.page = function(req, res, next, pagePath) {
    try {
        var page = req._pages.resolve(pagePath);
        page.renderContent().then(function(){
            res.locals.page = page.toJSON();
            next();
        });
    } catch(err) {
        return res.status(404).render('pages/404', {
            message: err.message
        });
    }
};

/*
 * Render a generic page.
 */

handlers.page = function(req, res){
    var section = res.locals.section || {
        handle: 'pages',
        baseUrl: '/',
    };
    res.render('pages/page', {
        section: section
    });
};
