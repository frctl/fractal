'use strict';

const chai            = require('chai');
const expect          = chai.expect;

const pkg             = require('../package.json');
const fractal         = require('../src/fractal');
const Cli             = require('../src/cli');
const Web             = require('../src/web');
const ComponentSource = require('../src/core/api/components');

describe('Fractal', function(){

    it('is configurable');

    it('is an event emitter');

    describe('.cli', function(){
        it('is a command line interface handler', function(){
            expect(fractal.cli).to.be.instanceof(Cli);
        });
    });

    describe('.web', function(){
        it('is a web interface handler', function(){
            expect(fractal.web).to.be.instanceof(Web);
        });
    });

    describe('.components', function(){
        it('is a component source instance', function(){
            expect(fractal.components).to.be.instanceof(ComponentSource);
        });
    });

    describe('.docs', function(){
        it('is a documentation source instance');
    });

    describe('.version', function(){
        it('matches the version number set in the package.json file', function(){
            expect(fractal.version).to.equal(pkg.version);
        });
    });

});
