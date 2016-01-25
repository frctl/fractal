'use strict';

const expect     = require("chai").expect;
const path       = require("path");
const nunjucks    = require('nunjucks');

const view       = require('../src/view');

describe("view", function(){

    describe("module.exports", function() {
        var viewInstance = null;
        before(function(){
            var viewsPath = path.join(__dirname, 'fixtures/views');
            viewInstance = view(viewsPath);
        });
        it("returns an Nunjucks environment instance when called with a file path", function(){
            expect(viewInstance).to.be.an.instanceof(nunjucks.Environment);
        });
        it("provides access to a global `theme` template variable", function(){
            expect(viewInstance.getGlobal('theme')).to.be.an('object');
        });
        it("can load template files from the filesystem", function(){
            expect(viewInstance.getTemplate('example.nunj')).to.be.an('object');
        });
        it("throw an error if a template file is not found", function(){
            expect(viewInstance.getTemplate.bind(viewInstance, 'notfound.nunj')).to.throw(Error);
        });
    });

});
