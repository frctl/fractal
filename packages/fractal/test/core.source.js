'use strict';

const chai    = require('chai');
const expect  = chai.expect;

const fractal = require('../src/fractal')();
const Source  = require('../src/core/entities/source');

describe('EntitySource', function(){

    let source;

    beforeEach(function(){
        source = new Source('foo', fractal);
    });

    describe('.label', function(){
        it('has a label generated from it\'s name', function(){
            expect(source.label).to.equal('Foo');
        });
    });

    describe('.title', function(){
        it('has a title the same as it\'s label', function(){
            expect(source.title).to.equal('Foo');
        });
    });

    it('is an event emitter', function(){
        expect(source.hasMixedIn('Emitter')).to.be.true;
    });
    it('is configurable', function(){
        expect(source.hasMixedIn('Configurable')).to.be.true;
    });
    it('is a collection', function(){
        expect(source.hasMixedIn('Collection')).to.be.true;
    });

});
