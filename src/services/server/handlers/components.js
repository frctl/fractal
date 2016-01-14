/**
 * Module dependencies.
 */

var Promise         = require('bluebird');
var path            = require('path');
var _               = require('lodash');

var utils           = require('../../../utils');
var highlighter     = require('../../../highlighter');

/*
 * Export the component route handlers.
 */

var handlers = exports = module.exports = {};
handlers.params = {};

/*
 * Set some common variables for the components section
 */

handlers.common = function(req, res, next) {
    res.locals.section = {
        handle: 'components',
        baseUrl: '/components',
    };
    next();
};

/*
 * Resolve a component from a path parameter
 */

handlers.params.component = function(req, res, next, componentPath) {
    var entity = req._components.resolve(componentPath);
    if (entity.type == 'component') {
        req._component = entity;
        req._variant = entity.default;
    } else if (entity.type == 'variant') {
        req._component = entity._component;
        req._variant = entity;
    }
    req._type = entity.type;
    req._component.renderAll().then(function(comp){
        res.locals.component = comp;
        res.locals.variant = _.find(comp.variants, 'handle', req._variant.handle);
        next();
    }).catch(function(e){
        next(e);
    });
};

/*
 * Resolve a component file from a path parameter
 */

handlers.params.componentFile = function(req, res, next, componentFile) {
    var pathInfo        = path.parse(componentFile);
    var entity          = req._components.resolve(pathInfo.dir);
    var variant         = (entity.type == 'component') ? entity.getVariant() : entity;
    if (!_.isEmpty(pathInfo.ext)) {
        res.locals.contents = variant.getFile(pathInfo.base).getContents();
        return next();
    } else {
        switch(pathInfo.name) {
            case 'template':
            case 'view':
                res.locals.contents = variant.getFile(variant.view).getContents();
                return next();
                break;
            case 'context':
                variant.getContextString().then(function(str){
                    res.locals.contents = str;
                    return next();
                });
                break;
            case 'rendered':
                variant.renderView().then(function(rendered){
                    res.locals.contents = rendered;
                    next();
                });
                break;
            case 'config':
                res.locals.contents = JSON.stringify(variant._component._config, null, 4);
                return next();
                break;
        }

    }
};

/*
 * Render the component list page.
 */

handlers.index = function(req, res) {
    // res.json(req.app.locals.components);
    res.render('components/index');
};

/*
 * Display a list of a collection of components
 */

handlers.list = function(req, res) {
    var data = {};
    var notHidden = req._components.filter('hidden', false);
    switch(req.params.collection){
        case 'all':
            data.title = 'All components';
            data.items = notHidden.flatten().components;
        break;
    }
    res.render('components/list', {
        list: data
    });
};

/*
 * Show the component detail page.
 */

handlers.detail = function(req, res) {
    res.render('components/component');
};

/*
 * Render the contents of a component file in the browser
 */

handlers.preview = function(req, res) {
    res.render('components/preview');
};

/*
 * Render the contents of a component file as an embed
 */

handlers.previewEmbed = function(req, res) {
    res.locals.embedded = true;
    res.render('components/preview', {
        embedded: true
    });
};

/*
 * Display the raw contents of a component file
 */

handlers.raw = function(req, res) {
    res.setHeader("Content-Type", "text/plain");
    res.render('components/raw', {
        contents: res.locals.contents
    });
};

/*
 * Render the highlighted contents of a component file
 */

handlers.highlight = function(req, res) {
    res.render('components/highlight', {
        contents: highlighter(res.locals.contents)
    });
};
