'use strict';

const expect      = require("chai").expect;
const proxyquire  =  require('proxyquire');
const sinon       =  require('sinon');

const testConfig  = require('./fixtures/config');
const config      = require('../config');
const packageJSON = require('../package.json');
const runnerStub  = sinon.stub();
const fractal     = proxyquire('../src/fractal', {
    './services/run': runnerStub
});

describe("fractal", function(){

    beforeEach(function() {
        config._test =  testConfig;
    });

    describe(".version", function() {
        it("return a version number that matches package.json", function(){
            expect(fractal.version).to.equal(packageJSON.version);
        });
    });
    describe(".get()", function() {
        it("return the full the configuration object when called with no arguments", function(){
            expect(fractal.get()).to.equal(config);
        });
        it("get nested configuration items via dot notation", function(){
            expect(fractal.get('_test.nested.name')).to.equal(config._test.nested.name);
        });
    });
    describe(".set()", function() {
        it("set nested configuration items via dot notation", function(){
            fractal.set('_test.foo.bar.baz','foobar');
            expect(config._test.foo.bar.baz).to.equal('foobar');
        });
    });
    describe(".enable()", function() {
        it("set a configuration item to true", function(){
            fractal.enable('_test.toggle');
            expect(config._test.toggle).to.be.true;
        });
    });
    describe(".disable()", function() {
        it("set a configuration item to false", function(){
            fractal.disable('_test.toggle');
            expect(config._test.toggle).to.be.false;
        });
    });
    describe(".enabled()", function() {
        it("check if a configuration item is true", function(){
            expect(fractal.enabled('_test.enabled')).to.be.true;
            expect(fractal.enabled('_test.disabled')).to.be.false;
        });
    });
    describe(".disabled()", function() {
        it("check if a configuration item is false", function(){
            expect(fractal.disabled('_test.enabled')).to.be.false;
            expect(fractal.disabled('_test.disabled')).to.be.true;
        });
    });
    describe(".parseArgv()", function() {
        it("parse the supplied argv argument to extract the command, arguments and options", function(){
            var argv = {
                _: ['commandName','arg1','arg2'],
                e: 'testing',
                example: 'testing',
            };
            var input = fractal.parseArgv(argv);
            expect(input.command).to.equal('commandName');
            expect(input.args).to.be.an('array');
            expect(input.args[0]).to.equal('arg1');
            expect(input.args[1]).to.equal('arg2');
            expect(input.opts).to.be.an('object');
            expect(input.opts.e).to.equal('testing');
            expect(input.opts.example).to.equal('testing');
        });
    });
    describe(".run()", function() {
        before(function() {
            fractal.run({
                _: ['commandName','arg1','arg2'],
                e: 'testing',
                example: 'testing',
            });
        });
        it("set the system root path to the cwd", function(){
            expect(config.system.paths.root).to.equal(process.cwd());
        });
        it("configure the theme");
        it("set the view engine", function(){
            expect(config.components.view.engine).not.to.be.a('string');
            ['ext','name','engine','handler'].forEach(function(key){
                expect(config.components.view.engine[key]).to.be.a('string');
            });
        });
        it("call the application runner", function(){
            expect(runnerStub.calledWith('commandName', ['arg1','arg2'], {
                e: 'testing',
                example: 'testing'
            })).to.be.true;
        });
    });
});
