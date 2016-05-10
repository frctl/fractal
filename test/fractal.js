'use strict';

const chai            = require('chai');
const expect          = chai.expect;

const pkg             = require('../package.json');
const app             = require('../src/fractal');
const Cli             = require('../src/cli');
const Web             = require('../src/web');
const ComponentSource = require('../src/core/api/components');
const DocSource       = require('../src/core/api/docs');

describe('Fractal', function(){

    it('is configurable');

    it('is an event emitter');

    describe('.cli', function(){
        it('is a command line interface handler', function(){
            expect(app.cli).to.be.instanceof(Cli);
        });
    });

    describe('.web', function(){
        it('is a web interface handler', function(){
            expect(app.web).to.be.instanceof(Web);
        });
    });

    describe('.components', function(){
        it('is a component source instance', function(){
            expect(app.components).to.be.instanceof(ComponentSource);
        });
    });

    describe('.docs', function(){
        it('is a documentation source instance');
    });

    describe('.version', function(){
        it('matches the version number set in the package.json file', function(){
            expect(app.version).to.equal(pkg.version);
        });
    });

    describe('.source(type)', function(){
        it('returns a ComponentSource singleton when type is \'components\'', function(){
            expect(app.source('components')).to.be.an.instanceof(ComponentSource);
            expect(app.source('components')).to.equal(app.source('components'));
        });
        it('returns a DocSource singleton when type is \'docs\'', function(){
            expect(app.source('docs')).to.be.an.instanceof(DocSource);
            expect(app.source('docs')).to.equal(app.source('docs'));
        });
    });

});
