'use strict';

const expect      = require("chai").expect;
const path        = require("path");
const proxyquire  = require('proxyquire');
const sinon       = require('sinon');
const nunjucks    = require('nunjucks');

const serverStub    = sinon.stub();
const builderStub   = sinon.stub();
const generatorStub = sinon.stub();
const initStub      = sinon.stub();
const runner        = proxyquire('../src/services/run', {
    './server/server': serverStub,
    './builder/builder': builderStub,
    './generator/generator': generatorStub,
    './init': initStub
});

describe("service runner", function(){

    describe("module.exports", function() {

    });

});
