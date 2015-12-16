/**
 * Module dependencies.
 */

var Promise         = require('bluebird');
var path            = require('path');
var _               = require('lodash');

var utils           = require('../../../utils');

/*
 * Export the pages route handlers.
 */

var handlers = exports = module.exports = {};
handlers.params = {};

handlers.common = function(req, res, next) {
    req.app.locals.section = {
        handle: 'pages',
        baseUrl: '/',
    };
    next();
};

/*
 * Resolve a page from a path parameter
 */

handlers.params.page = function(req, res, next, pagePath) {
    try {
        var page = req._pages.resolve(pagePath);
    } catch(e) {
        try {
            var page = req._themePages.resolve(pagePath);
        } catch(e) {
            // console.log(e.stack);
            return next(utils.httpError('Page not found', 404));
        }
    }
    page.renderContent().then(function(){
        res.locals.page = page.toJSON();
        next();
    });
};

/*
 * Render a generic page.
 */

handlers.page = function(req, res){

    res.render('pages/page');
};
