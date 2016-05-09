'use strict';

const Path            = require('path');
const chai            = require('chai');
const chaiAsPromised  = require('chai-as-promised');
const sinon           = require('sinon');
const expect          = chai.expect;

const fractal         = require('../src/fractal');
const ComponentSource = require('../src/components/source');
const DocsSource      = require('../src/docs/source');

chai.use(chaiAsPromised);

describe('fractal', function(){

    

    describe('.engine()', function(){
        it('adds an engine', function(){
            fractal.engine('foo', 'fooEngine', {foo:'bar'});
            expect(fractal.engine('foo')).to.be.an('object');
        });
        it('does not require configuration', function(){
            fractal.engine('bar', 'barEngine');
            const engine = fractal.engine('bar');
            expect(engine).to.be.an.an('object');
        });
        it('returns an uninstantiated engine description', function(){
            const config = {foo:'bar'};
            fractal.engine('baz', 'bazEngine', config);
            const engine = fractal.engine('baz');
            expect(engine).to.be.an.an('object');
            expect(engine).to.have.a.property('engine');
            expect(engine).to.have.a.property('config');
            expect(engine.config).to.equal(config);
            expect(engine.engine).to.equal('bazEngine');
        });
        it('returns the fractal instance when setting', function(){
            expect(fractal.engine('bar', 'barEngine', {foo:'bar'})).to.equal(fractal);
        });
    });

    describe('.load()', function(){
        it('returns a promise that resolves to an object of loaded sources', function(){
            const prom = fractal.load();
            expect(prom).to.eventually.be.an('object');
            expect(prom).to.eventually.have.a.property('components');
            expect(prom).to.eventually.have.a.property('docs');
            expect(prom.then(p => p.components)).to.eventually.equal(fractal.components);
            expect(prom.then(p => p.docs)).to.eventually.equal(fractal.docs);
        });
        it('calls load() on all sources', function(){
            const components       = fractal.source('components');
            const docs            = fractal.source('docs');
            const componentLoadSpy = sinon.spy(components, 'load');
            const pageLoadSpy      = sinon.spy(docs, 'load');
            return fractal.load().then(() => {
                expect(componentLoadSpy.calledOnce).to.be.true;
                expect(pageLoadSpy.calledOnce).to.be.true;;
            });
        });
    });

    describe('.source(type)', function(){
        it('returns a ComponentSource singleton when type is \'component\'', function(){
            expect(fractal.source('components')).to.be.an.instanceof(ComponentSource);
            expect(fractal.source('components')).to.equal(fractal.source('components'));
        });
        it('returns a DocsSource singleton when type is \'page\'', function(){
            expect(fractal.source('docs')).to.be.an.instanceof(DocsSource);
            expect(fractal.source('docs')).to.equal(fractal.source('docs'));
        });
    });

    describe('.components', function(){
        it('is a ComponentSource singleton', function(){
            expect(fractal.components).to.be.an.instanceof(ComponentSource);
            expect(fractal.components).to.equal(fractal.components);
        });
    });

    describe('.docs', function(){
        it('is a DocsSource singleton', function(){
            expect(fractal.docs).to.be.an.instanceof(DocsSource);
            expect(fractal.docs).to.equal(fractal.docs);
        });
    });

    describe('.set()', function(){
        it('sets a config value', function(){
            fractal.set('foo', 'bar');
            expect(fractal.get('foo')).to.equal('bar');
        });
        it('returns the fractal instance', function(){
            expect(fractal.set('foobar', 'foobar')).to.equal(fractal);
        });
    });

    describe('.get()', function(){
        it('gets a config value', function(){
            fractal.set('bar', 'foo');
            expect(fractal.get('bar')).to.equal('foo');
        });
        it('returns undefined if not set', function(){
            expect(fractal.get('xyxyxyx')).to.equal(undefined);
        });
        it('returns the full configuration object if called without arguments', function(){
            const config = require('../settings.js');
            expect(fractal.get()).to.equal(config);
        });
    });

    // it('should inherit from event emitter', function(done){
    //     fractal.on('foobar', function(){});
    //     fractal.emit('foobar');
    // });

});
