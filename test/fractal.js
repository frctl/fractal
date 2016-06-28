'use strict';

const chai            = require('chai');
const expect          = chai.expect;

const pkg             = require('../package.json');
const app             = require('../src/fractal')();
const Cli             = require('../src/cli');
const Web             = require('../src/web');
const ComponentSource = require('../src/api/components');
const DocSource       = require('../src/api/docs');

describe('Fractal', function(){

    it('is an event emitter', function(){
        expect(app.hasMixedIn('Emitter')).to.be.true;
    });
    it('is configurable', function(){
        expect(app.hasMixedIn('Configurable')).to.be.true;
    });

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

    // describe('.load()', function(){
    //     it('returns a promise that resolves to an object of loaded sources', function(){
    //         const prom = fractal.load();
    //         expect(prom).to.eventually.be.an('object');
    //         expect(prom).to.eventually.have.a.property('components');
    //         expect(prom).to.eventually.have.a.property('docs');
    //         expect(prom.then(p => p.components)).to.eventually.equal(fractal.components);
    //         expect(prom.then(p => p.docs)).to.eventually.equal(fractal.docs);
    //     });
    //     it('calls load() on all sources', function(){
    //         const components       = fractal.source('components');
    //         const docs            = fractal.source('docs');
    //         const componentLoadSpy = sinon.spy(components, 'load');
    //         const pageLoadSpy      = sinon.spy(docs, 'load');
    //         return fractal.load().then(() => {
    //             expect(componentLoadSpy.calledOnce).to.be.true;
    //             expect(pageLoadSpy.calledOnce).to.be.true;;
    //         });
    //     });
    // });

});
