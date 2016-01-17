'use strict';

const expect     = require("chai").expect;
const path       = require("path");
const proxyquire = require('proxyquire');
const sinon      = require('sinon');
const nunjucks    = require('nunjucks');

const view       = require('../src/view');

describe("view", function(){

    describe("module.exports", function() {
        var viewInstance = null;
        before(function(){
            var viewsPath = path.resolve('./fixtures/views');
            viewInstance = view(viewsPath);
        });
        it("returns an Nunjucks environment instance when called with a file path", function(){
            expect(viewInstance).to.be.an.instanceof(nunjucks.Environment);
        });
        it("provides access to a global `fractal` template variable and it's properties", function(){
            expect(viewInstance.getGlobal('fractal')).to.be.an('object');
            expect(viewInstance.getGlobal('fractal')).to.have.all.keys(['statuses','config','highlight']);
        });
    });

});
