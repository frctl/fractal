/**
 * Module dependencies.
 */

var Promise     = require('bluebird');
var _           = require('lodash');
var fs          = require('fs');
var path        = require('path');
var nunjucks    = require('nunjucks');

var NotFoundError = require('./errors/notfound');
var highlighter = require('./highlighter');

/*
 * Instantiate and export the nunjucks instance.
 */

module.exports = function(viewsPath){

    var nj = new nunjucks.Environment(
        new nunjucks.FileSystemLoader(viewsPath, {
            // TODO: enable template caching, cache bust on file tree change
            watch: true,
            noCache: true
        }), {
            autoescape: false
        }
    );

    nj.addGlobal('utils', {
        highlight: function(str, lang){
            str =  !_.isString(str) ? str.toString() : str;
            return highlighter(str, lang);
        }
    });

    nj.addFilter('resolve', function(p, callback){
        return Promise.resolve(p).then(function(result){
            callback(null, result);
        }).catch(function(e){
            callback(e);
        });
    }, true);

    nj.addExtension('ErrorExtension', new ErrorExtension());

    module.exports = nj;
};

function ErrorExtension() {
    this.tags = ['error'];
    this.parse = function(parser, nodes, lexer) {
        var tok = parser.nextToken();
        var errorType = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        return new nodes.CallExtension(this, 'run', errorType);
    };
    this.run = function(context, errorType) {
        if (errorType == '404') {
            throw new NotFoundError('Not Found');
        } else {
            throw new Error('Server error');
        }
    };
}
